import React, { useState, useEffect } from 'react';
import InvoiceForm from './InvoiceForm';
import Settings from './Settings';
import './App.css';

const App = () => {
    // Состояние валюты поднято сюда
    const [currency, setCurrency] = useState('EUR');

    return (
        <div className="app-container">
            <main className="main-content">
                <InvoiceForm currency={currency} />
            </main>
            <Settings currency={currency} onCurrencyChange={setCurrency} />
        </div>
    );
};

export default App;
