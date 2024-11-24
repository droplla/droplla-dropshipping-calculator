# Dropshipping Calculator React Component

A flexible and customizable React component for calculating dropshipping costs, profits, and key metrics. Perfect for e-commerce applications, price analysis tools, or educational platforms.

[![NPM Version][npm-version-image]][npm-url]
[![MIT License][license-image]][license-url]

## Features

- 📊 Real-time profit calculation
- 💰 Support for multiple currencies
- 📈 ROAS (Return on Ad Spend) tracking
- 🛠️ Customizable cost parameters
- 🎯 Break-even analysis
- 📱 Mobile-responsive design

## Installation

```bash
npm install dropshipping-calculator
# or
yarn add dropshipping-calculator
```

## Quick Start

```jsx
import { DropshippingCalculator } from 'dropshipping-calculator';

function App() {
  return (
    <DropshippingCalculator
      initialWholesalePrice={20.00}
      initialRetailPrice={62.50}
      categoryRoasMin={2.50}
      categoryRoasMax={4.0}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialWholesalePrice | number | 20.00 | Initial wholesale price of the product |
| initialRetailPrice | number | 62.50 | Initial retail price of the product |
| categoryRoasMin | number | 2.50 | Minimum category ROAS benchmark |
| categoryRoasMax | number | 4.0 | Maximum category ROAS benchmark |
| productAiRoasMin | number | null | Optional AI-suggested minimum ROAS |
| productAiRoasMax | number | null | Optional AI-suggested maximum ROAS |

## Advanced Usage

The calculator includes several customizable components:

- `CalcSettings`: Currency and shipping settings
- `ProfitMetrics`: Profit calculation display
- `TouchSlider`: Interactive value adjustment
- `AdsMetrics`: Advertising metrics calculation

Example with custom settings:

```jsx
import { DropshippingCalculator } from 'dropshipping-calculator';

function App() {
  return (
    <DropshippingCalculator
      initialWholesalePrice={20.00}
      initialRetailPrice={62.50}
      categoryRoasMin={2.50}
      categoryRoasMax={4.0}
      productAiRoasMin={3.0}
      productAiRoasMax={5.0}
    />
  );
}
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## Credits

This calculator is part of the [Droplla](https://www.droplla.com) e-commerce toolkit. Visit [our website](https://www.droplla.com) to learn more about dropshipping tools and resources.

## License

MIT © [Droplla](https://www.droplla.com)

[npm-version-image]: https://img.shields.io/npm/v/dropshipping-calculator.svg
[npm-url]: https://npmjs.org/package/dropshipping-calculator
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE