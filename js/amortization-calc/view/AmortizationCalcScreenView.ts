// Copyright 2014-2025, University of Colorado Boulder

/**
 * AmortizationCalcScreenView is the top-level view for the Amortization Calculator screen.
 * It observes the model and updates the visual representation accordingly, following PhET's MVC pattern.
 * User input is forwarded to the model via Property setters.
 *
 * @author Luke Thompson
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import DOM from '../../../../scenery/js/nodes/DOM.js';
import { renderAmortizationTable, formatNumber, aggregateByYear } from '../../amortizationTable.js';
import AmortizationCalcConstants from '../../common/AmortizationCalcConstants.js';
import amortizationCalc from '../../amortizationCalc.js';
import AmortizationCalcModel from '../model/AmortizationCalcModel.js';

type SelfOptions = EmptySelfOptions;
type AmortizationCalcScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class AmortizationCalcScreenView extends ScreenView {

  private readonly model: AmortizationCalcModel;
  private readonly disposeAmortizationCalcScreenView: () => void;

  public constructor( model: AmortizationCalcModel, providedOptions: AmortizationCalcScreenViewOptions ) {

    const options = optionize<AmortizationCalcScreenViewOptions, SelfOptions, ScreenViewOptions>()( {
      // No additional options needed
    }, providedOptions );

    super( options );

    this.model = model;

    // Load Chart.js from CDN
    const chartJsUrl = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
    const loadChartJS: Promise<void> = new Promise( ( resolve, reject ) => {
      if ( ( window as any ).Chart ) {
        resolve();
        return;
      }
      const script = document.createElement( 'script' );
      script.src = chartJsUrl;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject( new Error( 'Failed to load Chart.js' ) );
      document.head.appendChild( script );
    } );

    // Create UI container
    const uiWrapper = document.createElement( 'div' );
    const layoutWidth = this.layoutBounds.width;
    const layoutHeight = this.layoutBounds.height;
    
    uiWrapper.style.position = 'relative';
    uiWrapper.style.width = layoutWidth + 'px';
    uiWrapper.style.height = layoutHeight + 'px';
    uiWrapper.style.pointerEvents = 'auto';
    uiWrapper.style.overflow = 'visible';
    uiWrapper.tabIndex = 0;

    // Prevent pointer events from bubbling to Scenery
    const stop = ( e: Event ) => {
      e.stopPropagation();
    };
    [ 'pointerdown', 'pointermove', 'pointerup', 'mousedown', 'mousemove', 'mouseup', 'click' ].forEach( ev => uiWrapper.addEventListener( ev, stop ) );

    // Create control panel (left side) for form, results, and table
    const controlPanel = document.createElement( 'div' );
    controlPanel.style.position = 'absolute';
    controlPanel.style.left = '15px';
    controlPanel.style.top = '15px';
    controlPanel.style.width = '450px';
    controlPanel.style.maxHeight = ( layoutHeight - 30 ) + 'px';
    controlPanel.style.background = '#ffffff';
    controlPanel.style.padding = '10px';
    controlPanel.style.border = '2px solid #ccc';
    controlPanel.style.borderRadius = '8px';
    controlPanel.style.boxSizing = 'border-box';
    controlPanel.style.pointerEvents = 'auto';
    controlPanel.style.display = 'flex';
    controlPanel.style.flexDirection = 'column';
    controlPanel.style.gap = '10px';
    controlPanel.style.overflow = 'auto';
    controlPanel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

    // Control panel title
    const controlTitle = document.createElement( 'div' );
    controlTitle.textContent = 'Loan Calculator';
    controlTitle.style.fontSize = '16px';
    controlTitle.style.fontWeight = 'bold';
    controlTitle.style.marginBottom = '5px';
    controlTitle.style.textAlign = 'center';
    controlTitle.style.color = '#333';
    controlTitle.style.borderBottom = '2px solid #2bbfbd';
    controlTitle.style.paddingBottom = '8px';

    // Build form
    const form = document.createElement( 'form' );
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '8px';

    const makeField = ( labelText: string, inputValue: string ): { wrap: HTMLDivElement; input: HTMLInputElement } => {
      const wrap = document.createElement( 'div' );
      wrap.style.display = 'flex';
      wrap.style.flexDirection = 'column';
      const label = document.createElement( 'label' );
      label.textContent = labelText;
      label.style.fontSize = '16px';
      label.style.marginBottom = '2px';
      const input = document.createElement( 'input' );
      input.type = 'number';
      input.value = inputValue;
      input.style.padding = '6px 8px';
      input.style.boxSizing = 'border-box';
      input.style.fontSize = '16px';
      input.addEventListener( 'keydown', stop );
      wrap.appendChild( label );
      wrap.appendChild( input );
      return { wrap, input };
    };

    const amountField = makeField( 'Loan amount', model.loanAmountProperty.value.toString() );
    const termField = makeField( 'Term (years)', model.termYearsProperty.value.toString() );
    const rateField = makeField( 'Interest rate (annual %)', model.interestRateProperty.value.toString() );

    form.appendChild( amountField.wrap );
    form.appendChild( termField.wrap );
    form.appendChild( rateField.wrap );

    const calculateButton = document.createElement( 'button' );
    calculateButton.type = 'button';
    calculateButton.textContent = 'Amortize!';
    calculateButton.style.padding = '10px 16px';
    calculateButton.style.fontSize = '16px';
    calculateButton.style.fontWeight = 'bold';
    calculateButton.style.backgroundColor = '#2bbfbd';
    calculateButton.style.color = 'white';
    calculateButton.style.border = 'none';
    calculateButton.style.borderRadius = '4px';
    calculateButton.style.cursor = 'pointer';
    calculateButton.addEventListener( 'click', stop );
    calculateButton.addEventListener( 'mouseenter', () => {
      calculateButton.style.backgroundColor = '#239a98';
    } );
    calculateButton.addEventListener( 'mouseleave', () => {
      calculateButton.style.backgroundColor = '#2bbfbd';
    } );
    form.appendChild( calculateButton );

    // Results display
    const resultsDiv = document.createElement( 'div' );
    resultsDiv.style.fontSize = '12px';
    resultsDiv.style.lineHeight = '1.6';
    resultsDiv.style.padding = '6px';
    resultsDiv.style.backgroundColor = '#f5f5f5';
    resultsDiv.style.borderRadius = '4px';

    // Table container
    const tableContainer = document.createElement( 'div' );
    tableContainer.style.width = '100%';
    tableContainer.style.maxHeight = '300px';
    tableContainer.style.overflow = 'auto';
    tableContainer.style.pointerEvents = 'auto';
    tableContainer.style.userSelect = 'text';

    // Append to control panel
    controlPanel.appendChild( controlTitle );
    controlPanel.appendChild( form );
    controlPanel.appendChild( tableContainer );

    // Create results panel (top right) for monthly payment, total interest, etc.
    const resultsPanel = document.createElement( 'div' );
    resultsPanel.style.position = 'absolute';
    resultsPanel.style.left = '480px';
    resultsPanel.style.top = '15px';
    resultsPanel.style.width = ( layoutWidth - 480 - 15 ) + 'px';
    resultsPanel.style.background = '#ffffff';
    resultsPanel.style.padding = '15px';
    resultsPanel.style.border = '2px solid #ccc';
    resultsPanel.style.borderRadius = '8px';
    resultsPanel.style.boxSizing = 'border-box';
    resultsPanel.style.pointerEvents = 'auto';
    resultsPanel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

    const resultsTitle = document.createElement( 'div' );
    resultsTitle.textContent = 'Payment Summary';
    resultsTitle.style.fontSize = '16px';
    resultsTitle.style.fontWeight = 'bold';
    resultsTitle.style.marginBottom = '0px';
    resultsTitle.style.textAlign = 'center';
    resultsTitle.style.color = '#333';
    resultsTitle.style.borderBottom = '2px solid #2bbfbd';
    resultsTitle.style.paddingBottom = '8px';

    resultsDiv.style.fontSize = '16px';
    resultsDiv.style.lineHeight = '1.6';
    resultsDiv.style.padding = '10px';
    resultsDiv.style.backgroundColor = 'transparent';
    resultsDiv.style.borderRadius = '0';

    resultsPanel.appendChild( resultsTitle );
    resultsPanel.appendChild( resultsDiv );

    // Create chart panel (right side, below results)
    const chartPanel = document.createElement( 'div' );
    chartPanel.style.position = 'absolute';
    chartPanel.style.left = '480px';
    chartPanel.style.top = '150px';
    chartPanel.style.width = ( layoutWidth - 480 - 15 ) + 'px';
    chartPanel.style.height = '400px';
    chartPanel.style.background = '#ffffff';
    chartPanel.style.padding = '15px';
    chartPanel.style.border = '2px solid #ccc';
    chartPanel.style.borderRadius = '8px';
    chartPanel.style.boxSizing = 'border-box';
    chartPanel.style.pointerEvents = 'auto';
    chartPanel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

    // Chart title
    const chartTitle = document.createElement( 'div' );
    chartTitle.textContent = 'Payment Breakdown by Year';
    chartTitle.style.fontSize = '16px';
    chartTitle.style.fontWeight = 'bold';
    chartTitle.style.marginBottom = '10px';
    chartTitle.style.textAlign = 'center';
    chartTitle.style.color = '#333';
    chartTitle.style.borderBottom = '2px solid #e05252';
    chartTitle.style.paddingBottom = '8px';

    // Chart canvas container
    const chartCanvasContainer = document.createElement( 'div' );
    chartCanvasContainer.style.width = '100%';
    chartCanvasContainer.style.height = 'calc(100% - 35px)';
    chartCanvasContainer.style.position = 'relative';

    const chartCanvas = document.createElement( 'canvas' );
    chartCanvas.style.width = '100%';
    chartCanvas.style.height = '100%';
    chartCanvasContainer.appendChild( chartCanvas );

    chartPanel.appendChild( chartTitle );
    chartPanel.appendChild( chartCanvasContainer );

    uiWrapper.appendChild( controlPanel );
    uiWrapper.appendChild( resultsPanel );
    uiWrapper.appendChild( chartPanel );

    const uiNode = new DOM( uiWrapper, { 
      left: 0, 
      top: 0, 
      tandem: options.tandem.createTandem( 'amortizationUI' ) 
    } );
    this.addChild( uiNode );

    // Responsive layout
    const onResize = (): void => {
      const vw = window.innerWidth;
      
      // Adjust layout for small screens
      if ( vw < 800 ) {
        // Stack panels vertically on small screens
        controlPanel.style.position = 'relative';
        controlPanel.style.left = '0';
        controlPanel.style.width = '100%';
        controlPanel.style.maxHeight = 'none';
        
        resultsPanel.style.position = 'relative';
        resultsPanel.style.left = '0';
        resultsPanel.style.width = '100%';
        resultsPanel.style.marginTop = '15px';
        
        chartPanel.style.position = 'relative';
        chartPanel.style.left = '0';
        chartPanel.style.right = '0';
        chartPanel.style.width = '100%';
        chartPanel.style.marginTop = '15px';
        
        uiWrapper.style.padding = '15px';
      }
      else {
        // Side-by-side layout for larger screens
        controlPanel.style.position = 'absolute';
        controlPanel.style.left = '15px';
        controlPanel.style.width = '450px';
        controlPanel.style.maxHeight = 'calc(100% - 30px)';
        
        resultsPanel.style.position = 'absolute';
        resultsPanel.style.left = '480px';
        resultsPanel.style.top = '15px';
        resultsPanel.style.width = ( layoutWidth - 480 - 15 ) + 'px';
        
        chartPanel.style.position = 'absolute';
        chartPanel.style.left = '480px';
        chartPanel.style.top = '150px';
        chartPanel.style.right = '15px';
        chartPanel.style.marginTop = '0';
        
        uiWrapper.style.padding = '0';
      }
    };
    window.addEventListener( 'resize', onResize );
    onResize();

    // Track Chart.js instance
    let chartInstance: any = null;

    // View update function - observes model and updates UI
    const updateView = (): void => {
      const monthlyPayment = model.monthlyPaymentProperty.value;
      const totalInterest = model.totalInterestProperty.value;
      const totalPaid = model.totalPaidProperty.value;
      const schedule = model.scheduleArray.slice();

      if ( model.loanAmountProperty.value <= 0 || model.termYearsProperty.value <= 0 ) {
        resultsDiv.innerHTML = '<em>Please enter a positive loan amount and term.</em>';
        tableContainer.innerHTML = '';
        return;
      }

      // Update results display
      resultsDiv.innerHTML = `Total interest: <strong>$${formatNumber( totalInterest )}</strong><br/>Total paid: <strong>$${formatNumber( totalPaid )}</strong>`;

      // Update table
      tableContainer.innerHTML = '';
      renderAmortizationTable( tableContainer, schedule );

      // Update chart
      try {
        const Chart = ( window as any ).Chart;
        if ( Chart && schedule.length > 0 ) {
          const ctx = ( chartCanvas as HTMLCanvasElement ).getContext( '2d' );
          const yearly = aggregateByYear( schedule );
          const labels = yearly.map( y => `Year ${y.year}` );
          const principalAmounts = yearly.map( y => y.principalPaid );
          const interestAmounts = yearly.map( y => y.interestPaid );
          const totalAmounts = principalAmounts.map( ( p, i ) => p + interestAmounts[ i ] );
          const principalPercent = principalAmounts.map( ( p, i ) => totalAmounts[ i ] ? ( p / totalAmounts[ i ] ) * 100 : 0 );
          const interestPercent = interestAmounts.map( ( v, i ) => totalAmounts[ i ] ? ( v / totalAmounts[ i ] ) * 100 : 0 );

          const datasets = [
            { label: 'Principal', data: principalPercent, backgroundColor: '#2bbfbd', stack: 'combined' },
            { label: 'Interest', data: interestPercent, backgroundColor: '#e05252', stack: 'combined' }
          ];

          const config = {
            type: 'bar',
            data: { labels: labels, datasets: datasets },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                tooltip: {
                  callbacks: {
                    label: function( context: any ): string {
                      const dsLabel = context.dataset.label || '';
                      const idx = context.dataIndex;
                      const pct = context.dataset.data[ idx ];
                      const amount = dsLabel === 'Principal' ? principalAmounts[ idx ] : interestAmounts[ idx ];
                      return `${dsLabel}: ${pct.toFixed( 1 )}% ($${formatNumber( amount )})`;
                    }
                  }
                }
              },
              scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true, max: 100, ticks: { callback: ( v: any ) => `${v}%` } }
              }
            }
          };

          if ( chartInstance ) {
            chartInstance.data.labels = labels;
            chartInstance.data.datasets = datasets;
            chartInstance.update();
          }
          else {
            chartInstance = new Chart( ctx, config );
          }
        }
      }
      catch ( chartErr ) {
        console.warn( 'Failed to render chart', chartErr );
      }
    };

    // Handle calculate button click - update model properties (controller logic)
    const onCalculate = (): void => {
      const loanAmount = parseFloat( amountField.input.value ) || 0;
      const termYears = parseFloat( termField.input.value ) || 0;
      const interestRate = parseFloat( rateField.input.value ) || 0;
      model.loanAmountProperty.value = loanAmount;
      model.termYearsProperty.value = termYears;
      model.interestRateProperty.value = interestRate;
      model.computeSchedule();
      updateView();
    };

    calculateButton.addEventListener( 'click', onCalculate );
    form.addEventListener( 'submit', ( e: Event ) => {
      e.preventDefault();
      onCalculate();
    } );

    // Initial render
    updateView();

    // Reset button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        amountField.input.value = model.loanAmountProperty.value.toString();
        termField.input.value = model.termYearsProperty.value.toString();
        rateField.input.value = model.interestRateProperty.value.toString();
      },
      right: this.layoutBounds.maxX - AmortizationCalcConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - AmortizationCalcConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // Disposal
    this.disposeAmortizationCalcScreenView = () => {
      window.removeEventListener( 'resize', onResize );
      calculateButton.removeEventListener( 'click', onCalculate );
      uiNode.dispose();
      resetAllButton.dispose();
    };
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    // View-specific reset handled by reset button listener
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    // no-op unless animations are added
  }

  /**
   * Disposes this view.
   */
  public override dispose(): void {
    this.disposeAmortizationCalcScreenView();
    super.dispose();
  }
}

amortizationCalc.register( 'AmortizationCalcScreenView', AmortizationCalcScreenView );
