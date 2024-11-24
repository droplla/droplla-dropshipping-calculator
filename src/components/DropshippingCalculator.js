import React, { useState, useMemo, useCallback } from 'react';

import { AdsMetrics, ProfitMetrics } from './ProfitMetrics';

import CalcSettings from './CalcSettings';
import TouchSlider from './TouchSlider';


const DropShippingCalculator = ({
    productWholeSalePrice = 20.00,
    productRRP = 62.50,
    categoryRoasMin = 2.50,
    categoryRoasMax = 4.0,
    productAiRoasMin = null,
    productAiRoasMax = null,
    fontSize = "17px"
}) => {

    const asMultiplier = useCallback((number) => number * 10, []);
    const asDecimal = useCallback((number) => number / 10, []);
    const calcFxWithUSDBase = useCallback((value, prevFx, newFx) => {
        return (value * (1 / prevFx)) * newFx;
    }, []);

    // set defaults
    categoryRoasMin = categoryRoasMin ?? 2.50;
    categoryRoasMax = categoryRoasMax ?? 4.00;
    const productWholeSalePriceMax = useMemo(() => asMultiplier(Math.ceil((productWholeSalePrice * 3) / 100) * 100), [productWholeSalePrice, asMultiplier]);
    const productRRPMax = useMemo(() => asMultiplier(Math.ceil((productRRP * 3) / 100) * 100), [productRRP, asMultiplier]);


    // Initial Calculations
    const ROASMin = useMemo(() => asMultiplier(productAiRoasMin !== null ? productAiRoasMin : categoryRoasMin), [productAiRoasMin, categoryRoasMin, asMultiplier]);
    const productWholeSalePriceMemo = useMemo(() => asMultiplier(productWholeSalePrice), [productWholeSalePrice, asMultiplier]);
    const productRRPMemo = useMemo(() => asMultiplier(productRRP), [productRRP, asMultiplier]);
    const productShippingCostMemo = useMemo(() => asMultiplier(5.00), [asMultiplier]);
    const productTransactionPercentageMemo = useMemo(() => asMultiplier(2), [asMultiplier]);
    const productReturnDamagesSurchargePercentageMemo = useMemo(() => asMultiplier(11), [asMultiplier]);


    // State Management
    const [isShippingDisabled, setIsShippingDisabled] = useState(false);
    const [isPaidAdsActive, setIsPaidAdsActive] = useState(true);
    const [selectedFx, setSelectedFx] = useState({ CurrencyPair: "USD/USD", FxRate: 1 });
    const [currency, setCurrency] = useState(selectedFx.CurrencyPair.split('/')[1]);
    const [estimatedOrders, setEstimatedOrders] = useState(1);
    const [wholesalePrice, setWholesalePrice] = useState(productWholeSalePriceMemo);
    const [sellingPrice, setSellingPrice] = useState(productRRPMemo);
    const [shippingCosts, setShippingCosts] = useState(productShippingCostMemo);
    const [returnDamagesSurchargePerSale, setReturnDamagesSurchargePerSale] = useState(productReturnDamagesSurchargePercentageMemo);
    const [miscCosts, setMiscCosts] = useState(0);
    const [salesTaxPercentage, setSalesTaxPercentage] = useState(asMultiplier(0));
    const [transactionPercentage, setTransactionPercentage] = useState(productTransactionPercentageMemo);
    const [returnDamagesSurchargePercentage, setReturnDamagesSurchargePercentage] = useState(productReturnDamagesSurchargePercentageMemo);
    const [ROASTarget, setROASTarget] = useState(ROASMin);

    // Expense Calculations
    const totalRevenue = useMemo(() => estimatedOrders * asDecimal(sellingPrice), [estimatedOrders, sellingPrice, asDecimal]);
    const shippingCost = useMemo(() => isShippingDisabled ? asDecimal(shippingCosts) : 0, [isShippingDisabled, shippingCosts, asDecimal]);

    const totalInclusiveSalesTax = useMemo(() => (totalRevenue * ((asDecimal(salesTaxPercentage) / 100)) / (1 + (asDecimal(salesTaxPercentage) / 100))), [totalRevenue, salesTaxPercentage, asDecimal]);

    const totalCOGS = useMemo(() => estimatedOrders * (asDecimal(wholesalePrice) + shippingCost), [estimatedOrders, wholesalePrice, shippingCost, asDecimal]);
    const totalGrossProfit = useMemo(() => totalRevenue - totalInclusiveSalesTax - totalCOGS, [totalRevenue, totalCOGS, totalInclusiveSalesTax]);
    const grossProfitPercentage = useMemo(() => (totalGrossProfit / totalRevenue) * 100, [totalGrossProfit, totalRevenue]);

    const totalTransactions = useMemo(() => totalRevenue * (asDecimal(transactionPercentage) / 100), [totalRevenue, transactionPercentage, asDecimal]);
    const totalReturnDamage = useMemo(() => totalRevenue * (asDecimal(returnDamagesSurchargePercentage) / 100), [totalRevenue, returnDamagesSurchargePercentage, asDecimal]);


    const productAdSpendPerSale = useMemo(() => isPaidAdsActive ? (asMultiplier(asDecimal(sellingPrice) / ROASTarget)) : 0, [sellingPrice, ROASTarget, asMultiplier, isPaidAdsActive, asDecimal]);

    const totalExpenses = useMemo(() => (estimatedOrders * productAdSpendPerSale) + (estimatedOrders * asDecimal(miscCosts)) + totalTransactions + totalReturnDamage, [
        estimatedOrders, productAdSpendPerSale, miscCosts, totalTransactions, totalReturnDamage, asDecimal
    ]);

    const totalProfit = useMemo(() => totalGrossProfit - totalExpenses, [
        totalGrossProfit, totalExpenses
    ]);
    const profitPercentage = useMemo(() => (totalProfit / totalRevenue) * 100, [totalProfit, totalRevenue]);

    const breakEvenROAS = useMemo(() => {
        const variableCosts = totalCOGS + totalTransactions + totalReturnDamage + totalInclusiveSalesTax + (estimatedOrders * asDecimal(miscCosts));
        const contributionMargin = totalRevenue - variableCosts;
        const contributionMarginPercentage = (contributionMargin / totalRevenue) * 100;
        if (contributionMarginPercentage <= 0) return 0.00;
        return contributionMarginPercentage !== 0 ? (100 / contributionMarginPercentage) : 0.00;
    }, [totalTransactions, totalReturnDamage, totalInclusiveSalesTax, miscCosts, totalCOGS, totalRevenue, estimatedOrders, asDecimal]);

    const profitPerAcquisition = useMemo(() => {
        return totalProfit / estimatedOrders;
    }, [totalProfit, estimatedOrders]);


    // FX Change Handler
    const handleFxChange = (selectedValue) => {
        setCurrency(selectedValue.CurrencyPair.split('/')[1]);
        setWholesalePrice(calcFxWithUSDBase(wholesalePrice, selectedFx.FxRate, selectedValue.FxRate));
        setSellingPrice(calcFxWithUSDBase(sellingPrice, selectedFx.FxRate, selectedValue.FxRate));
        setShippingCosts(calcFxWithUSDBase(shippingCosts, selectedFx.FxRate, selectedValue.FxRate));
        setReturnDamagesSurchargePerSale(calcFxWithUSDBase(returnDamagesSurchargePerSale, selectedFx.FxRate, selectedValue.FxRate));
        setMiscCosts(calcFxWithUSDBase(miscCosts, selectedFx.FxRate, selectedValue.FxRate));
        setSelectedFx(selectedValue);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '10px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 320px',
                gap: '40px'
            }}>
                <div>
                    <CalcSettings
                        handleFxChange={handleFxChange}
                        setIsPaidAdsActive={setIsPaidAdsActive}
                        setIsShippingDisabled={setIsShippingDisabled}
                        fontSize={fontSize}
                    />
                    {/* Slider sections - same structure as original, with inline styles */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <TouchSlider
                            label="Product Price"
                            tooltipText="Product Price is the price you would buy the product for."
                            currencySymbol={currency}
                            value={wholesalePrice}
                            onChange={setWholesalePrice}
                            min={0}
                            max={Math.max(5000, productWholeSalePriceMax)}
                            dp={2}
                            multFactor={10}
                            step={.5}
                            fontSize={fontSize}
                        />
                        <TouchSlider
                            label="Sell Price"
                            tooltipText="Sell Price is the price you sell the product for."
                            currencySymbol={currency}
                            value={sellingPrice}
                            onChange={productRRPMax}
                            min={0}
                            max={Math.max(5000, productWholeSalePriceMax)}
                            dp={2}
                            multFactor={10}
                            step={.5}
                            fontSize={fontSize}
                        />
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <TouchSlider
                            label="Inclusive Sales Tax %"
                            tooltipText="The percentage of incluive sales taxes, such as VAT or GST. paid per sale. Will vary by region and state and your yearly revenue. Sellers collect these taxes as part of the sale and remit them to tax authorities."
                            currencySymbol="%"
                            value={salesTaxPercentage}
                            onChange={setSalesTaxPercentage}
                            min={0}
                            max={500}
                            dp={2}
                            multFactor={10}
                            step={.1}
                            fontSize={fontSize}
                        />
                        <TouchSlider
                            label="Transaction Charge %"
                            tooltipText="The transaction costs charged by your payment provider as a percentage cost per transcation."
                            currencySymbol="%"
                            value={transactionPercentage}
                            onChange={setTransactionPercentage}
                            min={0}
                            max={250}
                            dp={2}
                            multFactor={10}
                            step={.01}
                            fontSize={fontSize}
                        />

                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <TouchSlider
                            label="Returns & Damages %"
                            tooltipText="Your % surgcharge applied to each sale to cover returns and damages risks. Industry benchmark rate is 30% with a 66% cost loss."
                            currencySymbol="%"
                            value={returnDamagesSurchargePercentage}
                            onChange={setReturnDamagesSurchargePercentage}
                            min={0}
                            max={1000}
                            dp={2}
                            multFactor={10}
                            step={.1}
                            fontSize={fontSize}
                        />
                        <TouchSlider
                            label="Misc. Cost Per Sale"
                            tooltipText="Miscellaneous Costs Per Sale should encompasses various operational expenses incurred by your eCommerce business for each transaction. These costs may include operational overheads, marketplace fees, fixed surcharges, and other miscellaneous expenses directly associated with your ecommerce business."
                            currencySymbol={currency}
                            value={miscCosts}
                            onChange={setMiscCosts}
                            min={0}
                            max={2500}
                            dp={2}
                            multFactor={10}
                            step={.5}
                            fontSize={fontSize}
                        />
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <TouchSlider
                            label="Est. Shipping Cost"
                            tooltipText="Estimated costs of shipping the product to the customer."
                            currencySymbol={currency}
                            value={shippingCosts}
                            onChange={setShippingCosts}
                            min={0}
                            max={500}
                            dp={2}
                            multFactor={10}
                            step={.5}
                            isDisabled={!isShippingDisabled}
                            fontSize={fontSize}
                        />
                        <TouchSlider
                            label="Target ROAS"
                            tooltipText={<span>Return on Ad Spend (ROAS) is a metric used to measure the effectiveness of advertising campaigns by comparing the revenue generated from the ads to the cost of running those ads.
                                <br /><br /><b>Ecommerce Benchmark:</b> 4.00 - 8.00
                                <br /><b>Product Category Benchmark:</b> {categoryRoasMin.toFixed(2)} - {categoryRoasMax.toFixed(2)}
                                {productAiRoasMin !== null && productAiRoasMax !== null && (
                                    <>
                                        <br /><b>Product AI Benchmark:</b> {productAiRoasMin.toFixed(2)} - {productAiRoasMax.toFixed(2)}
                                    </>
                                )}
                            </span>}

                            currencySymbol=":1"
                            value={ROASTarget}
                            onChange={setROASTarget}
                            min={5}
                            max={150}
                            dp={2}
                            multFactor={10}
                            step={.1}
                            isDisabled={!isPaidAdsActive}
                            fontSize={fontSize}
                        />
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <TouchSlider
                            label="Est. Number of Orders"
                            tooltipText="Estimate the number of product orders you expect to sell."
                            currencySymbol="X"
                            value={estimatedOrders}
                            onChange={setEstimatedOrders}
                            min={1}
                            max={5000}
                            step={1}
                            fontSize={fontSize}
                        />
                    </div>
                </div>
                <div>
                    <ProfitMetrics
                        totalRevenue={totalRevenue}
                        totalCOGS={totalCOGS}
                        totalGrossProfit={totalGrossProfit}
                        grossProfiteErcentage={grossProfitPercentage}
                        totalInclusiveSalesTax={totalInclusiveSalesTax}
                        totalExpenses={totalExpenses}
                        totalProfit={totalProfit}
                        profitPercentage={profitPercentage}
                        currency={currency}
                    />
                    <AdsMetrics
                        totalRevenue={totalRevenue}
                        productAdSpendPerSale={productAdSpendPerSale}
                        categoryRoasMin={categoryRoasMin}
                        categoryRoasMax={categoryRoasMax}
                        productAiRoasMin={productAiRoasMin}
                        productAiRoasMax={productAiRoasMax}
                        ROASTarget={ROASTarget}
                        breakEvenROAS={breakEvenROAS}
                        profitPerAcquisition={profitPerAcquisition}
                        currency={currency}
                    />
                </div>
            </div>
            <footer style={{
                marginTop: '40px',
                textAlign: 'center',
                fontSize: '14px'
            }}>

               
                <a href="https://www.droplla.com" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                    Learn more about Droplla
                </a>
                <p></p>
                <a href="https://www.droplla.com/dropshipping-profit-margin-calculator" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                    and see how we use the calculator within our SaaS
                </a>
            </footer>
        </div>
    );
};

export default DropShippingCalculator;