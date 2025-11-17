# Amortization Calculator

An interactive PhET simulation for exploring loan amortization with real-time visualization of payment breakdowns and extra payment impacts.

## Overview

The Amortization Calculator helps users understand how loans work through:
- **Monthly Payment Calculation** — computed using standard amortization formula
- **Interactive Bamboo Charts** — real-time line charts showing principal vs. interest over time
- **Extra Payment Scenarios** — visualize the impact of additional monthly payments
- **Comparative Analysis** — side-by-side comparison with dashed/lighter lines
- **Mouse Hover Interactivity** — vertical cursor with tooltips displaying exact values

## Key Features

### Input Controls
- **Loan Amount** — principal borrowed ($10,000 - $1,000,000)
- **Term (Years)** — 15 or 30 years (radio button selection)
- **Interest Rate (%)** — annual percentage rate (0% - 12%)
- **Extra Monthly Payment** — optional additional payment towards principal ($0 - $1,000)

### Interactive Visualization

**Payment Breakdown Chart**
- **Bamboo Line Charts** — smooth animated lines showing principal (green) and interest (orange) over time
- **Interactive Hover System** — vertical cursor line with:
  - Two circles at intersection points
  - Color-coded tooltips showing exact dollar amounts
  - Month label with white background along x-axis
  - Comparison values when extra payments applied
- **Dual Schedule Display** — standard payment schedule shown as dashed/lighter lines when extra payments added
- **Real-time Animation** — 2-second animated line drawing on calculation
- **Dynamic Scaling** — auto-adjusts axes based on loan parameters

### Extra Payment Panel
- **Unlocked After Calculation** — appears after initial amortization
- **Re-amortize Button** — recalculates with extra payment
- **Savings Summary** — displays months and interest saved
- **Visual Feedback** — green accent color throughout

### Results Display
- **Monthly Payment** — displayed in control panel
- **Graph Metrics** — shows months, total paid, and interest for both scenarios
- **Placeholder Metrics** — maintains layout stability when toggling extra payments

## Getting Started

### Prerequisites
- Node.js (v14 or higher) and npm
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
│   ├── amortizationTable.ts            # Amortization computation utilities
│   ├── amortizationCalc.ts             # Namespace registration
│   ├── AmortizationCalcStrings.ts      # String/i18n definitions
│   ├── common/
│   │   ├── AmortizationCalcColors.ts   # Color constants
│   │   ├── AmortizationCalcConstants.ts# Layout constants (margins)
│   │   └── AmortizationCalcQueryParameters.ts # Query parameter registration
│   └── amortization-calc/
│       ├── AmortizationCalcScreen.ts    # Screen wrapper
│       ├── model/
│       │   └── AmortizationCalcModel.ts # AXON Properties and business logic
│       └── view/
│           └── AmortizationCalcScreenView.ts  # Scenery scene graph + Bamboo charts
├── doc/
│   ├── implementation-notes.md         # Technical implementation details
│   ├── model.md                        # Model architecture documentation
│   └── release-notes.md                # Version history and changes
├── images/
│   └── license.json                    # Image licensing information
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
The monthly payment is calculated using the standard amortization formula:
```
M = P × [r(1+r)^n] / [(1+r)^n - 1]
```
where:
- M = monthly payment
- P = principal (loan amount)
- r = monthly interest rate (annual rate / 12)
- n = number of payments (years × 12)

### Schedule Computation
Each month:
1. Interest paid = remaining balance × monthly rate
2. Principal paid = monthly payment - interest paid
3. New balance = remaining balance - principal paid

When extra payments are added:
- Total payment = standard payment + extra payment
- All extra goes towards principal
- Loan pays off early when balance reaches zero

### Chart Rendering
- **Bamboo Charts** — PhET's charting library using Canvas rendering
- **ChartTransform** — converts model coordinates (months, dollars) to view pixels
- **CanvasLinePlot** — efficient line rendering with smooth curves
- **Dynamic Scaling** — y-axis auto-scales to maximum payment value
- **Truncated Data** — excludes partial final payments for cleaner visualization

### Interactive Hover System
- **Hit Area** — transparent Rectangle covering chart for mouse detection
- **Vertical Cursor** — Line following mouse x-coordinate
- **Intersection Circles** — positioned using chartTransform.modelToViewXY()
- **Tooltips** — Panel nodes with color-coded backgrounds
- **Absolute Positioning** — prevents layout shifts during hover
- **Bounds Clamping** — keeps tooltips within chart boundaries

## Architecture

### MVC Pattern (PhET Standards Compliant)
The simulation follows PhET's strict Model-View-Controller pattern:

**Model (`AmortizationCalcModel.ts`)**
- **State Management**: All application state using AXON Properties and ObservableArrays
- **Business Logic**: `computeSchedule()` method handles all calculations
- **Standard Scenario Properties**:
  - Input: `loanAmountProperty`, `termYearsProperty`, `interestRateProperty`
  - Output: `monthlyPaymentProperty`, `totalInterestProperty`, `totalPaidProperty`
  - Schedule: `scheduleArray` (full), `scheduleArrayTruncated` (for graphing)
- **Extra Payment Properties**:
  - Input: `extraMonthlyPaymentProperty`
  - Output: `totalInterestWithExtraProperty`, `totalPaidWithExtraProperty`, `monthsSavedProperty`, `interestSavedProperty`
  - Schedule: `scheduleWithExtraArray` (full), `scheduleWithExtraArrayTruncated` (for graphing)
- **No View Logic** — pure business logic and data

**View (`AmortizationCalcScreenView.ts`)**
- **Observes Model**: Property listeners trigger UI updates
- **Scenery Scene Graph**: All UI components (Panel, VBox, HBox, Text, NumberControl, RectangularPushButton)
- **Bamboo Charts**: Interactive line charts with hover system
- **Layout**: Control panel (left), extra payment panel (below), chart panel (right)
- **Animation**: 2-second line drawing using step() function
- **No Business Logic** — pure presentation

**Controller Logic**
- Button listeners call `model.computeSchedule()`
- Property changes trigger view updates
- Observable pattern ensures synchronization

### Technologies

- **TypeScript** — type-safe PhET development
- **AXON** — Properties and ObservableArrays for reactive state
- **Scenery** — Scene graph rendering (Panel, VBox, HBox, Text, Circle, Line, Rectangle)
- **Bamboo** — Charting library (ChartTransform, CanvasLinePlot, ChartCanvasNode, AxisLine, GridLineSet)
- **Scenery-Phet** — PhET-specific UI components (NumberControl, PhetFont, ResetAllButton)
- **Sun** — Button components (RectangularPushButton, AquaRadioButtonGroup)
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

### Visual Design
- **Color Scheme**: Navy blue (`#0c2049`) accents, cream panels (`#f7f5f4`), green (`#19a979`) for principal, orange (`#e8743b`) for interest
- **PhET Standards**: Panel components with rounded corners, proper margins, consistent spacing
- **Typography**: PhetFont throughout (11-18pt depending on context)
- **Responsive Layout**: Panels maintain structure across different viewport sizes

### Interaction Design
- **Progressive Disclosure**: Extra payment panel unlocked after first calculation
- **Visual Feedback**: Animated line drawing (2 seconds), hover tooltips, cursor changes
- **Comparison Mode**: Dashed/lighter standard lines visible when extra payments active
- **Prevented Shifting**: Absolute positioning with bounds clamping prevents layout jumps
- **Placeholder Metrics**: Empty text nodes maintain graph spacing when toggling scenarios

### Performance Optimizations
- **Truncated Schedules**: Excludes partial payments from graph rendering
- **Canvas Rendering**: Bamboo's CanvasLinePlot for efficient line drawing
- **Conditional Animation**: Standard lines only animate once, subsequent recalculations skip
- **Step Function**: Animation progress tracked via NumberProperty updated in step()

## Code Quality

- **~100 Lines Removed**: Eliminated unused code (aggregateByYear, renderAmortizationTable, YearlySummary type)
- **No Dead Imports**: All imports actively used
- **Clean Constants**: Removed TODO comments
- **Zero Compilation Errors**: Verified after cleanup

## Future Enhancements

- [ ] Export schedule to CSV
- [ ] Bi-weekly payment option
- [ ] Refinancing calculator
- [ ] Balloon payment scenarios
- [ ] Multiple loan comparison view

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
