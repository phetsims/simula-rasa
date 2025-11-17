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
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Panel from '../../../../sun/js/Panel.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Range from '../../../../dot/js/Range.js';
import Color from '../../../../scenery/js/util/Color.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import AxisLine from '../../../../bamboo/js/AxisLine.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Vector2 from '../../../../dot/js/Vector2.js';
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
const RESULTS_FONT = new PhetFont( 18 );
const CONTROL_PANEL_WIDTH = 300;

export default class AmortizationCalcScreenView extends ScreenView {

  private readonly model: AmortizationCalcModel;
  private readonly disposeAmortizationCalcScreenView: () => void;
  private readonly resultsText: Text;
  private readonly comparisonText: Text;
  private readonly combinedGraphContainer: Node;
  private readonly graphTitleText: Text;
  private readonly graphInfoBox: VBox;
  private readonly extraPaymentControl: NumberControl;
  private readonly extraPaymentPanel: Panel;
  private readonly calculateButton: RectangularPushButton;
  private readonly chartNode: Node;
  private readonly chartTransform: ChartTransform;
  private chartCanvasNode: ChartCanvasNode | null = null;
  private standardInterestPlot: CanvasLinePlot | null = null;
  private standardPrincipalPlot: CanvasLinePlot | null = null;
  private extraInterestPlot: CanvasLinePlot | null = null;
  private extraPrincipalPlot: CanvasLinePlot | null = null;

  public constructor( model: AmortizationCalcModel, providedOptions: AmortizationCalcScreenViewOptions ) {

    const options = optionize<AmortizationCalcScreenViewOptions, SelfOptions, ScreenViewOptions>()( {
      // No additional options needed
    }, providedOptions );

    super( options );

    this.model = model;

    // Title for control panel
    const controlTitleText = new Text( 'Loan Explorer', {
      font: TITLE_FONT,
      fill: ACCENT_COLOR,
      tandem: options.tandem.createTandem( 'controlTitleText' )
    } );

    // Create NumberControl for Loan Amount
    const loanAmountControl = new NumberControl( 'Loan Amount ($):', model.loanAmountProperty, new Range( 10000, 1000000 ), {
      delta: 10000,
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
        maxWidth: 200
      },
      layoutFunction: NumberControl.createLayoutFunction4(),
      tandem: options.tandem.createTandem( 'loanAmountControl' )
    } );

    // Create radio button group for Term Years (15 or 30)
    const termYearsLabel = new Text( 'Term:', {
      font: LABEL_FONT
    } );
    
    const termYearsRadioButtonGroup = new AquaRadioButtonGroup( model.termYearsProperty, [
      { value: 15, createNode: () => new Text( '15 years', { font: LABEL_FONT } ), tandemName: 'fifteenYearsRadioButton' },
      { value: 30, createNode: () => new Text( '30 years', { font: LABEL_FONT } ), tandemName: 'thirtyYearsRadioButton' }
    ], {
      spacing: 8,
      radioButtonOptions: {
        radius: 8
      },
      tandem: options.tandem.createTandem( 'termYearsRadioButtonGroup' )
    } );
    
    const termYearsControl = new VBox( {
      children: [ termYearsLabel, termYearsRadioButtonGroup ],
      spacing: 5,
      align: 'left'
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
        maxWidth: 200
      },
      layoutFunction: NumberControl.createLayoutFunction4(),
      tandem: options.tandem.createTandem( 'interestRateControl' )
    } );

    // Calculate Button
    const calculateButtonText = new Text( 'Amortize!', {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      fill: 'white'
    } );
    
    this.calculateButton = new RectangularPushButton( {
      content: calculateButtonText,
      baseColor: ACCENT_COLOR,
      listener: () => {
        model.computeSchedule();
        // Unlock extra payment panel after first calculation
        this.extraPaymentPanel.visible = true;
      },
      xMargin: 20,
      yMargin: 10,
      tandem: options.tandem.createTandem( 'calculateButton' )
    } );

    // Results summary text for monthly payment only
    this.resultsText = new Text( '', {
      font: RESULTS_FONT,
      fill: 'black',
      tandem: options.tandem.createTandem( 'resultsText' )
    } );

    // Comparison text showing impact of extra payments
    this.comparisonText = new Text( '', {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      fill: new Color( '#0a8a0a' ),
      maxWidth: CONTROL_PANEL_WIDTH - 40,
      tandem: options.tandem.createTandem( 'comparisonText' )
    } );

    // Control Panel Content (vertical stack)
    const controlPanelContent = new VBox( {
      children: [
        controlTitleText,
        loanAmountControl,
        termYearsControl,
        interestRateControl,
        this.calculateButton,
        this.resultsText
      ],
      spacing: 15,
      align: 'left'
    } );

    // Wrap control panel in Panel component
    const controlPanel = new Panel( controlPanelContent, {
      fill: PANEL_FILL,
      stroke: new Color( '#ccc' ),
      lineWidth: 2,
      cornerRadius: 8,
      xMargin: 20,
      yMargin: 15,
      tandem: options.tandem.createTandem( 'controlPanel' )
    } );

    // Position control panel at top left
    controlPanel.left = AmortizationCalcConstants.SCREEN_VIEW_X_MARGIN + 20;
    controlPanel.top = AmortizationCalcConstants.SCREEN_VIEW_Y_MARGIN + 10;
    this.addChild( controlPanel );

    // Create Extra Payment Panel (initially hidden/locked)
    const extraPaymentTitleText = new Text( 'Discovery Mode', {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      fill: new Color( '#0a8a0a' )
    } );

    // Create NumberControl for Extra Monthly Payment
    this.extraPaymentControl = new NumberControl( 'Extra Monthly Payment ($):', model.extraMonthlyPaymentProperty, new Range( 0, 1000 ), {
      delta: 25,
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
        maxWidth: 200
      },
      layoutFunction: NumberControl.createLayoutFunction4(),
      tandem: options.tandem.createTandem( 'extraPaymentControl' )
    } );

    // Re-amortize Button
    const reAmortizeButtonText = new Text( 'Re-amortize!', {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      fill: 'white'
    } );
    
    const reAmortizeButton = new RectangularPushButton( {
      content: reAmortizeButtonText,
      baseColor: new Color( '#0a8a0a' ),
      listener: () => {
        model.computeSchedule();
      },
      xMargin: 20,
      yMargin: 10,
      tandem: options.tandem.createTandem( 'reAmortizeButton' )
    } );

    const extraPanelContent = new VBox( {
      children: [
        extraPaymentTitleText,
        this.extraPaymentControl,
        reAmortizeButton,
        this.comparisonText
      ],
      spacing: 12,
      align: 'left'
    } );

    this.extraPaymentPanel = new Panel( extraPanelContent, {
      fill: PANEL_FILL,
      stroke: new Color( '#0a8a0a' ),
      lineWidth: 2,
      cornerRadius: 8,
      xMargin: 20,
      yMargin: 15,
      visible: false, // Initially hidden until first calculation
      tandem: options.tandem.createTandem( 'extraPaymentPanel' )
    } );

    // Position extra payment panel below control panel
    this.extraPaymentPanel.left = controlPanel.left;
    this.extraPaymentPanel.top = controlPanel.bottom + 20;
    this.addChild( this.extraPaymentPanel );

    // Combined Graph Panel
    this.graphTitleText = new Text( 'Payment Breakdown', {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      fill: ACCENT_COLOR,
      tandem: options.tandem.createTandem( 'graphTitleText' )
    } );

    // Info box for graph (will be updated with metrics)
    this.graphInfoBox = new VBox( {
      children: [ this.graphTitleText ],
      spacing: 5,
      align: 'center'
    } );

    this.combinedGraphContainer = new Node();
    const combinedGraphBackground = new Rectangle( 0, 0, 600, 450, {
      fill: 'white',
      stroke: '#ddd',
      lineWidth: 1
    } );
    this.combinedGraphContainer.addChild( combinedGraphBackground );

    const combinedGraphContent = new VBox( {
      children: [ this.graphInfoBox, this.combinedGraphContainer ],
      spacing: 8,
      align: 'center'
    } );

    // Wrap combined graph in Panel component
    const combinedGraphPanel = new Panel( combinedGraphContent, {
      fill: PANEL_FILL,
      stroke: new Color( '#ccc' ),
      lineWidth: 2,
      cornerRadius: 8,
      xMargin: 15,
      yMargin: 15,
      tandem: options.tandem.createTandem( 'combinedGraphPanel' )
    } );

    // Position combined graph on right side
    combinedGraphPanel.right = this.layoutBounds.maxX - AmortizationCalcConstants.SCREEN_VIEW_X_MARGIN - 20;
    combinedGraphPanel.top = AmortizationCalcConstants.SCREEN_VIEW_Y_MARGIN + 10;
    this.addChild( combinedGraphPanel );

    // Initialize chart transform and node for bamboo charts
    const graphWidth = 600;
    const graphHeight = 450;
    const modelViewTransformRange = new Range( 0, 360 ); // months
    const modelViewTransformDomain = new Range( 0, 5000 ); // dollars (will be updated dynamically)
    
    this.chartTransform = new ChartTransform( {
      viewWidth: graphWidth,
      viewHeight: graphHeight,
      modelXRange: modelViewTransformRange,
      modelYRange: modelViewTransformDomain
    } );

    this.chartNode = new Node();

    // Helper function to render combined graph with bamboo charts
    const renderCombinedGraph = ( container: Node, standardSchedule: any[], extraSchedule: any[], graphWidth: number, graphHeight: number ): void => {
      // Clear existing plots
      container.removeAllChildren();
      if ( this.chartCanvasNode ) {
        this.chartCanvasNode.dispose();
        this.chartCanvasNode = null;
      }
      if ( this.standardInterestPlot ) this.standardInterestPlot.dispose();
      if ( this.standardPrincipalPlot ) this.standardPrincipalPlot.dispose();
      if ( this.extraInterestPlot ) this.extraInterestPlot.dispose();
      if ( this.extraPrincipalPlot ) this.extraPrincipalPlot.dispose();
      this.standardInterestPlot = null;
      this.standardPrincipalPlot = null;
      this.extraInterestPlot = null;
      this.extraPrincipalPlot = null;

      if ( standardSchedule.length === 0 ) return;

      // Determine max values for dynamic scaling
      const termYears = model.termYearsProperty.value;
      const termMonths = termYears * 12;
      
      // Find max payment amount across all schedules for y-axis scaling
      let maxPayment = 100;
      [ standardSchedule, extraSchedule ].forEach( schedule => {
        schedule.forEach( entry => {
          maxPayment = Math.max( maxPayment, entry.principal || 0, entry.interest || 0 );
        } );
      } );

      // Update chart transform with current data ranges
      this.chartTransform.setModelXRange( new Range( 0, termMonths ) );
      this.chartTransform.setModelYRange( new Range( 0, maxPayment * 1.1 ) ); // 10% padding

      // Clear and rebuild chart
      this.chartNode.removeAllChildren();

      // Add chart rectangle (boundary)
      const chartRectangle = new ChartRectangle( this.chartTransform, {
        fill: 'white',
        stroke: new Color( 220, 220, 220 ),
        lineWidth: 1
      } );
      this.chartNode.addChild( chartRectangle );

      // Add grid lines
      const gridLineSet = new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, 1000, {
        stroke: new Color( 230, 230, 230 ),
        lineWidth: 0.5
      } );
      this.chartNode.addChild( gridLineSet );

      // Add axes
      const xAxisLine = new AxisLine( this.chartTransform, Orientation.HORIZONTAL, {
        stroke: new Color( 51, 51, 51 ),
        lineWidth: 2
      } );
      const yAxisLine = new AxisLine( this.chartTransform, Orientation.VERTICAL, {
        stroke: new Color( 51, 51, 51 ),
        lineWidth: 2
      } );
      this.chartNode.addChild( xAxisLine );
      this.chartNode.addChild( yAxisLine );

      // Helper to convert schedule to Vector2 data points
      const scheduleToDataPoints = ( schedule: any[], field: 'principal' | 'interest' ): Vector2[] => {
        return schedule.map( ( entry, index ) => new Vector2( index, entry[ field ] || 0 ) );
      };

      // Create standard interest plot (orange)
      const standardInterestData = scheduleToDataPoints( standardSchedule, 'interest' );
      this.standardInterestPlot = new CanvasLinePlot( this.chartTransform, standardInterestData, {
        stroke: new Color( 232, 116, 59 ), // #e8743b
        lineWidth: extraSchedule.length > 0 ? 1.5 : 2,
        lineDash: extraSchedule.length > 0 ? [ 5, 3 ] : []
      } );

      // Create standard principal plot (green)
      const standardPrincipalData = scheduleToDataPoints( standardSchedule, 'principal' );
      this.standardPrincipalPlot = new CanvasLinePlot( this.chartTransform, standardPrincipalData, {
        stroke: new Color( 25, 169, 121 ), // #19a979
        lineWidth: extraSchedule.length > 0 ? 1.5 : 2,
        lineDash: extraSchedule.length > 0 ? [ 5, 3 ] : []
      } );

      // Collect all painters for ChartCanvasNode
      const painters = [ this.standardInterestPlot, this.standardPrincipalPlot ];

      // If extra schedule exists, draw those lines (solid, more prominent)
      if ( extraSchedule.length > 0 ) {
        const extraInterestData = scheduleToDataPoints( extraSchedule, 'interest' );
        this.extraInterestPlot = new CanvasLinePlot( this.chartTransform, extraInterestData, {
          stroke: new Color( 232, 116, 59 ), // #e8743b
          lineWidth: 3
        } );
        painters.push( this.extraInterestPlot );

        const extraPrincipalData = scheduleToDataPoints( extraSchedule, 'principal' );
        this.extraPrincipalPlot = new CanvasLinePlot( this.chartTransform, extraPrincipalData, {
          stroke: new Color( 25, 169, 121 ), // #19a979
          lineWidth: 3
        } );
        painters.push( this.extraPrincipalPlot );
      }

      // Create ChartCanvasNode to render all the plots
      this.chartCanvasNode = new ChartCanvasNode( this.chartTransform, painters );
      this.chartNode.addChild( this.chartCanvasNode );

      // Add year labels on x-axis
      for ( let year = 1; year <= termYears; year++ ) {
        if ( year === 1 || year === termYears || year % 5 === 0 ) {
          const monthNumber = year * 12;
          const viewPoint = this.chartTransform.modelToViewXY( monthNumber, 0 );
          const yearLabel = new Text( `Year ${year}`, {
            font: new PhetFont( 10 ),
            fill: '#333',
            centerX: viewPoint.x,
            top: viewPoint.y + 8
          } );
          this.chartNode.addChild( yearLabel );
        }
      }

      // Add y-axis label
      const yLabel = new Text( 'Monthly Payment ($)', {
        font: new PhetFont( { size: 11, weight: 'bold' } ),
        fill: '#333',
        rotation: -Math.PI / 2,
        right: this.chartTransform.modelToViewXY( 0, 0 ).x - 15,
        centerY: graphHeight / 2
      } );
      this.chartNode.addChild( yLabel );

      // Add legend
      const legendText = new Text( 'Green: Principal | Orange: Interest', {
        font: new PhetFont( 11 ),
        fill: '#666',
        centerX: graphWidth / 2,
        top: 10
      } );
      this.chartNode.addChild( legendText );

      if ( extraSchedule.length > 0 ) {
        const dashedLegendText = new Text( 'Dashed: Standard | Solid: With Extra Payments', {
          font: new PhetFont( 10 ),
          fill: '#666',
          centerX: graphWidth / 2,
          top: 28
        } );
        this.chartNode.addChild( dashedLegendText );
      }

      // Add the chart node to the container
      container.addChild( this.chartNode );
    };

    // View update function - observes model and updates UI
    const updateView = (): void => {
      const monthlyPayment = model.monthlyPaymentProperty.value;
      const totalInterest = model.totalInterestProperty.value;
      const totalPaid = model.totalPaidProperty.value;
      const schedule = model.scheduleArray.slice();
      const extraPayment = model.extraMonthlyPaymentProperty.value;

      if ( model.loanAmountProperty.value <= 0 || model.termYearsProperty.value <= 0 ) {
        this.resultsText.string = 'Please enter positive values';
        this.comparisonText.string = '';
        return;
      }

      // Update results text to show only monthly payment
      this.resultsText.string = `Monthly Payment: $${formatNumber( monthlyPayment )}`;

      // Update info box with metrics
      this.graphInfoBox.removeAllChildren();
      this.graphInfoBox.addChild( this.graphTitleText );
      
      // Standard scenario metrics
      const standardMonthsText = new Text( `Standard: ${schedule.length} months`, {
        font: new PhetFont( 11 ),
        fill: '#666'
      } );
      const standardTotalText = new Text( `Total: $${formatNumber( totalPaid )}`, {
        font: new PhetFont( { size: 11, weight: 'bold' } ),
        fill: '#333'
      } );
      const standardInterestText = new Text( `Interest: $${formatNumber( totalInterest )}`, {
        font: new PhetFont( 11 ),
        fill: '#e8743b'
      } );
      
      const standardMetrics = new HBox( {
        children: [ standardMonthsText, standardTotalText, standardInterestText ],
        spacing: 15
      } );
      this.graphInfoBox.addChild( standardMetrics );
      
      // Extra scenario metrics (if applicable)
      const scheduleWithExtra = model.scheduleWithExtraArray.slice();
      if ( extraPayment > 0 && scheduleWithExtra.length > 0 ) {
        const totalPaidWithExtra = model.totalPaidWithExtraProperty.value;
        const totalInterestWithExtra = model.totalInterestWithExtraProperty.value;
        
        const extraMonthsText = new Text( `With Extra: ${scheduleWithExtra.length} months`, {
          font: new PhetFont( 11 ),
          fill: '#666'
        } );
        const extraTotalText = new Text( `Total: $${formatNumber( totalPaidWithExtra )}`, {
          font: new PhetFont( { size: 11, weight: 'bold' } ),
          fill: '#333'
        } );
        const extraInterestText = new Text( `Interest: $${formatNumber( totalInterestWithExtra )}`, {
          font: new PhetFont( 11 ),
          fill: '#19a979'
        } );
        
        const extraMetrics = new HBox( {
          children: [ extraMonthsText, extraTotalText, extraInterestText ],
          spacing: 15
        } );
        this.graphInfoBox.addChild( extraMetrics );
      }

      // Update comparison text if extra payments are being made
      if ( extraPayment > 0 && scheduleWithExtra.length > 0 ) {
        const monthsSaved = model.monthsSavedProperty.value;
        const interestSaved = model.interestSavedProperty.value;
        const yearsSaved = ( monthsSaved / 12 ).toFixed( 1 );
        this.comparisonText.string = `🎉 Discovery! By paying $${formatNumber( extraPayment )} extra each month:\n• Pay off ${yearsSaved} years earlier!\n• Save $${formatNumber( interestSaved )} in interest!`;
      } else {
        this.comparisonText.string = extraPayment === 0 ? '💡 Try adding an extra monthly payment to see the impact!' : '';
      }

      // Render combined graph with both scenarios
      renderCombinedGraph( this.combinedGraphContainer, schedule, scheduleWithExtra, 600, 450 );
    };

    // Listen to model changes - need to watch BOTH schedules
    const scheduleListener = () => updateView();
    model.scheduleArray.elementAddedEmitter.addListener( scheduleListener );
    model.scheduleArray.elementRemovedEmitter.addListener( scheduleListener );
    model.scheduleWithExtraArray.elementAddedEmitter.addListener( scheduleListener );
    model.scheduleWithExtraArray.elementRemovedEmitter.addListener( scheduleListener );

    // Don't render initially - wait for user to click Amortize

    // Reset button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        // Clear the graph
        this.combinedGraphContainer.removeAllChildren();
        this.combinedGraphContainer.addChild( new Rectangle( 0, 0, 600, 450, {
          fill: 'white',
          stroke: '#ddd',
          lineWidth: 1
        } ) );
        this.resultsText.string = '';
        this.comparisonText.string = '';
        this.graphInfoBox.removeAllChildren();
        this.graphInfoBox.addChild( this.graphTitleText );
        this.extraPaymentPanel.visible = false;
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
      model.scheduleWithExtraArray.elementAddedEmitter.removeListener( scheduleListener );
      model.scheduleWithExtraArray.elementRemovedEmitter.removeListener( scheduleListener );
      controlPanel.dispose();
      this.extraPaymentPanel.dispose();
      combinedGraphPanel.dispose();
      resetAllButton.dispose();
      loanAmountControl.dispose();
      termYearsRadioButtonGroup.dispose();
      interestRateControl.dispose();
      this.calculateButton.dispose();
      this.extraPaymentControl.dispose();
      reAmortizeButton.dispose();
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
