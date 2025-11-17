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
import NumberProperty from '../../../../axon/js/NumberProperty.js';
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
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
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
  private animationProgress: NumberProperty = new NumberProperty( 0 );
  private fullStandardInterestData: Vector2[] = [];
  private fullStandardPrincipalData: Vector2[] = [];
  private fullExtraInterestData: Vector2[] = [];
  private fullExtraPrincipalData: Vector2[] = [];
  private isAnimating: boolean = false;
  private standardLinesDrawn: boolean = false;
  private cursorLine: Line | null = null;
  private principalCircle: Circle | null = null;
  private interestCircle: Circle | null = null;
  private principalTooltip: Panel | null = null;
  private interestTooltip: Panel | null = null;
  private chartHitArea: Rectangle | null = null;
  private activeSchedule: any[] = [];
  private monthLabel: Panel | null = null;

  public constructor( model: AmortizationCalcModel, providedOptions: AmortizationCalcScreenViewOptions ) {

    const options = optionize<AmortizationCalcScreenViewOptions, SelfOptions, ScreenViewOptions>()( {
      // Accessibility options
      tandem: providedOptions.tandem
    }, providedOptions );

    super( options );

    this.model = model;

    // Title for control panel
    const controlTitleText = new Text( 'Loan Explorer', {
      font: TITLE_FONT,
      fill: ACCENT_COLOR,
      tandem: options.tandem.createTandem( 'controlTitleText' ),
      // Accessibility
      tagName: 'h2',
      innerContent: 'Loan Explorer Controls'
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
      font: LABEL_FONT,
      // Accessibility
      tagName: 'label',
      innerContent: 'Loan Term'
    } );
    
    const termYearsRadioButtonGroup = new AquaRadioButtonGroup( model.termYearsProperty, [
      { 
        value: 15, 
        createNode: () => new Text( '15 years', { font: LABEL_FONT } ), 
        tandemName: 'fifteenYearsRadioButton'
      },
      { 
        value: 30, 
        createNode: () => new Text( '30 years', { font: LABEL_FONT } ), 
        tandemName: 'thirtyYearsRadioButton'
      }
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
      align: 'left',
      // Accessibility
      tagName: 'fieldset',
      labelTagName: 'legend',
      labelContent: 'Choose loan term: 15 or 30 years'
    } );

    // Create NumberControl for Interest Rate
    const interestRateControl = new NumberControl( 'Interest Rate (%):', model.interestRateProperty, new Range( 0, 12 ), {
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
      tandem: options.tandem.createTandem( 'calculateButton' ),
      // Accessibility
      innerContent: 'Amortize',
      appendDescription: true
    } );

    // Results summary text for monthly payment only
    this.resultsText = new Text( '', {
      font: RESULTS_FONT,
      fill: 'black',
      tandem: options.tandem.createTandem( 'resultsText' ),
      // Accessibility
      tagName: 'p',
      accessibleName: 'Calculation Results'
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
      tandem: options.tandem.createTandem( 'controlPanel' ),
      // Accessibility
      tagName: 'div',
      labelTagName: 'h2',
      labelContent: 'Loan Parameters',
      descriptionContent: 'Set the loan amount, term, and interest rate to calculate your amortization schedule'
    } );

    // Position control panel at top left
    controlPanel.left = AmortizationCalcConstants.SCREEN_VIEW_X_MARGIN + 20;
    controlPanel.top = AmortizationCalcConstants.SCREEN_VIEW_Y_MARGIN;
    this.addChild( controlPanel );

    // Create Extra Payment Panel (initially hidden/locked)
    const extraPaymentTitleText = new Text( 'What happens when you extra?', {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      fill: new Color( '#0a8a0a' ),
      // Accessibility
      tagName: 'h3',
      innerContent: 'Extra Payment Exploration'
    } );

    // Create NumberControl for Extra Monthly Payment
    this.extraPaymentControl = new NumberControl( 'Extra Monthly Payment ($):', model.extraMonthlyPaymentProperty, new Range( 0, 1000 ), {
      delta: 25,
      numberDisplayOptions: {
        decimalPlaces: 0,
        align: 'right',
        xMargin: 10,
        yMargin: 5,
        useRichText: false,
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
      tandem: options.tandem.createTandem( 'reAmortizeButton' ),
      // Accessibility
      innerContent: 'Re-amortize with Extra Payment',
      appendDescription: true
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
      tandem: options.tandem.createTandem( 'extraPaymentPanel' ),
      // Accessibility
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: 'Extra Payment Options',
      descriptionContent: 'Explore how making extra monthly payments can reduce your loan term and save on interest'
    } );

    // Position extra payment panel below control panel
    this.extraPaymentPanel.left = controlPanel.left;
    this.extraPaymentPanel.top = controlPanel.bottom ;
    this.addChild( this.extraPaymentPanel );

    // Combined Graph Panel
    this.graphTitleText = new Text( 'Payment Breakdown', {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      fill: ACCENT_COLOR,
      tandem: options.tandem.createTandem( 'graphTitleText' ),
      // Accessibility
      tagName: 'h2',
      innerContent: 'Payment Breakdown Over Time'
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
      tandem: options.tandem.createTandem( 'combinedGraphPanel' ),
      // Accessibility
      tagName: 'div',
      labelTagName: 'h2',
      labelContent: 'Interactive Payment Chart',
      descriptionContent: 'Line chart showing how principal and interest payments change over the life of the loan. Hover over the chart to see detailed values for each month.'
    } );

    // Position combined graph on right side
    combinedGraphPanel.right = this.layoutBounds.maxX - AmortizationCalcConstants.SCREEN_VIEW_X_MARGIN - 20;
    combinedGraphPanel.top = AmortizationCalcConstants.SCREEN_VIEW_Y_MARGIN;
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
      
      // If recalculating without extra payments, reset the flag so animation plays
      if ( extraSchedule.length === 0 ) {
        this.standardLinesDrawn = false;
      }

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

      // Store full datasets for animation
      this.fullStandardInterestData = scheduleToDataPoints( standardSchedule, 'interest' );
      this.fullStandardPrincipalData = scheduleToDataPoints( standardSchedule, 'principal' );

      // If adding extra payment and standard lines already drawn, show them instantly with lighter colors
      const standardInitialData = ( extraSchedule.length > 0 && this.standardLinesDrawn ) 
        ? this.fullStandardInterestData 
        : [];
      const principalInitialData = ( extraSchedule.length > 0 && this.standardLinesDrawn )
        ? this.fullStandardPrincipalData
        : [];

      // Use lighter colors when showing standard alongside extra payments
      const standardInterestColor = extraSchedule.length > 0 
        ? new Color( 232, 116, 59, 0.4 ) // Lighter orange with alpha
        : new Color( 232, 116, 59 ); // Full orange
      const standardPrincipalColor = extraSchedule.length > 0 
        ? new Color( 25, 169, 121, 0.4 ) // Lighter green with alpha
        : new Color( 25, 169, 121 ); // Full green

      this.standardInterestPlot = new CanvasLinePlot( this.chartTransform, standardInitialData, {
        stroke: standardInterestColor,
        lineWidth: 2,
        lineDash: extraSchedule.length > 0 ? [ 5, 3 ] : []
      } );

      this.standardPrincipalPlot = new CanvasLinePlot( this.chartTransform, principalInitialData, {
        stroke: standardPrincipalColor,
        lineWidth: 2,
        lineDash: extraSchedule.length > 0 ? [ 5, 3 ] : []
      } );

      // Collect all painters for ChartCanvasNode
      const painters = [ this.standardInterestPlot, this.standardPrincipalPlot ];

      // If extra schedule exists, prepare those lines too (use truncated data from model)
      if ( extraSchedule.length > 0 ) {
        // Get datasets - already truncated by model to exclude partial payments
        this.fullExtraInterestData = scheduleToDataPoints( extraSchedule, 'interest' );
        this.fullExtraPrincipalData = scheduleToDataPoints( extraSchedule, 'principal' );

        this.extraInterestPlot = new CanvasLinePlot( this.chartTransform, [], {
          stroke: new Color( 232, 116, 59 ), // #e8743b
          lineWidth: 3
        } );
        painters.push( this.extraInterestPlot );

        this.extraPrincipalPlot = new CanvasLinePlot( this.chartTransform, [], {
          stroke: new Color( 25, 169, 121 ), // #19a979
          lineWidth: 3
        } );
        painters.push( this.extraPrincipalPlot );
      } else {
        this.fullExtraInterestData = [];
        this.fullExtraPrincipalData = [];
      }

      // Create ChartCanvasNode to render all the plots
      this.chartCanvasNode = new ChartCanvasNode( this.chartTransform, painters );
      this.chartNode.addChild( this.chartCanvasNode );

      // Start animation from beginning
      this.animationProgress.value = 0;
      this.isAnimating = true;

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
        const dashedLegendText = new Text( 'Dashed/Light: Standard | Solid/Dark: With Extra Payments', {
          font: new PhetFont( 10 ),
          fill: '#666',
          centerX: graphWidth / 2,
          top: 28
        } );
        this.chartNode.addChild( dashedLegendText );
      }

      // Add the chart node to the container
      container.addChild( this.chartNode );
      
      // Add hover indicators for interactivity
      this.addHoverIndicators( container, standardSchedule, extraSchedule );
    };

    // View update function - observes model and updates UI
    const updateView = (): void => {
      const monthlyPayment = model.monthlyPaymentProperty.value;
      const totalInterest = model.totalInterestProperty.value;
      const totalPaid = model.totalPaidProperty.value;
      const schedule = model.scheduleArray.slice(); // Full schedule for totals
      const scheduleTruncated = model.scheduleArrayTruncated.slice(); // Truncated for graphing
      const extraPayment = model.extraMonthlyPaymentProperty.value;

      if ( model.loanAmountProperty.value <= 0 || model.termYearsProperty.value <= 0 ) {
        this.resultsText.string = 'Please enter positive values';
        this.comparisonText.string = '';
        // Update accessibility description
        this.resultsText.descriptionContent = 'Please enter positive values for loan amount and term';
        return;
      }

      // Update results text to show only monthly payment
      const monthlyPaymentFormatted = formatNumber( monthlyPayment );
      this.resultsText.string = `Monthly Payment: $${monthlyPaymentFormatted}`;
      
      // Update accessibility description with full context
      this.resultsText.descriptionContent = `Your monthly payment is $${monthlyPaymentFormatted}. ` +
        `Total interest over ${schedule.length} months: $${formatNumber( totalInterest )}. ` +
        `Total amount paid: $${formatNumber( totalPaid )}.`;

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
      
      // Extra scenario metrics - always show placeholder to prevent graph shifting
      const scheduleWithExtra = model.scheduleWithExtraArray.slice(); // Full for totals
      const scheduleWithExtraTruncated = model.scheduleWithExtraArrayTruncated.slice(); // Truncated for graphing
      
      let extraMonthsText: Text;
      let extraTotalText: Text;
      let extraInterestText: Text;
      
      if ( extraPayment > 0 && scheduleWithExtra.length > 0 ) {
        // Show actual extra payment metrics
        const totalPaidWithExtra = model.totalPaidWithExtraProperty.value;
        const totalInterestWithExtra = model.totalInterestWithExtraProperty.value;
        
        extraMonthsText = new Text( `With Extra: ${scheduleWithExtra.length} months`, {
          font: new PhetFont( 11 ),
          fill: '#666'
        } );
        extraTotalText = new Text( `Total: $${formatNumber( totalPaidWithExtra )}`, {
          font: new PhetFont( { size: 11, weight: 'bold' } ),
          fill: '#333'
        } );
        extraInterestText = new Text( `Interest: $${formatNumber( totalInterestWithExtra )}`, {
          font: new PhetFont( 11 ),
          fill: '#19a979'
        } );
      } else {
        // Show empty placeholder to maintain spacing
        extraMonthsText = new Text( ' ', {
          font: new PhetFont( 11 ),
          fill: '#666'
        } );
        extraTotalText = new Text( ' ', {
          font: new PhetFont( { size: 11, weight: 'bold' } ),
          fill: '#333'
        } );
        extraInterestText = new Text( ' ', {
          font: new PhetFont( 11 ),
          fill: '#19a979'
        } );
      }
      
      const extraMetrics = new HBox( {
        children: [ extraMonthsText, extraTotalText, extraInterestText ],
        spacing: 15
      } );
      this.graphInfoBox.addChild( extraMetrics );

      // Update comparison text and accessibility if extra payments are being made
      if ( extraPayment > 0 && scheduleWithExtra.length > 0 ) {
        const monthsSaved = model.monthsSavedProperty.value;
        const interestSaved = model.interestSavedProperty.value;
        const yearsSaved = ( monthsSaved / 12 ).toFixed( 1 );
        
        // Update comparison text accessibility description
        this.comparisonText.descriptionContent = `By paying an extra $${formatNumber( extraPayment )} per month, ` +
          `you will save ${monthsSaved} months (${yearsSaved} years) and $${formatNumber( interestSaved )} in interest. ` +
          `Your loan will be paid off in ${scheduleWithExtra.length} months instead of ${schedule.length} months.`;
      } else {
        this.comparisonText.descriptionContent = '';
      }

      // Render combined graph with both scenarios (use truncated schedules)
      renderCombinedGraph( this.combinedGraphContainer, scheduleTruncated, scheduleWithExtraTruncated, 600, 450 );
    };

    // Listen to model changes - watch properties that are set AFTER computation completes
    const scheduleListener = () => updateView();
    // Listen to properties that indicate computation is complete
    model.monthlyPaymentProperty.link( scheduleListener );
    model.totalInterestProperty.link( scheduleListener );
    model.totalPaidProperty.link( scheduleListener );
    // Also listen to extra payment properties for Re-amortize updates
    model.totalInterestWithExtraProperty.link( scheduleListener );
    model.totalPaidWithExtraProperty.link( scheduleListener );

    // Don't render initially - wait for user to click Amortize

    // Reset button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        // Dispose chart components properly BEFORE resetting model
        if ( this.chartCanvasNode ) {
          this.chartCanvasNode.dispose();
          this.chartCanvasNode = null;
        }
        if ( this.standardInterestPlot ) {
          this.standardInterestPlot.dispose();
          this.standardInterestPlot = null;
        }
        if ( this.standardPrincipalPlot ) {
          this.standardPrincipalPlot.dispose();
          this.standardPrincipalPlot = null;
        }
        if ( this.extraInterestPlot ) {
          this.extraInterestPlot.dispose();
          this.extraInterestPlot = null;
        }
        if ( this.extraPrincipalPlot ) {
          this.extraPrincipalPlot.dispose();
          this.extraPrincipalPlot = null;
        }
        if ( this.cursorLine ) {
          this.cursorLine.dispose();
          this.cursorLine = null;
        }
        if ( this.principalCircle ) {
          this.principalCircle.dispose();
          this.principalCircle = null;
        }
        if ( this.interestCircle ) {
          this.interestCircle.dispose();
          this.interestCircle = null;
        }
        if ( this.principalTooltip ) {
          this.principalTooltip.dispose();
          this.principalTooltip = null;
        }
        if ( this.interestTooltip ) {
          this.interestTooltip.dispose();
          this.interestTooltip = null;
        }
        if ( this.chartHitArea ) {
          this.chartHitArea.dispose();
          this.chartHitArea = null;
        }
        if ( this.monthLabel ) {
          this.monthLabel.dispose();
          this.monthLabel = null;
        }
        
        // Reset animation state
        this.standardLinesDrawn = false;
        this.isAnimating = false;
        this.animationProgress.value = 0;
        
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
        
        // Reset model properties without computing schedule
        model.loanAmountProperty.reset();
        model.termYearsProperty.reset();
        model.interestRateProperty.reset();
        model.extraMonthlyPaymentProperty.reset();
        
        // Clear model schedules and properties manually
        model.scheduleArray.clear();
        model.scheduleArrayTruncated.clear();
        model.scheduleWithExtraArray.clear();
        model.scheduleWithExtraArrayTruncated.clear();
        model.monthlyPaymentProperty.value = 0;
        model.totalInterestProperty.value = 0;
        model.totalPaidProperty.value = 0;
        model.totalInterestWithExtraProperty.value = 0;
        model.totalPaidWithExtraProperty.value = 0;
        model.monthsSavedProperty.value = 0;
        model.interestSavedProperty.value = 0;
      },
      right: this.layoutBounds.maxX - AmortizationCalcConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - AmortizationCalcConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // Disposal
    this.disposeAmortizationCalcScreenView = () => {
      // Unlink property listeners
      model.monthlyPaymentProperty.unlink( scheduleListener );
      model.totalInterestProperty.unlink( scheduleListener );
      model.totalPaidProperty.unlink( scheduleListener );
      model.totalInterestWithExtraProperty.unlink( scheduleListener );
      model.totalPaidWithExtraProperty.unlink( scheduleListener );
      // Dispose hover components
      if ( this.cursorLine ) {
        this.cursorLine.dispose();
      }
      if ( this.principalCircle ) {
        this.principalCircle.dispose();
      }
      if ( this.interestCircle ) {
        this.interestCircle.dispose();
      }
      if ( this.principalTooltip ) {
        this.principalTooltip.dispose();
      }
      if ( this.interestTooltip ) {
        this.interestTooltip.dispose();
      }
      if ( this.chartHitArea ) {
        this.chartHitArea.dispose();
      }
      if ( this.monthLabel ) {
        this.monthLabel.dispose();
      }
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
   * Adds interactive vertical line cursor with circles showing values at intersection points.
   */
  private addHoverIndicators( container: Node, standardSchedule: any[], extraSchedule: any[] ): void {
    // Remove existing hover components
    if ( this.cursorLine ) {
      this.cursorLine.dispose();
      this.cursorLine = null;
    }
    if ( this.principalCircle ) {
      this.principalCircle.dispose();
      this.principalCircle = null;
    }
    if ( this.interestCircle ) {
      this.interestCircle.dispose();
      this.interestCircle = null;
    }
    if ( this.principalTooltip ) {
      this.principalTooltip.dispose();
      this.principalTooltip = null;
    }
    if ( this.interestTooltip ) {
      this.interestTooltip.dispose();
      this.interestTooltip = null;
    }
    if ( this.chartHitArea ) {
      this.chartHitArea.dispose();
      this.chartHitArea = null;
    }
    if ( this.monthLabel ) {
      this.monthLabel.dispose();
      this.monthLabel = null;
    }

    // Use extra schedule if available, but keep both for tooltips
    this.activeSchedule = extraSchedule.length > 0 ? extraSchedule : standardSchedule;
    const showBothSchedules = extraSchedule.length > 0 && standardSchedule.length > 0;

    if ( this.activeSchedule.length === 0 ) return;

    // Get chart bounds - use view dimensions from chartTransform
    const chartWidth = this.chartTransform.viewWidth;
    const chartHeight = this.chartTransform.viewHeight;

    // Create vertical cursor line (initially hidden)
    this.cursorLine = new Line( 0, 0, 0, chartHeight, {
      stroke: new Color( 100, 100, 100, 0.5 ),
      lineWidth: 1,
      visible: false
    } );

    // Create principal circle (green)
    this.principalCircle = new Circle( 5, {
      fill: new Color( 25, 169, 121 ),
      stroke: 'white',
      lineWidth: 2,
      visible: false
    } );

    // Create interest circle (orange)
    this.interestCircle = new Circle( 5, {
      fill: new Color( 232, 116, 59 ),
      stroke: 'white',
      lineWidth: 2,
      visible: false
    } );

    // Create tooltip for principal
    const principalTooltipText = new Text( '', {
      font: new PhetFont( 11 ),
      fill: 'white'
    } );
    this.principalTooltip = new Panel( principalTooltipText, {
      fill: new Color( 25, 169, 121, 0.9 ),
      stroke: 'white',
      lineWidth: 1,
      cornerRadius: 4,
      xMargin: 6,
      yMargin: 4,
      visible: false
    } );

    // Create tooltip for interest
    const interestTooltipText = new Text( '', {
      font: new PhetFont( 11 ),
      fill: 'white'
    } );
    this.interestTooltip = new Panel( interestTooltipText, {
      fill: new Color( 232, 116, 59, 0.9 ),
      stroke: 'white',
      lineWidth: 1,
      cornerRadius: 4,
      xMargin: 6,
      yMargin: 4,
      visible: false
    } );

    // Create month label that follows cursor along x-axis with white background
    const monthLabelText = new Text( '', {
      font: new PhetFont( { size: 11, weight: 'bold' } ),
      fill: new Color( 100, 100, 100 )
    } );
    this.monthLabel = new Panel( monthLabelText, {
      fill: 'white',
      stroke: new Color( 200, 200, 200 ),
      lineWidth: 1,
      cornerRadius: 3,
      xMargin: 5,
      yMargin: 3,
      visible: false
    } );

    // Create invisible hit area over entire chart
    this.chartHitArea = new Rectangle( 0, 0, chartWidth, chartHeight, {
      fill: Color.TRANSPARENT,
      cursor: 'crosshair'
    } );

    // Add mouse move listener
    this.chartHitArea.addInputListener( {
      move: ( event: any ) => {
        const localPoint = this.chartHitArea!.globalToLocalPoint( event.pointer.point );
        
        // Convert view x to model x (month number)
        const modelX = this.chartTransform.viewToModelX( localPoint.x );
        const monthIndex = Math.round( Math.max( 0, Math.min( modelX, this.activeSchedule.length - 1 ) ) );
        
        if ( monthIndex >= 0 && monthIndex < this.activeSchedule.length ) {
          const entry = this.activeSchedule[ monthIndex ];
          
          // Also get standard schedule entry if showing both
          const standardEntry = showBothSchedules && monthIndex < standardSchedule.length 
            ? standardSchedule[ monthIndex ] 
            : null;
          
          // Get view positions for this month's data
          const principalPoint = this.chartTransform.modelToViewXY( monthIndex, entry.principal || 0 );
          const interestPoint = this.chartTransform.modelToViewXY( monthIndex, entry.interest || 0 );
          
          // Update cursor line position
          this.cursorLine!.setLine( localPoint.x, 0, localPoint.x, chartHeight );
          this.cursorLine!.visible = true;
          
          // Update month label
          monthLabelText.string = `Month ${entry.paymentNumber}`;
          this.monthLabel!.centerX = localPoint.x;
          this.monthLabel!.bottom = chartHeight - 5;
          this.monthLabel!.visible = true;
          
          // Update principal circle and tooltip
          this.principalCircle!.center = new Vector2( principalPoint.x, principalPoint.y );
          this.principalCircle!.visible = true;
          
          // Build tooltip text showing both values if available
          if ( standardEntry ) {
            principalTooltipText.string = `Principal: $${formatNumber( entry.principal )} (was $${formatNumber( standardEntry.principal )})`;
          } else {
            principalTooltipText.string = `Principal: $${formatNumber( entry.principal )}`;
          }
          
          // Position principal tooltip to the left, but clamp within bounds
          const principalTooltipX = Math.max( 0, principalPoint.x - this.principalTooltip!.width - 8 );
          this.principalTooltip!.x = principalTooltipX;
          this.principalTooltip!.centerY = principalPoint.y;
          this.principalTooltip!.visible = true;
          
          // Update interest circle and tooltip
          this.interestCircle!.center = new Vector2( interestPoint.x, interestPoint.y );
          this.interestCircle!.visible = true;
          
          // Build tooltip text showing both values if available
          if ( standardEntry ) {
            interestTooltipText.string = `Interest: $${formatNumber( entry.interest )} (was $${formatNumber( standardEntry.interest )})`;
          } else {
            interestTooltipText.string = `Interest: $${formatNumber( entry.interest )}`;
          }
          
          // Position interest tooltip to the right, but clamp within bounds
          const interestTooltipX = Math.min( chartWidth - this.interestTooltip!.width, interestPoint.x + 8 );
          this.interestTooltip!.x = interestTooltipX;
          this.interestTooltip!.centerY = interestPoint.y;
          this.interestTooltip!.visible = true;
        }
      },
      exit: () => {
        // Hide all cursor components when mouse leaves chart
        if ( this.cursorLine ) this.cursorLine.visible = false;
        if ( this.principalCircle ) this.principalCircle.visible = false;
        if ( this.interestCircle ) this.interestCircle.visible = false;
        if ( this.principalTooltip ) this.principalTooltip.visible = false;
        if ( this.interestTooltip ) this.interestTooltip.visible = false;
        if ( this.monthLabel ) this.monthLabel.visible = false;
      }
    } );

    // Add all components to container (order matters for z-index)
    container.addChild( this.chartHitArea );
    container.addChild( this.cursorLine );
    container.addChild( this.principalCircle );
    container.addChild( this.interestCircle );
    container.addChild( this.principalTooltip );
    container.addChild( this.interestTooltip );
    container.addChild( this.monthLabel );
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
    if ( this.isAnimating && this.chartCanvasNode ) {
      // Animate over 2 seconds total (optimized for performance)
      const maxMonths = Math.max(
        this.fullStandardInterestData.length,
        this.fullExtraInterestData.length
      );
      
      if ( maxMonths > 0 ) {
        // Increment progress (complete animation in 2 seconds)
        const increment = ( dt / 2.0 ) * maxMonths;
        this.animationProgress.value = Math.min( this.animationProgress.value + increment, maxMonths );
        
        const currentMonth = Math.floor( this.animationProgress.value );
        
        // Only animate standard plots if they haven't been drawn yet (first time)
        if ( !this.standardLinesDrawn ) {
          if ( this.standardInterestPlot && currentMonth > 0 ) {
            this.standardInterestPlot.setDataSet( this.fullStandardInterestData.slice( 0, currentMonth ) );
          }
          if ( this.standardPrincipalPlot && currentMonth > 0 ) {
            this.standardPrincipalPlot.setDataSet( this.fullStandardPrincipalData.slice( 0, currentMonth ) );
          }
        }
        
        // Update extra plots if they exist
        if ( this.extraInterestPlot && this.fullExtraInterestData.length > 0 && currentMonth > 0 ) {
          this.extraInterestPlot.setDataSet( this.fullExtraInterestData.slice( 0, Math.min( currentMonth, this.fullExtraInterestData.length ) ) );
        }
        if ( this.extraPrincipalPlot && this.fullExtraPrincipalData.length > 0 && currentMonth > 0 ) {
          this.extraPrincipalPlot.setDataSet( this.fullExtraPrincipalData.slice( 0, Math.min( currentMonth, this.fullExtraPrincipalData.length ) ) );
        }
        
        // Trigger canvas redraw
        this.chartCanvasNode.update();
        
        // Stop animating when complete
        if ( this.animationProgress.value >= maxMonths ) {
          this.isAnimating = false;
          // Mark standard lines as fully drawn if we just animated them
          if ( !this.standardLinesDrawn && this.fullExtraInterestData.length === 0 ) {
            this.standardLinesDrawn = true;
          }
        }
      }
    }
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
