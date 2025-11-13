# Amortization Calculator

An interactive PhET simulation for learning about loan amortization, monthly payments, interest, and principal breakdown.

## Overview

The Amortization Calculator is an educational simulation that helps users understand how loans work by visualizing:
- **Monthly Payment Calculation** — computed using the standard amortization formula
- **Total Interest Paid** — accumulated over the loan term
- **Total Amount Paid** — sum of all monthly payments
- **Amortization Schedule** — detailed month-by-month breakdown showing principal vs. interest
- **Principal vs. Interest Breakdown** — aggregated view by year

## Features

### Input Controls
- **Loan Amount** — principal borrowed (e.g., $200,000)
- **Term (Years)** — loan duration in years (e.g., 30)
- **Interest Rate (Annual %)** — annual percentage rate (e.g., 5%)

### Output Display

**Loan Calculator Panel (Left)**
- **Amortization Table** — scrollable table with sticky headers showing:
  - Payment number
  - Monthly payment amount
  - Principal paid that month
  - Interest paid that month
  - Remaining balance

**Payment Summary Panel (Top Right)**
- **Total Interest Paid** — total interest over the life of the loan
- **Total Paid** — total of all payments (principal + interest)

**Payment Breakdown Chart (Bottom Right)**
- **Interactive stacked bar chart** — visualizes principal vs. interest by year
- Hover tooltips showing detailed percentages and dollar amounts
- Color-coded bars (mint for principal, coral for interest)

## Getting Started

### Prerequisites
- Node.js and npm
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BattleDrumz/amortization-calc.git
   cd amortization-calc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up local repository references** (optional, for development):
   - Create or edit `build-local.json` in the parent directory (`../build-local.json`) to point to sibling PhET repositories if you're working on core PhET dependencies.

### Running the Simulation

**Development Server:**
```bash
npx grunt dev-server --port=8000
```
Then open http://localhost:8000/amortization-calc/amortization-calc_en.html

**Build for Production:**
```bash
npx grunt build
```

## Project Structure

```
amortization-calc/
├── js/
│   ├── amortization-calc-main.ts       # Main entry point / Sim launcher
│   ├── amortizationTable.ts            # Computation & rendering helpers
│   ├── amortizationCalc.ts             # Namespace registration
│   ├── AmortizationCalcStrings.ts      # String/i18n definitions
│   ├── common/
│   │   ├── AmortizationCalcColors.ts   # Color constants
│   │   ├── AmortizationCalcConstants.ts# UI constants
│   │   └── AmortizationCalcQueryParameters.ts
│   └── amortization-calc/
│       ├── AmortizationCalcScreen.ts    # Screen wrapper
│       ├── model/
│       │   └── AmortizationCalcModel.ts # Data model
│       └── view/
│           └── AmortizationCalcScreenView.ts  # Main UI view
├── amortization-calc_en.html           # HTML entry point
├── amortization-calc-strings_en.json   # English strings
├── dependencies.json                   # PhET dependencies with SHAs
├── package.json                        # npm configuration
├── tsconfig.json                       # TypeScript configuration
├── Gruntfile.cjs                       # Build configuration
└── README.md                           # This file
```

## How It Works

### Amortization Formula
The monthly payment is calculated using:
```
M = P × [r(1+r)^n] / [(1+r)^n - 1]
```
where:
- M = monthly payment
- P = principal (loan amount)
- r = monthly interest rate (annual rate / 12)
- n = number of payments (years × 12)

### Schedule Computation
Each month, the interest paid is calculated on the remaining balance, and the principal is the difference between the fixed monthly payment and that month's interest. The balance is reduced by the principal payment.

### Number Formatting
All currency amounts use thousands separators (e.g., $1,234,567.89) for readability.

### Table Headers
Table headers use CSS `position: sticky` to remain visible while scrolling through the amortization schedule.

## Architecture

### MVC Pattern (PhET Standards Compliant)
The simulation follows PhET's strict Model-View-Controller pattern:

**Model (`AmortizationCalcModel.ts`)**
- Contains all application state using AXON Properties
- Implements business logic (`computeSchedule()` method)
- Properties: `loanAmountProperty`, `termYearsProperty`, `interestRateProperty`, `monthlyPaymentProperty`, `totalInterestProperty`, `totalPaidProperty`
- Observable array: `scheduleArray` for amortization entries

**View (`AmortizationCalcScreenView.ts`)**
- Observes model Properties and updates UI
- Three-panel layout: control panel, results panel, chart panel
- Responsive design (stacks vertically on mobile)
- No business logic — pure presentation

**Controller Logic**
- Event handlers update model Properties
- Model computation triggers Property changes
- View updates automatically via observers

### Technologies

- **TypeScript** — type-safe implementation with PhET conventions
- **PhET Framework** — joist, scenery, axon (Properties, ObservableArray)
- **Chart.js 3.9.1** — interactive data visualization
- **Grunt** — build and development server
- **ESBuild** — JavaScript bundling

## Development

### Building
```bash
npx grunt build
```

### Running Tests
```bash
npm test
```

### Code Style
The project uses ESLint for code quality checks:
```bash
npx eslint js/
```

## Design Features

- **Custom color scheme** — Navy blue (`#0c2049`) accents with cream (`#f7f5f4`) panels
- **Background image** — Custom `images/background.png` for visual appeal
- **Separated panels** — Distinct visual regions following PhET standards
- **16px font size** — Readable across all UI elements
- **Instant calculations** — Optimized to avoid re-rendering overhead
- **Smooth animations** — Chart transitions for visual feedback

## Future Enhancements

- [ ] Export schedule to CSV
- [ ] Comparison mode (side-by-side loan scenarios)
- [ ] Early payoff calculator
- [ ] Extra payments visualization
- [ ] Bi-weekly payment options

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License — see the LICENSE file for details.

## Resources

- [PhET Development Overview](https://github.com/phetsims/phet-info/blob/main/doc/phet-development-overview.md)
- [Amortization Calculator Model Documentation](./doc/model.md)
- [Implementation Notes](./doc/implementation-notes.md)

## Contact

For questions or issues, please open an issue on the [GitHub repository](https://github.com/BattleDrumz/amortization-calc).
