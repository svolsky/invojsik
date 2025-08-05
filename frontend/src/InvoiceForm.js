import React, { useState, useEffect } from 'react';
import './InvoiceForm.css';

// Ключ для хранения данных в localStorage
const LOCAL_STORAGE_KEY = 'invojsik-draft';

// Начальное, пустое состояние формы
const getInitialFormData = () => ({
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    billFrom: {
        companyName: '', ico: '', dic: '', streetAddress: '', city: '', zipCode: '', country: ''
    },
    billTo: {
        companyName: '', ico: '', dic: '', streetAddress: '', city: '', zipCode: '', country: ''
    },
    items: [{ description: '', quantity: 1, rate: 0 }],
    notes: 'Thanks for your business!',
});

const InvoiceForm = () => {
    const [formData, setFormData] = useState(() => {
        // 1. Загрузка данных при инициализации
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (error) {
                console.error("Error parsing invoice data from localStorage", error);
                return getInitialFormData();
            }
        }
        return getInitialFormData();
    });

    // 2. Сохранение данных в localStorage при любом изменении
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (section, e) => {
        const { name, value } = e.target;
        if (section === 'billFrom' || section === 'billTo') {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value }
            }));
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
        const newItems = [...formData.items, { description: '', quantity: 1, rate: 0 }];
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const handleRemoveItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const calculateTotal = (quantity, rate) => {
        return ((quantity || 0) * (rate || 0)).toFixed(2);
    };

    const subtotal = formData.items.reduce((acc, item) => acc + ((item.quantity || 0) * (item.rate || 0)), 0);
    const taxRate = 0; // Placeholder
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <div className="invoice-form-container">
            <form className="invoice-form">
                <div className="form-header">
                    <h1>INVOICE</h1>
                    <div className="invoice-number">
                        <label htmlFor="invoiceNumber">#</label>
                        <input
                            type="text"
                            name="invoiceNumber"
                            value={formData.invoiceNumber}
                            onChange={(e) => setFormData(prev => ({...prev, invoiceNumber: e.target.value}))}
                        />
                    </div>
                </div>

                <div className="form-row-split">
                    <div className="form-group bill-from">
                        <label>Bill From</label>
                        <div className="bill-from-grid">
                            <div className="form-group grid-col-span-2">
                                <input type="text" name="companyName" placeholder="Company Name" value={formData.billFrom.companyName} onChange={(e) => handleInputChange('billFrom', e)} />
                            </div>
                            <div className="form-group"><input type="text" name="ico" placeholder="ICO" value={formData.billFrom.ico} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                            <div className="form-group"><input type="text" name="dic" placeholder="DIC" value={formData.billFrom.dic} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                            <div className="form-group grid-col-span-2"><input type="text" name="streetAddress" placeholder="Street Address" value={formData.billFrom.streetAddress} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                            <div className="form-group"><input type="text" name="city" placeholder="City" value={formData.billFrom.city} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                            <div className="form-group"><input type="text" name="zipCode" placeholder="Zip Code" value={formData.billFrom.zipCode} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                            <div className="form-group grid-col-span-2"><input type="text" name="country" placeholder="Country" value={formData.billFrom.country} onChange={(e) => handleInputChange('billFrom', e)} /></div>
                        </div>
                    </div>
                    <div className="details-group">
                        <div className="form-group">
                            <label>Date</label>
                            <input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={(e) => setFormData(prev => ({...prev, invoiceDate: e.target.value}))} />
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="date" name="dueDate" value={formData.dueDate} onChange={(e) => setFormData(prev => ({...prev, dueDate: e.target.value}))} />
                        </div>
                        <div className="form-group">
                            <label>Date of Taxable Supply</label>
                            <input type="date" name="dateOfTaxableSupply" value={formData.dateOfTaxableSupply} onChange={(e) => setFormData(prev => ({...prev, dateOfTaxableSupply: e.target.value}))} />
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group bill-to">
                        <label>Bill To</label>
                        <div className="bill-from-grid">
                            <div className="form-group grid-col-span-2"><input type="text" name="companyName" placeholder="Company Name" value={formData.billTo.companyName} onChange={(e) => handleInputChange('billTo', e)} /></div>
                            <div className="form-group"><input type="text" name="ico" placeholder="ICO" value={formData.billTo.ico} onChange={(e) => handleInputChange('billTo', e)} /></div>
                            <div className="form-group"><input type="text" name="dic" placeholder="DIC" value={formData.billTo.dic} onChange={(e) => handleInputChange('billTo', e)} /></div>
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
                                    <td>${calculateTotal(item.quantity, item.rate)}</td>
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
                        <div className="total-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="total-row"><span>Tax ({(taxRate * 100).toFixed(0)}%)</span><span>${tax.toFixed(2)}</span></div>
                        <div className="total-row grand-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
                    </div>
                </div>

                <div className="form-footer">
                    <label>Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))} placeholder="Thanks for your business!"></textarea>
                </div>
            </form>
        </div>
    );
};

export default InvoiceForm;
