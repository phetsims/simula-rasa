// Copyright 2014-2025, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import DOM from '../../../../scenery/js/nodes/DOM.js';
import { computeAmortization, renderAmortizationTable, formatNumber } from '../../amortizationTable.js';
import AmortizationCalcConstants from '../../common/AmortizationCalcConstants.js';
import amortizationCalc from '../../amortizationCalc.js';
import AmortizationCalcModel from '../model/AmortizationCalcModel.js';

type SelfOptions = {
 //TODO add options that are specific to AmortizationCalcScreenView here
};

type AmortizationCalcScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class AmortizationCalcScreenView extends ScreenView {

  public constructor( model: AmortizationCalcModel, providedOptions: AmortizationCalcScreenViewOptions ) {

    const options = optionize<AmortizationCalcScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( options );

    // Debug: log layout bounds to help diagnose visibility issues in the browser console
    console.log( 'AmortizationCalcScreenView constructed, layoutBounds:', this.layoutBounds );

    // Test: Add a simple text node to verify rendering works
    const testText = new Text( 'Test', {
      left: 20,
      top: 40,
      fontSize: 20,
      fill: '#000000'
    } );
    this.addChild( testText );

      // Render a UI (inputs + results) and amortization table using DOM elements wrapped by Scenery DOM nodes
      try {

        // Outer container for the whole UI block
        const uiWrapper = document.createElement( 'div' );
        uiWrapper.style.width = '800px';
        uiWrapper.style.maxWidth = '90vw';
        uiWrapper.style.background = '#ffffff';
        uiWrapper.style.padding = '8px';
        uiWrapper.style.border = '1px solid #ddd';
        uiWrapper.style.borderRadius = '4px';
        uiWrapper.style.boxSizing = 'border-box';
        uiWrapper.style.pointerEvents = 'auto';
        uiWrapper.tabIndex = 0;
        uiWrapper.style.position = 'relative';
        uiWrapper.style.zIndex = '1000';
        uiWrapper.style.display = 'flex';
        uiWrapper.style.gap = '16px';

        // Prevent pointer events from bubbling up to Scenery
        const stop = (e: Event) => { e.stopPropagation(); };
        ['pointerdown','pointermove','pointerup','mousedown','mousemove','mouseup','click'].forEach( ev => uiWrapper.addEventListener( ev, stop ) );

        // LEFT COLUMN: Form and Results only
        const leftColumn = document.createElement( 'div' );
        leftColumn.style.flex = '0 0 320px';
        leftColumn.style.display = 'flex';
        leftColumn.style.flexDirection = 'column';
        leftColumn.style.gap = '8px';

        // Build form area
        const form = document.createElement( 'form' );
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '8px';

        const makeField = (labelText: string, inputType = 'number', inputValue = '') => {
          const wrap = document.createElement( 'div' );
          wrap.style.display = 'flex';
          wrap.style.flexDirection = 'column';
          const label = document.createElement( 'label' );
          label.textContent = labelText;
          label.style.fontSize = '12px';
          label.style.marginBottom = '2px';
          const input = document.createElement( 'input' );
          input.type = inputType;
          input.value = inputValue;
          input.style.padding = '6px 8px';
          input.style.boxSizing = 'border-box';
          input.style.fontSize = '14px';
          input.addEventListener( 'keydown', stop );
          wrap.appendChild( label );
          wrap.appendChild( input );
          return { wrap, input } as any;
        };

        const amountField = makeField( 'Loan amount', 'number', '200000' );
        const termField = makeField( 'Term (years)', 'number', '30' );
        const rateField = makeField( 'Interest rate (annual %)', 'number', '5' );

        form.appendChild( amountField.wrap );
        form.appendChild( termField.wrap );
        form.appendChild( rateField.wrap );

        const goButton = document.createElement( 'button' );
        goButton.type = 'button';
        goButton.textContent = 'Calculate';
        goButton.style.padding = '8px 12px';
        goButton.style.fontSize = '14px';
        goButton.addEventListener( 'click', stop );
        form.appendChild( goButton );

        // Results display
        const resultsDiv = document.createElement( 'div' );
        resultsDiv.style.fontSize = '12px';
        resultsDiv.style.lineHeight = '1.6';
        resultsDiv.style.padding = '8px';
        resultsDiv.style.backgroundColor = '#f5f5f5';
        resultsDiv.style.borderRadius = '4px';

        leftColumn.appendChild( form );
        leftColumn.appendChild( resultsDiv );

        // MIDDLE COLUMN: Table
        const middleColumn = document.createElement( 'div' );
        middleColumn.style.flex = '1';
        middleColumn.style.minWidth = '0';
        middleColumn.style.display = 'flex';
        middleColumn.style.flexDirection = 'column';

        const tableContainer = document.createElement( 'div' );
        tableContainer.style.width = '100%';
        tableContainer.style.maxHeight = '400px';
        tableContainer.style.overflow = 'auto';
        tableContainer.style.pointerEvents = 'auto';
        tableContainer.style.userSelect = 'text';

        middleColumn.appendChild( tableContainer );

        uiWrapper.appendChild( leftColumn );
        uiWrapper.appendChild( middleColumn );

        const uiNode = new DOM( uiWrapper, { left: 20, top: 80, tandem: options.tandem.createTandem( 'amortizationUI' ) } );
        this.addChild( uiNode );

        // Helper to compute results and render table
        const computeAndRender = () => {
          const principal = parseFloat( (amountField.input as HTMLInputElement).value ) || 0;
          const years = parseFloat( (termField.input as HTMLInputElement).value ) || 0;
          const annualPercent = parseFloat( (rateField.input as HTMLInputElement).value ) || 0;
          const annualRate = annualPercent / 100;

          if ( principal <= 0 || years <= 0 ) {
            resultsDiv.innerHTML = '<em>Please enter a positive loan amount and term.</em>';
            tableContainer.innerHTML = '';
            return;
          }

          const schedule = computeAmortization( principal, annualRate, years );
          const monthlyPayment = schedule.length ? schedule[0].payment : 0;
          const numberOfPayments = years * 12;
          const totalPaid = monthlyPayment * numberOfPayments;
          const totalInterest = schedule.reduce( (acc, p) => acc + p.interest, 0 );

          resultsDiv.innerHTML = `Monthly payment: <strong>$${formatNumber(monthlyPayment)}</strong><br/>Total interest: <strong>$${formatNumber(totalInterest)}</strong><br/>Total paid: <strong>$${formatNumber(totalPaid)}</strong>`;

          // clear and render full table
          tableContainer.innerHTML = '';
          renderAmortizationTable( tableContainer, schedule );
        };

        // initial render
        computeAndRender();

        // wire calculate button and Enter key on form inputs
        goButton.addEventListener( 'click', (e) => { stop(e); computeAndRender(); } );
        form.addEventListener( 'submit', (e) => { e.preventDefault(); stop(e); computeAndRender(); } );

      }
      catch( e ) {
        console.error( 'Failed to render amortization UI inside Scenery DOM node', e );
      }

    // Add reset button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - AmortizationCalcConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - AmortizationCalcConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //TODO
  }
}

amortizationCalc.register( 'AmortizationCalcScreenView', AmortizationCalcScreenView );
