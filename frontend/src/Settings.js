import React from 'react';
import './Settings.css';

const Settings = ({ currency, onCurrencyChange }) => {
    const currencies = ['EUR', 'USD', 'GBP'];

    return (
        <aside className="settings-sidebar">
            <h2>Settings</h2>
            <div className="settings-group">
                <label htmlFor="currency-select">Currency</label>
                <select 
                    id="currency-select" 
                    value={currency} 
                    onChange={(e) => onCurrencyChange(e.target.value)}
                >
                    {currencies.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>
        </aside>
    );
};

export default Settings;
