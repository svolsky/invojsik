import React, { useState } from 'react';
import './InvoiceForm.css';

const InvoiceForm = () => {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [billFrom, setBillFrom] = useState({
        companyName: '',
        ico: '',
        dic: '',
        streetAddress: '',
        city: '',
        zipCode: '',
        country: ''
    });
    const [billTo, setBillTo] = useState('');
    const [notes, setNotes] = useState('Thanks for your business!');
    const [items, setItems] = useState([
        { description: '', quantity: 1, rate: 0 },
    ]);

    const handleBillFromChange = (e) => {
        const { name, value } = e.target;
        setBillFrom(prev => ({ ...prev, [name]: value }));
    };

    const handleBillToChange = (e) => {
        const { name, value } = e.target;
        setBillTo(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        const targetValue = (field === 'description') ? value : (field === 'quantity' ? parseInt(value, 10) : parseFloat(value));
        newItems[index][field] = targetValue;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: 1, rate: 0 }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateTotal = (quantity, rate) => {
        const q = quantity || 0;
        const r = rate || 0;
        return (q * r).toFixed(2);
    };

    const subtotal = items.reduce((acc, item) => acc + ((item.quantity || 0) * (item.rate || 0)), 0);
    const taxRate = 0; // Assuming 0 tax for now
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
                            id="invoiceNumber"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row-split">
                    <div className="form-group bill-from">
                        <label>Bill From</label>
                        <div className="bill-from-grid">
                            <div className="form-group grid-col-span-2">
                                <input type="text" name="companyName" placeholder="Company Name" value={billFrom.companyName} onChange={handleBillFromChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" name="ico" placeholder="ICO" value={billFrom.ico} onChange={handleBillFromChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" name="dic" placeholder="DIC" value={billFrom.dic} onChange={handleBillFromChange} />
                            </div>
                            <div className="form-group grid-col-span-2">
                                <input type="text" name="streetAddress" placeholder="Street Address" value={billFrom.streetAddress} onChange={handleBillFromChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" name="city" placeholder="City" value={billFrom.city} onChange={handleBillFromChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" name="zipCode" placeholder="Zip Code" value={billFrom.zipCode} onChange={handleBillFromChange} />
                            </div>
                             <div className="form-group grid-col-span-2">
                                <input type="text" name="country" placeholder="Country" value={billFrom.country} onChange={handleBillFromChange} />
                            </div>
                        </div>
                    </div>
                    <div className="details-group">
                         <div className="form-group">
                            <label htmlFor="invoiceDate">Date</label>
                            <input
                                type="date"
                                id="invoiceDate"
                                value={invoiceDate}
                                onChange={(e) => setInvoiceDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                 <div className="form-row">
                    <div className="form-group bill-to">
                        <label>Bill To</label>
                        <div className="bill-from-grid">
                            <div className="form-group grid-col-span-2">
                                <input type="text" name="companyName" placeholder="Company Name" value={billTo.companyName} onChange={handleBillToChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" name="ico" placeholder="ICO" value={billTo.ico} onChange={handleBillToChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" name="dic" placeholder="DIC" value={billTo.dic} onChange={handleBillToChange} />
                            </div>
                            <div className="form-group grid-col-span-2">
                                <input type="text" name="streetAddress" placeholder="Street Address" value={billTo.streetAddress} onChange={handleBillToChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" name="city" placeholder="City" value={billTo.city} onChange={handleBillToChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" name="zipCode" placeholder="Zip Code" value={billTo.zipCode} onChange={handleBillToChange} />
                            </div>
                             <div className="form-group grid-col-span-2">
                                <input type="text" name="country" placeholder="Country" value={billTo.country} onChange={handleBillToChange} />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="items-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Rate</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Item description"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.rate}
                                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                        />
                                    </td>
                                    <td>${calculateTotal(item.quantity, item.rate)}</td>
                                    <td>
                                        <button type="button" className="btn-remove" onClick={() => handleRemoveItem(index)}>
                                            &times;
                                        </button>
                                    </td>
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
                        <div className="total-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="total-row">
                            <span>Tax ({ (taxRate * 100).toFixed(0) }%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="total-row grand-total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>


                <div className="form-footer">
                    <label>Notes</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Thanks for your business!"></textarea>
                </div>
            </form>
        </div>
    );
};

export default InvoiceForm;