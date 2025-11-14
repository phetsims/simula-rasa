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
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Shape from '../../../../kite/js/Shape.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
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
const RESULTS_FONT = new PhetFont( 18 );
const CONTROL_PANEL_WIDTH = 300;

export default class AmortizationCalcScreenView extends ScreenView {

  private readonly model: AmortizationCalcModel;
  private readonly disposeAmortizationCalcScreenView: () => void;
  private readonly resultsText: Text;
  private readonly comparisonText: Text;
  private readonly standardGraphContainer: Node;
  private readonly extraGraphContainer: Node;
  private readonly standardTitleText: Text;
  private readonly extraTitleText: Text;
  private readonly standardInfoBox: VBox;
  private readonly extraInfoBox: VBox;

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

    // Create NumberControl for Extra Monthly Payment
    const extraPaymentControl = new NumberControl( 'Extra Payment ($):', model.extraMonthlyPaymentProperty, new Range( 0, 5000 ), {
      delta: 50,
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
      tandem: options.tandem.createTandem( 'extraPaymentControl' )
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

    // Results summary text for monthly payment only
    this.resultsText = new Text( '', {
      font: RESULTS_FONT,
      fill: 'black',
      tandem: options.tandem.createTandem( 'resultsText' )
    } );

    // Comparison text showing impact of extra payments
    this.comparisonText = new Text( '', {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      fill: new Color( '#0a8a0a' ),
      maxWidth: CONTROL_PANEL_WIDTH - 40,
      tandem: options.tandem.createTandem( 'comparisonText' )
    } );

    // Arrange controls horizontally
    const controlsRow = new HBox( {
      children: [
        loanAmountControl,
        termYearsControl,
        interestRateControl,
        extraPaymentControl
      ],
      spacing: 20,
      align: 'top'
    } );

    // Control Panel Content
    const controlPanelContent = new VBox( {
      children: [
        controlTitleText,
        controlsRow,
        calculateButton,
        this.resultsText,
        this.comparisonText
      ],
      spacing: 12,
      align: 'center'
    } );

    // Position control panel at top, full width
    controlPanelContent.centerX = this.layoutBounds.centerX;
    controlPanelContent.top = AmortizationCalcConstants.SCREEN_VIEW_Y_MARGIN + 10;
    this.addChild( controlPanelContent );

    // Standard Scenario Graph Panel
    this.standardTitleText = new Text( 'Standard Payments', {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      fill: ACCENT_COLOR,
      tandem: options.tandem.createTandem( 'standardTitleText' )
    } );

    // Info box for standard scenario (will be updated with metrics)
    this.standardInfoBox = new VBox( {
      children: [ this.standardTitleText ],
      spacing: 5,
      align: 'center'
    } );

    this.standardGraphContainer = new Node();
    const standardGraphBackground = new Rectangle( 0, 0, 450, 300, {
      fill: 'white',
      stroke: '#ddd',
      lineWidth: 1
    } );
    this.standardGraphContainer.addChild( standardGraphBackground );

    const standardGraphContent = new VBox( {
      children: [ this.standardInfoBox, this.standardGraphContainer ],
      spacing: 8,
      align: 'center'
    } );

    // Position standard graph at bottom left
    standardGraphContent.left = AmortizationCalcConstants.SCREEN_VIEW_X_MARGIN + 20;
    standardGraphContent.bottom = this.layoutBounds.maxY - AmortizationCalcConstants.SCREEN_VIEW_Y_MARGIN - 60;
    this.addChild( standardGraphContent );

    // Extra Payment Scenario Graph Panel
    this.extraTitleText = new Text( 'With Extra Payments', {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      fill: new Color( '#0a8a0a' ),
      tandem: options.tandem.createTandem( 'extraTitleText' )
    } );

    // Info box for extra scenario (will be updated with metrics)
    this.extraInfoBox = new VBox( {
      children: [ this.extraTitleText ],
      spacing: 5,
      align: 'center'
    } );

    this.extraGraphContainer = new Node();
    const extraGraphBackground = new Rectangle( 0, 0, 450, 300, {
      fill: 'white',
      stroke: '#ddd',
      lineWidth: 1
    } );
    this.extraGraphContainer.addChild( extraGraphBackground );

    const extraGraphContent = new VBox( {
      children: [ this.extraInfoBox, this.extraGraphContainer ],
      spacing: 8,
      align: 'center'
    } );

    // Position extra graph at bottom right, aligned with standard graph
    extraGraphContent.left = standardGraphContent.right + 30;
    extraGraphContent.bottom = standardGraphContent.bottom;
    this.addChild( extraGraphContent );

    // Helper function to render animated area graph
    const renderAreaGraph = ( container: Node, schedule: any[], graphWidth: number, graphHeight: number ): void => {
      // Clear existing graph
      container.removeAllChildren();
      
      // Add background
      container.addChild( new Rectangle( 0, 0, graphWidth, graphHeight, {
        fill: 'white',
        stroke: '#ddd',
        lineWidth: 1
      } ) );

      if ( schedule.length === 0 ) return;

      // Calculate cumulative amounts
      let cumulativePrincipal = 0;
      let cumulativeInterest = 0;
      const dataPoints: { month: number; principal: number; interest: number }[] = [];
      
      schedule.forEach( ( entry, index ) => {
        cumulativePrincipal += entry.principal;
        cumulativeInterest += entry.interest;
        dataPoints.push( {
          month: index + 1,
          principal: cumulativePrincipal,
          interest: cumulativeInterest
        } );
      } );

      const maxMonth = dataPoints.length;
      const maxTotal = cumulativePrincipal + cumulativeInterest;
      const xScale = graphWidth / maxMonth;
      const yScale = graphHeight / maxTotal;
      const padding = 5;

      // Create interest area path (bottom, orange)
      const interestShape = new Shape();
      interestShape.moveTo( padding, graphHeight - padding );
      dataPoints.forEach( ( point, index ) => {
        const x = padding + point.month * xScale;
        const y = graphHeight - padding - point.interest * yScale;
        if ( index === 0 ) {
          interestShape.lineTo( x, y );
        } else {
          interestShape.lineTo( x, y );
        }
      } );
      interestShape.lineTo( padding + maxMonth * xScale, graphHeight - padding );
      interestShape.close();

      const interestPath = new Path( interestShape, {
        fill: new LinearGradient( 0, 0, 0, graphHeight )
          .addColorStop( 0, 'rgba(232, 116, 59, 0.8)' )
          .addColorStop( 1, 'rgba(232, 116, 59, 0.3)' ),
        stroke: '#e8743b',
        lineWidth: 2
      } );
      container.addChild( interestPath );

      // Create total (principal + interest) area path (top, green)
      const totalShape = new Shape();
      totalShape.moveTo( padding, graphHeight - padding );
      dataPoints.forEach( ( point, index ) => {
        const x = padding + point.month * xScale;
        const y = graphHeight - padding - ( point.principal + point.interest ) * yScale;
        if ( index === 0 ) {
          totalShape.lineTo( x, y );
        } else {
          totalShape.lineTo( x, y );
        }
      } );
      totalShape.lineTo( padding + maxMonth * xScale, graphHeight - padding );
      totalShape.close();

      const totalPath = new Path( totalShape, {
        fill: new LinearGradient( 0, 0, 0, graphHeight )
          .addColorStop( 0, 'rgba(25, 169, 121, 0.8)' )
          .addColorStop( 1, 'rgba(25, 169, 121, 0.3)' ),
        stroke: '#19a979',
        lineWidth: 2
      } );
      container.addChild( totalPath );

      // Add axis lines
      const xAxis = new Line( padding, graphHeight - padding, graphWidth - padding, graphHeight - padding, {
        stroke: '#333',
        lineWidth: 1
      } );
      const yAxis = new Line( padding, padding, padding, graphHeight - padding, {
        stroke: '#333',
        lineWidth: 1
      } );
      container.addChild( xAxis );
      container.addChild( yAxis );

      // Add labels
      const legendText = new Text( 'Green: Principal | Orange: Interest', {
        font: new PhetFont( 11 ),
        fill: '#666',
        centerX: graphWidth / 2,
        top: 10
      } );
      container.addChild( legendText );

      // Add final value labels
      const finalPrincipalText = new Text( `Principal: $${formatNumber( cumulativePrincipal )}`, {
        font: new PhetFont( { size: 12, weight: 'bold' } ),
        fill: '#19a979',
        right: graphWidth - padding - 5,
        top: padding + 25
      } );
      container.addChild( finalPrincipalText );

      const finalInterestText = new Text( `Interest: $${formatNumber( cumulativeInterest )}`, {
        font: new PhetFont( { size: 12, weight: 'bold' } ),
        fill: '#e8743b',
        right: graphWidth - padding - 5,
        top: padding + 45
      } );
      container.addChild( finalInterestText );

      const totalText = new Text( `Total: $${formatNumber( cumulativePrincipal + cumulativeInterest )}`, {
        font: new PhetFont( { size: 13, weight: 'bold' } ),
        fill: '#333',
        right: graphWidth - padding - 5,
        top: padding + 65
      } );
      container.addChild( totalText );
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

      // Update standard info box with compact metrics
      this.standardTitleText.string = 'Standard Payments';
      const standardMonthsText = new Text( `${schedule.length} months`, {
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
      
      this.standardInfoBox.removeAllChildren();
      this.standardInfoBox.addChild( this.standardTitleText );
      const standardMetrics = new HBox( {
        children: [ standardMonthsText, standardTotalText, standardInterestText ],
        spacing: 15
      } );
      this.standardInfoBox.addChild( standardMetrics );

      // Update comparison text if extra payments are being made
      if ( extraPayment > 0 && model.scheduleWithExtraArray.length > 0 ) {
        const monthsSaved = model.monthsSavedProperty.value;
        const interestSaved = model.interestSavedProperty.value;
        const yearsSaved = ( monthsSaved / 12 ).toFixed( 1 );
        this.comparisonText.string = `🎉 Discovery! By paying $${formatNumber( extraPayment )} extra each month:\n• Pay off ${yearsSaved} years earlier!\n• Save $${formatNumber( interestSaved )} in interest!`;
      } else {
        this.comparisonText.string = extraPayment === 0 ? '💡 Try adding an extra monthly payment to see the impact!' : '';
      }

      // Render standard scenario graph
      renderAreaGraph( this.standardGraphContainer, schedule, 450, 300 );

      // Render extra payment scenario graph
      const scheduleWithExtra = model.scheduleWithExtraArray.slice();
      if ( extraPayment > 0 && scheduleWithExtra.length > 0 ) {
        const totalPaidWithExtra = model.totalPaidWithExtraProperty.value;
        const totalInterestWithExtra = model.totalInterestWithExtraProperty.value;
        
        // Update extra info box with compact metrics
        this.extraTitleText.string = 'With Extra Payments';
        const extraMonthsText = new Text( `${scheduleWithExtra.length} months`, {
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
        
        this.extraInfoBox.removeAllChildren();
        this.extraInfoBox.addChild( this.extraTitleText );
        const extraMetrics = new HBox( {
          children: [ extraMonthsText, extraTotalText, extraInterestText ],
          spacing: 15
        } );
        this.extraInfoBox.addChild( extraMetrics );
        
        renderAreaGraph( this.extraGraphContainer, scheduleWithExtra, 450, 300 );
      } else {
        // Clear extra graph if no extra payment
        this.extraTitleText.string = 'With Extra Payments';
        this.extraInfoBox.removeAllChildren();
        this.extraInfoBox.addChild( this.extraTitleText );
        this.extraGraphContainer.removeAllChildren();
        this.extraGraphContainer.addChild( new Rectangle( 0, 0, 450, 300, {
          fill: 'white',
          stroke: '#ddd',
          lineWidth: 1
        } ) );
        const placeholderText = new Text( 'Add extra payment to see comparison', {
          font: LABEL_FONT,
          fill: '#999',
          centerX: 225,
          centerY: 150
        } );
        this.extraGraphContainer.addChild( placeholderText );
      }
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
      controlPanelContent.dispose();
      standardGraphContent.dispose();
      extraGraphContent.dispose();
      resetAllButton.dispose();
      loanAmountControl.dispose();
      termYearsControl.dispose();
      interestRateControl.dispose();
      calculateButton.dispose();
      extraPaymentControl.dispose();
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
