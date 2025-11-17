# Amortization Calculator Model

## Overview

The `AmortizationCalcModel` implements the business logic for loan amortization calculations. It manages all application state using AXON Properties and ObservableArrays, following PhET's strict MVC pattern.

## State Properties

### Input Properties (User-Controlled)

#### `loanAmountProperty: NumberProperty`
- **Description**: Principal loan amount in dollars
- **Default**: 200,000
- **Range**: User typically controls via NumberControl (10,000 - 1,000,000)
- **Example**: `$250,000`

#### `termYearsProperty: NumberProperty`
- **Description**: Loan duration in years
- **Default**: 30
- **Valid Values**: 15 or 30 (controlled via AquaRadioButtonGroup)
- **Example**: `30 years`

#### `interestRateProperty: NumberProperty`
- **Description**: Annual percentage rate (APR)
- **Default**: 5.0
- **Range**: 0 - 12%
- **Example**: `5.25%`

#### `extraMonthlyPaymentProperty: NumberProperty`
- **Description**: Additional monthly payment towards principal
- **Default**: 0
- **Range**: 0 - 1,000
- **Example**: `$200 extra per month`

### Computed Properties (Standard Scenario)

#### `monthlyPaymentProperty: Property<number>`
- **Description**: Fixed monthly payment amount
- **Calculation**: Using amortization formula `M = P × [r(1+r)^n] / [(1+r)^n - 1]`
- **Example**: `$1,342.05`

#### `totalInterestProperty: Property<number>`
- **Description**: Total interest paid over loan life
- **Calculation**: Sum of all `entry.interest` values in schedule
- **Example**: `$183,139.00`

#### `totalPaidProperty: Property<number>`
- **Description**: Total amount paid (principal + interest)
- **Calculation**: `totalPrincipal + totalInterest`
- **Example**: `$383,139.00`

#### `scheduleArray: ObservableArray<AmortizationEntry>`
- **Description**: Complete amortization schedule
- **Length**: `termYears × 12` months (or until balance reaches 0)
- **Purpose**: Full dataset for calculations and totals

#### `scheduleArrayTruncated: ObservableArray<AmortizationEntry>`
- **Description**: Truncated schedule excluding partial final payments
- **Truncation Logic**: Stops at first payment where `principal < previous.principal`
- **Purpose**: Cleaner chart rendering (avoids visual artifacts from partial payments)

### Computed Properties (Extra Payment Scenario)

#### `totalInterestWithExtraProperty: Property<number>`
- **Description**: Total interest paid with extra payments
- **Example**: `$155,320.00` (reduced from standard)

#### `totalPaidWithExtraProperty: Property<number>`
- **Description**: Total amount paid with extra payments
- **Example**: `$355,320.00`

#### `monthsSavedProperty: Property<number>`
- **Description**: Number of months saved by making extra payments
- **Calculation**: `standardSchedule.length - extraSchedule.length`
- **Example**: `87 months` (7.25 years)

#### `interestSavedProperty: Property<number>`
- **Description**: Amount of interest saved
- **Calculation**: `totalInterest - totalInterestWithExtra`
- **Example**: `$27,819.00`

#### `scheduleWithExtraArray: ObservableArray<AmortizationEntry>`
- **Description**: Full schedule with extra payments applied
- **Length**: Shorter than standard (loan pays off early)

#### `scheduleWithExtraArrayTruncated: ObservableArray<AmortizationEntry>`
- **Description**: Truncated extra payment schedule
- **Purpose**: Chart rendering for extra scenario

## Core Methods

### `computeSchedule(): void`

**Purpose**: Computes both standard and extra payment scenarios

**Algorithm**:
1. Validate inputs (positive loan amount, positive years, non-negative rate)
2. Call `computeAmortization(principal, annualRate, years)` for standard schedule
3. Update `scheduleArray` with full results
4. Create `scheduleArrayTruncated` by:
   - Including first payment
   - Including subsequent payments only if `principal >= previous.principal`
   - Stopping at first declining payment
5. Calculate totals and update properties
6. If `extraMonthlyPaymentProperty > 0`:
   - Call `computeAmortization(principal, annualRate, years, extraPayment)`
   - Update `scheduleWithExtraArray` and truncated version
   - Calculate savings metrics

**Triggers**: Called when user clicks "Amortize!" or "Re-amortize!" buttons

**Side Effects**: Updates all computed Properties, triggers view listeners

## Data Types

### `AmortizationEntry`

```typescript
type AmortizationEntry = {
  paymentNumber: number;  // 1-indexed month number
  payment: number;        // Total payment amount this month
  principal: number;      // Principal portion paid this month
  interest: number;       // Interest portion paid this month
  balance: number;        // Remaining balance after this payment
};
```

**Example**:
```typescript
{
  paymentNumber: 1,
  payment: 1342.05,
  principal: 425.38,
  interest: 916.67,
  balance: 199574.62
}
```

## Calculation Details

### Amortization Formula

**Monthly Payment Calculation**:
```
M = P × [r(1+r)^n] / [(1+r)^n - 1]
```

Where:
- `P` = principal (loanAmountProperty.value)
- `r` = monthly interest rate (interestRateProperty.value / 100 / 12)
- `n` = number of payments (termYearsProperty.value × 12)
- `M` = monthly payment

**Per-Month Breakdown**:
```
interest = remainingBalance × monthlyRate
principal = monthlyPayment - interest
newBalance = remainingBalance - principal
```

**With Extra Payments**:
```
totalPayment = monthlyPayment + extraPayment
interest = remainingBalance × monthlyRate
principal = totalPayment - interest
newBalance = Math.max(0, remainingBalance - principal)
```

### Truncation Logic

**Purpose**: Remove visual artifacts from partial final payments in charts

**Algorithm**:
```typescript
scheduleArrayTruncated.clear();
if (schedule.length > 0) {
  scheduleArrayTruncated.push(schedule[0]); // Always include first
  
  for (let i = 1; i < schedule.length; i++) {
    const previousPrincipal = schedule[i - 1].principal;
    if (schedule[i].principal >= previousPrincipal) {
      scheduleArrayTruncated.push(schedule[i]);
    } else {
      break; // Stop at first declining payment
    }
  }
}
```

**Effect**: Charts show smooth curves without abrupt drop at end

## Observable Pattern

### Property Listeners

The view observes these Properties:
- `monthlyPaymentProperty.link(listener)`
- `totalInterestProperty.link(listener)`
- `totalPaidProperty.link(listener)`
- `totalInterestWithExtraProperty.link(listener)`
- `totalPaidWithExtraProperty.link(listener)`

When any Property changes, the view's `updateView()` function is triggered, which:
1. Reads current Property values
2. Updates Text nodes
3. Rebuilds Bamboo charts
4. Repositions UI elements

### ObservableArray Updates

When schedules are recalculated:
```typescript
this.scheduleArray.clear();
schedule.forEach(entry => this.scheduleArray.push(entry));
```

This triggers array listeners in the view to rebuild visualizations.

## Validation

### Input Validation

```typescript
if (principal <= 0 || years <= 0 || annualRate < 0) {
  // Clear schedule and reset computed values
  this.scheduleArray.clear();
  this.monthlyPaymentProperty.value = 0;
  this.totalInterestProperty.value = 0;
  this.totalPaidProperty.value = 0;
  return;
}
```

**Result**: View displays "Please enter positive values"

## Initialization

**Constructor Behavior**:
- Sets default values for input Properties
- Initializes computed Properties to 0
- Creates empty ObservableArrays
- **Does NOT compute initial schedule** — user must click "Amortize!" button

**Rationale**: Follows PhET pattern of explicit user action to start calculations

## Reset Behavior

**Handled by View**: When ResetAllButton clicked:
1. View disposes chart components
2. View calls `property.reset()` on input Properties
3. View manually clears ObservableArrays
4. View resets computed Properties to 0
5. Extra payment panel hidden

**Note**: Model does not have a `reset()` method — view handles all reset logic

## PhET-iO Instrumentation

All Properties include:
- `tandem` — for PhET-iO hierarchy
- `phetioDocumentation` — human-readable descriptions
- `phetioValueType` — type information (NumberIO)

Example:
```typescript
this.loanAmountProperty = new NumberProperty(200000, {
  tandem: providedOptions.tandem.createTandem('loanAmountProperty'),
  phetioDocumentation: 'The principal loan amount in dollars'
});
```

## Performance Considerations

- **Truncated Schedules**: Reduces chart rendering overhead (360 points → ~358 typically)
- **Lazy Calculation**: Only computes on button click, not on every Property change
- **Efficient Updates**: Property listeners prevent unnecessary recalculations
- **Animation Separation**: View handles animation timing, model only provides data

## Dependencies

### External
- `TModel` from joist (interface compliance)
- `NumberProperty` and `Property` from axon (reactive state)
- `createObservableArray` from axon (reactive arrays)
- `NumberIO` from tandem (PhET-iO type system)

### Internal
- `computeAmortization()` from `amortizationTable.ts` (pure calculation function)
- `AmortizationEntry` type from `amortizationTable.ts`