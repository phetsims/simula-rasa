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
    const initialWrapperWidth = Math.min( 720, Math.round( this.layoutBounds.width * 0.95 ) );
    uiWrapper.style.width = initialWrapperWidth + 'px';
    uiWrapper.style.maxWidth = '95vw';
    uiWrapper.style.minWidth = '320px';
    uiWrapper.style.overflowX = 'auto';
    uiWrapper.style.background = '#ffffff';
    uiWrapper.style.padding = '6px';
    uiWrapper.style.border = '1px solid #ddd';
    uiWrapper.style.borderRadius = '4px';
    uiWrapper.style.boxSizing = 'border-box';
    uiWrapper.style.pointerEvents = 'auto';
    uiWrapper.tabIndex = 0;
    uiWrapper.style.position = 'relative';
    uiWrapper.style.zIndex = '1000';
    uiWrapper.style.display = 'flex';
    uiWrapper.style.flexDirection = 'column';
    uiWrapper.style.gap = '8px';
    uiWrapper.style.marginLeft = 'auto';
    uiWrapper.style.marginRight = 'auto';

    // Prevent pointer events from bubbling to Scenery
    const stop = ( e: Event ) => {
      e.stopPropagation();
    };
    [ 'pointerdown', 'pointermove', 'pointerup', 'mousedown', 'mousemove', 'mouseup', 'click' ].forEach( ev => uiWrapper.addEventListener( ev, stop ) );

    // Create left column for form, results, and table
    const leftColumn = document.createElement( 'div' );
    leftColumn.style.flex = '0 0 280px';
    leftColumn.style.display = 'flex';
    leftColumn.style.flexDirection = 'column';
    leftColumn.style.gap = '8px';
    leftColumn.style.minWidth = '0';

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
      label.style.fontSize = '12px';
      label.style.marginBottom = '2px';
      const input = document.createElement( 'input' );
      input.type = 'number';
      input.value = inputValue;
      input.style.padding = '6px 8px';
      input.style.boxSizing = 'border-box';
      input.style.fontSize = '14px';
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
    calculateButton.textContent = 'Calculate';
    calculateButton.style.padding = '8px 12px';
    calculateButton.style.fontSize = '14px';
    calculateButton.addEventListener( 'click', stop );
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

    // Append to left column
    leftColumn.appendChild( form );
    leftColumn.appendChild( resultsDiv );
    leftColumn.appendChild( tableContainer );

    // Empty middle column for future use
    const middleColumn = document.createElement( 'div' );
    middleColumn.style.flex = '1';
    middleColumn.style.minWidth = '0';

    // Top section with two columns
    const topSection = document.createElement( 'div' );
    topSection.style.display = 'flex';
    topSection.style.gap = '12px';
    topSection.style.width = '100%';
    topSection.appendChild( leftColumn );
    topSection.appendChild( middleColumn );

    // Chart section
    const chartSection = document.createElement( 'div' );
    chartSection.style.width = '100%';
    chartSection.style.marginTop = '8px';
    chartSection.style.boxSizing = 'border-box';

    const chartCanvas = document.createElement( 'canvas' );
    chartCanvas.style.width = '100%';
    chartCanvas.style.height = '200px';
    chartSection.appendChild( chartCanvas );

    uiWrapper.appendChild( topSection );
    uiWrapper.appendChild( chartSection );

    const uiNode = new DOM( uiWrapper, { left: 0, top: 40, tandem: options.tandem.createTandem( 'amortizationUI' ) } );
    this.addChild( uiNode );

    // Responsive layout
    const onResize = (): void => {
      const w = Math.min( 720, Math.round( window.innerWidth * 0.95 ) );
      uiWrapper.style.width = w + 'px';
      if ( w < 560 ) {
        topSection.style.flexDirection = 'column';
        leftColumn.style.flex = '0 0 auto';
      }
      else {
        topSection.style.flexDirection = 'row';
        leftColumn.style.flex = '0 0 280px';
      }
    };
    window.addEventListener( 'resize', onResize );
    onResize();

    // Track Chart.js instance
    let chartInstance: any = null;

    // View update function - observes model and updates UI
    const updateView = async (): Promise<void> => {
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
      resultsDiv.innerHTML = `Monthly payment: <strong>$${formatNumber( monthlyPayment )}</strong><br/>Total interest: <strong>$${formatNumber( totalInterest )}</strong><br/>Total paid: <strong>$${formatNumber( totalPaid )}</strong>`;

      // Update table
      tableContainer.innerHTML = '';
      renderAmortizationTable( tableContainer, schedule );

      // Update chart
      try {
        await loadChartJS;
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
    };

    calculateButton.addEventListener( 'click', onCalculate );
    form.addEventListener( 'submit', ( e: Event ) => {
      e.preventDefault();
      onCalculate();
    } );

    // Observe model changes and update view
    const scheduleListener = () => updateView();
    model.scheduleArray.elementAddedEmitter.addListener( scheduleListener );
    model.scheduleArray.elementRemovedEmitter.addListener( scheduleListener );

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
      model.scheduleArray.elementAddedEmitter.removeListener( scheduleListener );
      model.scheduleArray.elementRemovedEmitter.removeListener( scheduleListener );
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
