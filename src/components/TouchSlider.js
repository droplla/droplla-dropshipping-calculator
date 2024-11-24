import React from 'react';

const TouchSlider = ({ 
    label, 
    tooltipText, 
    currencySymbol, 
    value, 
    onChange, 
    min, 
    max, 
    step, 
    dp = 2, 
    multFactor = 1, 
    isDisabled = false, 
    fontSize = "17px" 
}) => {
    const displayValue = (value / multFactor).toFixed(dp);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            width: '100%' 
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '10px' 
            }}>
                <label style={{ fontWeight: 'bold', fontSize }}>{label}</label>
                <span style={{ fontSize }}>
                    {displayValue} {currencySymbol}
                </span>
            </div>
            <input 
                type="range" 
                min={min} 
                max={max} 
                value={value} 
                step={step}
                onChange={(e) => onChange(Number(e.target.value))}
                disabled={isDisabled}
                style={{ 
                    width: '100%', 
                    cursor: isDisabled ? 'not-allowed' : 'pointer' 
                }}
            />
        </div>
    );
};

export default TouchSlider;