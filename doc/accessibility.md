# Accessibility Features - Amortization Calculator

## Overview

The Amortization Calculator implements comprehensive accessibility support following PhET standards, ensuring the simulation is fully usable with screen readers, keyboard navigation, and assistive technologies.

## PDOM (Parallel DOM) Implementation

### What is PDOM?

The Parallel DOM is an invisible semantic HTML structure that runs alongside the visual scene graph. It provides:
- Screen reader access to all interactive elements
- Keyboard navigation support
- ARIA labels and descriptions
- Live region announcements for dynamic content

### Accessible Components

#### 1. Control Panel
**PDOM Structure:**
```html
<div role="group" aria-labelledby="loan-params-label">
  <h2 id="loan-params-label">Loan Parameters</h2>
  <p>Set the loan amount, term, and interest rate to calculate your amortization schedule</p>
  ...
</div>
```

**Features:**
- Semantic heading structure (h2 for panel title)
- Descriptive label explaining purpose
- Grouped related controls

#### 2. Loan Amount Control
**Keyboard Navigation:**
- Tab to focus the slider
- Arrow keys to adjust by $10,000 increments
- Page Up/Down for larger adjustments
- Home/End for min/max values

**Screen Reader:**
- Announces current value as "$200,000"
- Updates announced on change
- Proper slider role and value range

#### 3. Term Selection (Radio Buttons)
**PDOM Structure:**
```html
<fieldset>
  <legend>Choose loan term: 15 or 30 years</legend>
  <input type="radio" name="term" value="15" aria-label="15 years loan term">
  <input type="radio" name="term" value="30" aria-label="30 years loan term">
</fieldset>
```

**Keyboard Navigation:**
- Tab to enter radio group
- Arrow keys to select between 15 and 30 years
- Space to confirm selection

#### 4. Interest Rate Control
**Keyboard Navigation:**
- Tab to focus the slider
- Arrow keys to adjust by 0.1% increments
- Precision control for accurate input

**Screen Reader:**
- Announces as "Interest Rate: 5.00 percent"
- Updates announced on change

#### 5. Calculate Button
**PDOM Structure:**
```html
<button aria-label="Amortize">
  Amortize!
</button>
```

**Keyboard Navigation:**
- Tab to focus
- Enter or Space to activate

**Screen Reader:**
- Announces "Amortize button"
- Clear action indication

#### 6. Results Display
**Live Region:**
```html
<p role="status" aria-live="polite">
  Your monthly payment is $1,342.05. 
  Total interest over 360 months: $183,139.00. 
  Total amount paid: $383,139.00.
</p>
```

**Features:**
- Automatically announced when results update
- Provides complete context (monthly payment, total interest, total paid)
- Non-interrupting (polite) announcements

#### 7. Extra Payment Panel
**PDOM Structure:**
```html
<div role="group" aria-labelledby="extra-payment-label">
  <h3 id="extra-payment-label">Extra Payment Options</h3>
  <p>Explore how making extra monthly payments can reduce your loan term and save on interest</p>
  ...
</div>
```

**Features:**
- Unlocked only after initial calculation
- Clear hierarchical heading (h3 under control panel's h2)
- Descriptive purpose statement

#### 8. Extra Payment Control
**Keyboard Navigation:**
- Tab to focus the slider
- Arrow keys to adjust by $25 increments
- Full range $0-$1,000

**Screen Reader:**
- Announces current extra payment amount
- Updates value on change

#### 9. Re-amortize Button
**PDOM Structure:**
```html
<button aria-label="Re-amortize with Extra Payment">
  Re-amortize!
</button>
```

**Screen Reader:**
- Clear description of action
- Announces when activated

#### 10. Comparison Results
**Live Region:**
```html
<p role="status" aria-live="polite">
  By paying an extra $200 per month, you will save 87 months (7.3 years) 
  and $27,819.00 in interest. Your loan will be paid off in 273 months 
  instead of 360 months.
</p>
```

**Features:**
- Dynamic announcement when extra payments calculated
- Complete savings information
- Time and money savings clearly stated

#### 11. Interactive Chart
**PDOM Structure:**
```html
<div role="img" aria-labelledby="chart-title" aria-describedby="chart-desc">
  <h2 id="chart-title">Interactive Payment Chart</h2>
  <p id="chart-desc">
    Line chart showing how principal and interest payments change over 
    the life of the loan. Hover over the chart to see detailed values 
    for each month.
  </p>
</div>
```

**Features:**
- Described as interactive visualization
- Alternative text explains chart purpose
- Instructions for mouse/touch interaction included

## Keyboard Navigation

### Tab Order
1. Loan Amount slider
2. Term: 15 years radio button
3. Term: 30 years radio button
4. Interest Rate slider
5. Amortize button
6. Extra Monthly Payment slider (when unlocked)
7. Re-amortize button (when unlocked)
8. Reset All button

### Keyboard Shortcuts
- **Tab** - Move to next control
- **Shift+Tab** - Move to previous control
- **Arrow Keys** - Adjust sliders or select radio buttons
- **Space/Enter** - Activate buttons
- **Home** - Jump to minimum slider value
- **End** - Jump to maximum slider value
- **Page Up/Down** - Large slider adjustments

## Screen Reader Experience

### Initial Load
```
"Amortization Calculator. Loan Parameters region. 
Loan Explorer Controls heading level 2.
Loan Amount slider, current value $200,000..."
```

### After Calculation
```
"Results updated. Your monthly payment is $1,342.05. 
Total interest over 360 months: $183,139.00. 
Total amount paid: $383,139.00."
```

### With Extra Payments
```
"Results updated. By paying an extra $200 per month, 
you will save 87 months (7.3 years) and $27,819.00 in interest. 
Your loan will be paid off in 273 months instead of 360 months."
```

## ARIA Attributes Used

### Roles
- `role="group"` - Grouping related controls
- `role="status"` - Live region for results
- `role="img"` - Chart as image with description

### Properties
- `aria-labelledby` - Linking labels to regions
- `aria-describedby` - Linking descriptions
- `aria-live="polite"` - Non-interrupting announcements
- `aria-label` - Accessible names for controls

### States
- `aria-valuenow` - Current slider values
- `aria-valuemin` - Slider minimum
- `aria-valuemax` - Slider maximum
- `aria-valuetext` - Formatted slider values

## Testing Recommendations

### Screen Readers
- **NVDA** (Windows) - Free, widely used
- **JAWS** (Windows) - Industry standard
- **VoiceOver** (macOS/iOS) - Built-in Apple screen reader
- **TalkBack** (Android) - Mobile accessibility

### Testing Checklist
- [ ] All controls reachable via keyboard
- [ ] Tab order is logical
- [ ] Screen reader announces all controls
- [ ] Results announced when calculated
- [ ] Comparisons announced with extra payments
- [ ] Chart description provided
- [ ] Focus indicators visible
- [ ] No keyboard traps

### Browser Testing
- Chrome + NVDA
- Firefox + NVDA
- Safari + VoiceOver
- Edge + Narrator

## Future Enhancements

### Potential Improvements
1. **Sonification** - Audio cues for payment changes
2. **Chart Data Table** - Alternative data representation
3. **Keyboard Chart Navigation** - Navigate data points with arrow keys
4. **Voice Control** - Integration with voice commands
5. **High Contrast Mode** - Improved visual accessibility
6. **Adjustable Text Size** - Dynamic font scaling

### Advanced Features
- Keyboard shortcuts for common loan scenarios
- Custom announcement preferences
- Braille display support
- Alternative chart representations (table, list)

## PhET Accessibility Standards Compliance

### Requirements Met
✅ All interactive elements keyboard accessible
✅ Screen reader support for all content
✅ Semantic HTML structure (PDOM)
✅ ARIA labels and descriptions
✅ Live regions for dynamic content
✅ Focus management
✅ Logical tab order
✅ Alternative text for visuals

### Best Practices Followed
- Progressive disclosure (extra panel)
- Clear, descriptive labels
- Non-interrupting announcements
- Consistent keyboard navigation
- Grouped related controls
- Hierarchical heading structure

## Resources

### PhET Documentation
- [PhET Accessibility Overview](https://phet.colorado.edu/en/accessibility)
- [Scenery Accessibility Guide](https://github.com/phetsims/scenery/blob/main/doc/accessibility/)

### Web Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Contact

For accessibility questions or feedback:
- Open an issue on GitHub
- Email: [accessibility contact]
- Review PhET's accessibility statement
