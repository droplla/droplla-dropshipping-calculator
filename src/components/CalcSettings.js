import React, { useState } from 'react';

const CalcSettings = ({ 
    handleFxChange, 
    setIsPaidAdsActive, 
    setIsShippingDisabled, 
    fontSize 
}) => {
    const [selectedFx, setSelectedFx] = useState({ CurrencyPair: "USD/USD", FxRate: 1 });
    const [isPaidAdsChecked, setIsPaidAdsChecked] = useState(true);
    const [isShippingChecked, setIsShippingChecked] = useState(true);

    const currencyOptions = [
        { CurrencyPair: "USD/USD", FxRate: 1 },
        { CurrencyPair: "USD/EUR", FxRate: 0.91 },
        { CurrencyPair: "USD/GBP", FxRate: 0.79 }
    ];

    const handleCurrencyChange = (e) => {
        const selectedValue = currencyOptions.find(opt => opt.CurrencyPair === e.target.value);
        setSelectedFx(selectedValue);
        handleFxChange(selectedValue);
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '20px' 
        }}>
            <div>
                <label style={{ marginRight: '10px', fontSize }}>
                    <input 
                        type="checkbox" 
                        checked={isPaidAdsChecked}
                        onChange={() => {
                            setIsPaidAdsChecked(!isPaidAdsChecked);
                            setIsPaidAdsActive(!isPaidAdsChecked);
                        }}
                    /> 
                    Paid Ads Active
                </label>
                <label style={{ fontSize }}>
                    <input 
                        type="checkbox" 
                        checked={isShippingChecked}
                        onChange={() => {
                            setIsShippingChecked(!isShippingChecked);
                            setIsShippingDisabled(!isShippingChecked);
                        }}
                    /> 
                    Shipping Enabled
                </label>
            </div>
            <select 
                value={selectedFx.CurrencyPair} 
                onChange={handleCurrencyChange}
                style={{ fontSize }}
            >
                {currencyOptions.map(opt => (
                    <option key={opt.CurrencyPair} value={opt.CurrencyPair}>
                        {opt.CurrencyPair}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CalcSettings;