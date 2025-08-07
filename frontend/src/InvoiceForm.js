import React, { useState, useEffect } from 'react';
import './InvoiceForm.css';

const LOCAL_STORAGE_KEY = 'invojsik-draft';

const getInitialFormData = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0!
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;

    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 7);
    const dueYyyy = dueDate.getFullYear();
    const dueMm = String(dueDate.getMonth() + 1).padStart(2, '0');
    const dueDd = String(dueDate.getDate()).padStart(2, '0');
    const formattedDueDate = `${dueYyyy}-${dueMm}-${dueDd}`;

    const dateOfTaxableSupply = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
    if (today.getDate() === new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()) {
        // If today is the last day of the current month, set dateOfTaxableSupply to today
        dateOfTaxableSupply.setDate(today.getDate());
        dateOfTaxableSupply.setMonth(today.getMonth());
        dateOfTaxableSupply.setFullYear(today.getFullYear());
    }
    const taxableYyyy = dateOfTaxableSupply.getFullYear();
    const taxableMm = String(dateOfTaxableSupply.getMonth() + 1).padStart(2, '0');
    const taxableDd = String(dateOfTaxableSupply.getDate()).padStart(2, '0');
    const formattedTaxableSupplyDate = `${taxableYyyy}-${taxableMm}-${taxableDd}`;

    return {
        invoiceNumber: '',
        invoiceDate: formattedToday,
        dueDate: formattedDueDate,
        dateOfTaxableSupply: formattedTaxableSupplyDate,
    currency: 'EUR', // Валюта по умолчанию
    billFrom: {
        companyName: '', ico: '', dic: '', streetAddress: '', city: '', zipCode: '', country: 'Slovakia'
    },
    billTo: {
        companyName: '', ico: '', dic: '', streetAddress: '', city: '', zipCode: '', country: ''
    },
    items: [{ description: '', quantity: 1, rate: 0 }],
    notes: '',
    paymentDetails: {
        bankName: '',
        iban: '',
        swift: ''
    },
    isVatExempt: true // New field for VAT exemption
    };
};

const currencySymbols = {
    EUR: '€',
    USD: '$',
    GBP: '£',
};

const InvoiceForm = ({ currency }) => {
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Убедимся, что валюта из настроек имеет приоритет
                parsed.currency = currency;
                // Merge with initial form data to ensure new fields like paymentDetails are present
                return { ...getInitialFormData(), ...parsed,
                    billFrom: { ...getInitialFormData().billFrom, ...parsed.billFrom },
                    billTo: { ...getInitialFormData().billTo, ...parsed.billTo },
                    paymentDetails: { ...getInitialFormData().paymentDetails, ...parsed.paymentDetails }
                };
            } catch (error) {
                console.error("Error parsing invoice data from localStorage", error);
            }
        }
        // Если ничего нет, создаем новую форму с текущей валютой
        return { ...getInitialFormData(), currency };
    });

    useEffect(() => {
        // Обновляем состояние, если валюта изменилась в Settings
        if (formData.currency !== currency) {
            setFormData(prev => ({ ...prev, currency }));
        }
    }, [currency, formData.currency]);

    useEffect(() => {
        // Сохраняем в localStorage при любом изменении данных
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (section, e) => {
        const { name, value } = e.target;
        if (section === 'billFrom' || section === 'billTo' || section === 'paymentDetails') {
            setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        const targetValue = (field === 'description') ? value : (field === 'quantity' ? parseInt(value, 10) : parseFloat(value));
        newItems[index][field] = targetValue;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const handleAddItem = () => {
        setFormData(prev => ({ ...prev, items: [...prev.items, { description: '', quantity: 1, rate: 0 }] }));
    };

    const handleRemoveItem = (index) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };

    const handleReset = () => {
        setFormData({ ...getInitialFormData(), currency });
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    };

    const handleGeneratePdf = async () => {
        try {
            const response = await fetch('/api/invoices/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            } else {
                console.error('Failed to generate PDF:', response.statusText);
                alert('Failed to generate PDF. Please check the console for more details.');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please check the console for more details.');
        }
    };

    const calculateTotal = (quantity, rate) => {
        return ((quantity || 0) * (rate || 0)).toFixed(2);
    };

    const subtotal = formData.items.reduce((acc, item) => acc + ((item.quantity || 0) * (item.rate || 0)), 0);
    const taxRate = 0; // Placeholder
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    const currentCurrencySymbol = currencySymbols[formData.currency] || formData.currency;

    return (
        <div className="invoice-form-container">
            <form className="invoice-form">
                <div className="form-header">
                    <h1>INVOICE</h1>
                    <div className="invoice-number">
                        <label>#</label>
                        <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={(e) => handleInputChange(null, e)} />
                    </div>
                </div>

                <div className="form-row-split">
                    <div className="form-group bill-from">
                        <label>Bill From</label>
                        <div className="bill-from-grid">
                            <div className="form-group grid-col-span-2"><input type="text" name="companyName" placeholder="Company Name" value={formData.billFrom.companyName} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                            <div className="form-group"><input type="text" name="ico" placeholder="Tax ID" value={formData.billFrom.ico} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                            <div className="form-group"><input type="text" name="dic" placeholder="VAT ID" value={formData.billFrom.dic} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                            <div className="form-group grid-col-span-2"><input type="text" name="streetAddress" placeholder="Street Address" value={formData.billFrom.streetAddress} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                            <div className="form-group"><input type="text" name="city" placeholder="City" value={formData.billFrom.city} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                            <div className="form-group"><input type="text" name="zipCode" placeholder="Zip Code" value={formData.billFrom.zipCode} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                            <div className="form-group grid-col-span-2"><input type="text" name="country" placeholder="Country" value={formData.billFrom.country} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                        </div>
                    </div>
                    <div className="details-group">
                        <div className="form-group"><label>Date</label><input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={(e) => handleInputChange(null, e)} /></div>
                        <div className="form-group"><label>Due Date</label><input type="date" name="dueDate" value={formData.dueDate} onChange={(e) => handleInputChange(null, e)} /></div>
                        <div className="form-group"><label>Date of Taxable Supply</label><input type="date" name="dateOfTaxableSupply" value={formData.dateOfTaxableSupply} onChange={(e) => handleInputChange(null, e)} /></div>
                    </div>
                </div>

                <div className="form-row-split">
                    <div className="form-group payment-details">
                        <label>Payment Details</label>
                        <div className="bill-from-grid">
                            <div className="form-group grid-col-span-2"><input type="text" name="bankName" placeholder="Bank Name" value={formData.paymentDetails.bankName} onChange={(e) => handleInputChange('paymentDetails', e)} /></div>
                            <div className="form-group grid-col-span-2"><input type="text" name="iban" placeholder="IBAN" value={formData.paymentDetails.iban} onChange={(e) => handleInputChange('paymentDetails', e)} /></div>
                            <div className="form-group grid-col-span-2"><input type="text" name="swift" placeholder="SWIFT/BIC" value={formData.paymentDetails.swift} onChange={(e) => handleInputChange('paymentDetails', e)} /></div>
                        </div>
                        <div className="checkbox-group">
                            <input type="checkbox" id="isVatExempt" name="isVatExempt" checked={formData.isVatExempt} onChange={(e) => setFormData(prev => ({ ...prev, isVatExempt: e.target.checked }))} />
                            <label htmlFor="isVatExempt">VAT Exempt</label>
                        </div>
                    </div>
                    <div className="form-group bill-to">
                        <label>Bill To</label>
                        <div className="bill-from-grid">
                            <div className="form-group grid-col-span-2"><input type="text" name="companyName" placeholder="Company Name" value={formData.billTo.companyName} onChange={(e) => handleInputChange('billTo', e)} /></div>
                            <div className="form-group"><input type="text" name="ico" placeholder="Tax ID" value={formData.billTo.ico} onChange={(e) => handleInputChange('billTo', e)} /></div>
                            <div className="form-group"><input type="text" name="dic" placeholder="VAT ID" value={formData.billTo.dic} onChange={(e) => handleInputChange('billTo', e)} /></div>
                            <div className="form-group grid-col-span-2"><input type="text" name="streetAddress" placeholder="Street Address" value={formData.billTo.streetAddress} onChange={(e) => handleInputChange('billTo', e)} /></div>
                            <div className="form-group"><input type="text" name="city" placeholder="City" value={formData.billTo.city} onChange={(e) => handleInputChange('billTo', e)} /></div>
                            <div className="form-group"><input type="text" name="zipCode" placeholder="Zip Code" value={formData.billTo.zipCode} onChange={(e) => handleInputChange('billTo', e)} /></div>
                            <div className="form-group grid-col-span-2"><input type="text" name="country" placeholder="Country" value={formData.billTo.country} onChange={(e) => handleInputChange('billTo', e)} /></div>
                        </div>
                    </div>
                </div>

                <div className="items-table">
                    <table>
                        <thead><tr><th>Item</th><th>Quantity</th><th>Rate</th><th>Total</th><th></th></tr></thead>
                        <tbody>
                            {formData.items.map((item, index) => (
                                <tr key={index}>
                                    <td><input type="text" placeholder="Item description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} /></td>
                                    <td><input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} /></td>
                                    <td><input type="number" min="0" step="0.01" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} /></td>
                                    <td>{currentCurrencySymbol}{calculateTotal(item.quantity, item.rate)}</td>
                                    <td><button type="button" className="btn-remove" onClick={() => handleRemoveItem(index)}>&times;</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-add-item" onClick={handleAddItem}>Add Item</button>
                </div>

                <div className="totals-section">
                    <div className="totals">
                        <div className="total-row"><span>Subtotal</span><span>{currentCurrencySymbol}{subtotal.toFixed(2)}</span></div>
                        <div className="total-row"><span>Tax ({(taxRate * 100).toFixed(0)}%)</span><span>{currentCurrencySymbol}{tax.toFixed(2)}</span></div>
                        <div className="total-row grand-total"><span>Total</span><span>{currentCurrencySymbol}{total.toFixed(2)}</span></div>
                    </div>
                </div>

                <div className="form-footer">
                    <label>Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={(e) => handleInputChange(null, e)} placeholder="Thanks for your business!"></textarea>
                </div>
                <div className="form-actions-bottom">
                    <button type="button" className="btn-generate-pdf" onClick={handleGeneratePdf}>Generate PDF</button>
                    <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceForm;
