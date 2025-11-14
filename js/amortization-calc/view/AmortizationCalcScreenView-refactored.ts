// Copyright 2014-2025, University of Colorado Boulder

/**
 * AmortizationCalcScreenView is the top-level view for the Amortization Calculator screen.
 * Fully refactored to use PhET scene graph components (Panel, NumberControl, VBox, HBox, Text, RectangularPushButton)
 * while keeping Chart.js and data table as DOM nodes for performance (360+ rows).
 *
 * @author Luke Thompson
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Panel from '../../../../sun/js/Panel.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import DOM from '../../../../scenery/js/nodes/DOM.js';
import Range from '../../../../dot/js/Range.js';
import Color from '../../../../scenery/js/util/Color.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { renderAmortizationTable, formatNumber, aggregateByYear } from '../../amortizationTable.js';
import AmortizationCalcConstants from '../../common/AmortizationCalcConstants.js';
import amortizationCalc from '../../amortizationCalc.js';
import AmortizationCalcModel from '../model/AmortizationCalcModel.js';

type SelfOptions = EmptySelfOptions;
type AmortizationCalcScreenViewOptions = SelfOptions & ScreenViewOptions;

// Constants for the view
const PANEL_FILL = new Color( '#f7f5f4' );
const ACCENT_COLOR = new Color( '#0c2049' );
const TITLE_FONT = new PhetFont( { size: 18, weight: 'bold' } );
const LABEL_FONT = new PhetFont( 14 );
const CONTROL_PANEL_WIDTH = 300;

export default class AmortizationCalcScreenView extends ScreenView {

  private readonly model: AmortizationCalcModel;
  private readonly disposeAmortizationCalcScreenView: () => void;
  private readonly tableDOMNode: DOM;
  private readonly chartDOMNode: DOM;
  private readonly resultsText: Text;

  public constructor( model: AmortizationCalcModel, providedOptions: AmortizationCalcScreenViewOptions ) {

    const options = optionize<AmortizationCalcScreenViewOptions, SelfOptions, ScreenViewOptions>()( {
      // No additional options needed
    }, providedOptions );

    super( options );

    this.model = model;

    // Title for control panel
    const controlTitleText = new Text( 'Loan Calculator', {
      font: TITLE_FONT,
      fill: ACCENT_COLOR,
      tandem: options.tandem.createTandem( 'controlTitleText' )
    } );

    // Create NumberControl for Loan Amount
    const loanAmountControl = new NumberControl( 'Loan Amount ($):', model.loanAmountProperty, new Range( 1000, 10000000 ), {
      delta: 1000,
      numberDisplayOptions: {
        decimalPlaces: 0,
        align: 'right',
        xMargin: 10,
        yMargin: 5,
        textOptions: {
          font: LABEL_FONT
        }
      },
      sliderOptions: {
        majorTickLength: 10,
        trackSize: new Dimension2( 180, 3 )
      },
      titleNodeOptions: {
        font: LABEL_FONT,
        maxWidth: 150
      },
      layoutFunction: NumberControl.createLayoutFunction4(),
      tandem: options.tandem.createTandem( 'loanAmountControl' )
    } );

    // Create NumberControl for Term Years
    const termYearsControl = new NumberControl( 'Term (years):', model.termYearsProperty, new Range( 1, 50 ), {
      delta: 1,
      numberDisplayOptions: {
        decimalPlaces: 0,
        align: 'right',
        xMargin: 10,
        yMargin: 5,
        textOptions: {
          font: LABEL_FONT
        }
      },
      sliderOptions: {
        majorTickLength: 10,
        trackSize: new Dimension2( 180, 3 )
      },
      titleNodeOptions: {
        font: LABEL_FONT,
        maxWidth: 150
      },
      layoutFunction: NumberControl.createLayoutFunction4(),
      tandem: options.tandem.createTandem( 'termYearsControl' )
    } );

    // Create NumberControl for Interest Rate
    const interestRateControl = new NumberControl( 'Interest Rate (%):', model.interestRateProperty, new Range( 0, 20 ), {
      delta: 0.1,
      numberDisplayOptions: {
        decimalPlaces: 2,
        align: 'right',
        xMargin: 10,
        yMargin: 5,
        textOptions: {
          font: LABEL_FONT
        }
      },
      sliderOptions: {
        majorTickLength: 10,
        trackSize: new Dimension2( 180, 3 )
      },
      titleNodeOptions: {
        font: LABEL_FONT,
        maxWidth: 150
      },
      layoutFunction: NumberControl.createLayoutFunction4(),
      tandem: options.tandem.createTandem( 'interestRateControl' )
    } );

    // Calculate Button
    const calculateButtonText = new Text( 'Amortize!', {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      fill: 'white'
    } );
    
    const calculateButton = new RectangularPushButton( {
      content: calculateButtonText,
      baseColor: ACCENT_COLOR,
      listener: () => {
        model.computeSchedule();
      },
      xMargin: 20,
      yMargin: 10,
      tandem: options.tandem.createTandem( 'calculateButton' )
    } );

    // Results summary text (will be updated dynamically)
    this.resultsText = new Text( '', {
      font: LABEL_FONT,
      fill: 'black',
      maxWidth: CONTROL_PANEL_WIDTH - 40,
      tandem: options.tandem.createTandem( 'resultsText' )
    } );

    // DOM node for amortization table (performance reasons - 360 rows)
    const tableContainer = document.createElement( 'div' );
    tableContainer.style.width = ( CONTROL_PANEL_WIDTH - 20 ) + 'px';
    tableContainer.style.maxHeight = '300px';
    tableContainer.style.overflow = 'auto';
    tableContainer.style.pointerEvents = 'auto';
    tableContainer.style.userSelect = 'text';
    tableContainer.style.marginTop = '10px';

    this.tableDOMNode = new DOM( tableContainer, {
      tandem: options.tandem.createTandem( 'tableDOMNode' )
    } );

    // Control Panel Content
    const controlPanelContent = new VBox( {
      children: [
        controlTitleText,
        loanAmountControl,
        termYearsControl,
        interestRateControl,
        calculateButton,
        this.resultsText,
        this.tableDOMNode
      ],
      spacing: 12,
      align: 'left'
    } );

    // Control Panel
    const controlPanel = new Panel( controlPanelContent, {
      fill: PANEL_FILL,
      stroke: new Color( '#ccc' ),
      lineWidth: 2,
      cornerRadius: 8,
      xMargin: 15,
      yMargin: 15,
      minWidth: CONTROL_PANEL_WIDTH,
      tandem: options.tandem.createTandem( 'controlPanel' )
    } );

    controlPanel.left = AmortizationCalcConstants.SCREEN_VIEW_X_MARGIN;
    controlPanel.top = AmortizationCalcConstants.SCREEN_VIEW_Y_MARGIN;
    this.addChild( controlPanel );

    // Chart Panel (right side) - uses DOM for Chart.js
    const chartTitleText = new Text( 'Payment Breakdown by Year', {
      font: TITLE_FONT,
      fill: ACCENT_COLOR,
      tandem: options.tandem.createTandem( 'chartTitleText' )
    } );

    // Create chart canvas in DOM
    const chartWrapper = document.createElement( 'div' );
    chartWrapper.style.width = '450px';
    chartWrapper.style.height = '350px';
    chartWrapper.style.position = 'relative';

    const chartCanvas = document.createElement( 'canvas' );
    chartCanvas.style.width = '100%';
    chartCanvas.style.height = '100%';
    chartWrapper.appendChild( chartCanvas );

    this.chartDOMNode = new DOM( chartWrapper, {
      tandem: options.tandem.createTandem( 'chartDOMNode' )
    } );

    // Chart Panel Content
    const chartPanelContent = new VBox( {
      children: [
        chartTitleText,
        this.chartDOMNode
      ],
      spacing: 10,
      align: 'center'
    } );

    // Chart Panel
    const chartPanel = new Panel( chartPanelContent, {
      fill: PANEL_FILL,
      stroke: new Color( '#ccc' ),
      lineWidth: 2,
      cornerRadius: 8,
      xMargin: 15,
      yMargin: 15,
      tandem: options.tandem.createTandem( 'chartPanel' )
    } );

    chartPanel.left = controlPanel.right + 20;
    chartPanel.top = AmortizationCalcConstants.SCREEN_VIEW_Y_MARGIN;
    this.addChild( chartPanel );

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

    // Track Chart.js instance
    let chartInstance: any = null;

    // View update function - observes model and updates UI
    const updateView = (): void => {
      const monthlyPayment = model.monthlyPaymentProperty.value;
      const totalInterest = model.totalInterestProperty.value;
      const totalPaid = model.totalPaidProperty.value;
      const schedule = model.scheduleArray.slice();

      if ( model.loanAmountProperty.value <= 0 || model.termYearsProperty.value <= 0 ) {
        this.resultsText.string = 'Please enter positive values';
        tableContainer.innerHTML = '';
        return;
      }

      // Update results text
      this.resultsText.string = `Monthly Payment: $${formatNumber( monthlyPayment )}\nTotal Interest: $${formatNumber( totalInterest )}\nTotal Paid: $${formatNumber( totalPaid )}`;

      // Update table
      tableContainer.innerHTML = '';
      renderAmortizationTable( tableContainer, schedule );

      // Update chart
      loadChartJS.then( () => {
        try {
          const Chart = ( window as any ).Chart;
          if ( Chart && schedule.length > 0 ) {
            const ctx = chartCanvas.getContext( '2d' );
            const yearly = aggregateByYear( schedule );
            const labels = yearly.map( y => `Year ${y.year}` );
            const principalAmounts = yearly.map( y => y.principalPaid );
            const interestAmounts = yearly.map( y => y.interestPaid );
            const totalAmounts = principalAmounts.map( ( p, i ) => p + interestAmounts[ i ] );
            const principalPercent = principalAmounts.map( ( p, i ) => totalAmounts[ i ] ? ( p / totalAmounts[ i ] ) * 100 : 0 );
            const interestPercent = interestAmounts.map( ( v, i ) => totalAmounts[ i ] ? ( v / totalAmounts[ i ] ) * 100 : 0 );

            const datasets = [
              { label: 'Principal', data: principalPercent, backgroundColor: '#c4efe5', stack: 'combined' },
              { label: 'Interest', data: interestPercent, backgroundColor: '#f1af7d', stack: 'combined' }
            ];

            const config = {
              type: 'bar',
              data: { labels: labels, datasets: datasets },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' as const },
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
      } ).catch( err => {
        console.error( 'Failed to load Chart.js', err );
      } );
    };

    // Listen to model changes
    const scheduleListener = () => updateView();
    model.scheduleArray.elementAddedEmitter.addListener( scheduleListener );
    model.scheduleArray.elementRemovedEmitter.addListener( scheduleListener );

    // Initial render
    updateView();

    // Reset button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        updateView();
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
      controlPanel.dispose();
      chartPanel.dispose();
      this.tableDOMNode.dispose();
      this.chartDOMNode.dispose();
      resetAllButton.dispose();
      loanAmountControl.dispose();
      termYearsControl.dispose();
      interestRateControl.dispose();
      calculateButton.dispose();
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
