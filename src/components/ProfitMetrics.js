import React from 'react';

const ProfitMetrics = ({ 
    totalRevenue, 
    totalCOGS, 
    totalGrossProfit, 
    grossProfiteErcentage, 
    totalInclusiveSalesTax, 
    totalExpenses, 
    totalProfit, 
    profitPercentage, 
    currency 
}) => {
    return (
        <div style={{ 
            border: '1px solid #ddd', 
            padding: '20px', 
            marginBottom: '20px' 
        }}>
            <h3>Profit Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <span>Total Revenue:</span>
                <span>{totalRevenue.toFixed(2)} {currency}</span>
                <span>Inclusive Sales Tax:</span>
                <span>{totalInclusiveSalesTax.toFixed(2)} {currency}</span>
                <span>Total COGS:</span>
                <span>{totalCOGS.toFixed(2)} {currency}</span>
                <span>Gross Profit:</span>
                <span>{totalGrossProfit.toFixed(2)} {currency}</span>
                <span>Gross Profit %:</span>
                <span>{grossProfiteErcentage.toFixed(2)}%</span>
                <span>Total Expenses:</span>
                <span>{totalExpenses.toFixed(2)} {currency}</span>
                <span>Net Profit:</span>
                <span>{totalProfit.toFixed(2)} {currency}</span>
                <span>Net Profit %:</span>
                <span>{profitPercentage.toFixed(2)}%</span>
            </div>
        </div>
    );
};

const AdsMetrics = ({ 
    totalRevenue, 
    productAdSpendPerSale, 
    categoryRoasMin, 
    categoryRoasMax, 
    productAiRoasMin, 
    productAiRoasMax, 
    ROASTarget, 
    breakEvenROAS, 
    profitPerAcquisition, 
    currency 
}) => {
    return (
        <div style={{ 
            border: '1px solid #ddd', 
            padding: '20px' 
        }}>
            <h3>Ads Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <span>Ad Spend per Sale:</span>
                <span>{productAdSpendPerSale.toFixed(2)} {currency}</span>
                <span>ROAS Target:</span>
                <span>{(ROASTarget / 10).toFixed(2)}:1</span>
                <span>Break-even ROAS:</span>
                <span>{breakEvenROAS.toFixed(2)}:1</span>
                <span>Profit per Acquisition:</span>
                <span>{profitPerAcquisition.toFixed(2)} {currency}</span>
            </div>
        </div>
    );
};

export { ProfitMetrics, AdsMetrics };