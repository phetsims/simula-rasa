// Copyright 2014-2025, University of Colorado Boulder

/**
 * AmortizationCalcModel is the model for the Amortization Calculator simulation.
 * It manages the loan parameters (amount, term, interest rate) and computes the amortization schedule.
 * All application logic and state are contained here, following PhET's MVC pattern.
 *
 * @author Luke Thompson
 */

import TModel from '../../../../joist/js/TModel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import amortizationCalc from '../../amortizationCalc.js';
import { computeAmortization, AmortizationEntry } from '../../amortizationTable.js';

type SelfOptions = {
  // No additional options needed for this model
};

type AmortizationCalcModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class AmortizationCalcModel implements TModel {

  // Loan parameters
  public readonly loanAmountProperty: NumberProperty;
  public readonly termYearsProperty: NumberProperty;
  public readonly interestRateProperty: NumberProperty;

  // Computed values
  public readonly monthlyPaymentProperty: Property<number>;
  public readonly totalInterestProperty: Property<number>;
  public readonly totalPaidProperty: Property<number>;

  // Amortization schedule
  public readonly scheduleArray: ObservableArray<AmortizationEntry>;

  public constructor( providedOptions: AmortizationCalcModelOptions ) {

    // Initialize loan parameters with default values
    this.loanAmountProperty = new NumberProperty( 200000, {
      tandem: providedOptions.tandem.createTandem( 'loanAmountProperty' ),
      phetioDocumentation: 'The principal loan amount in dollars'
    } );

    this.termYearsProperty = new NumberProperty( 30, {
      tandem: providedOptions.tandem.createTandem( 'termYearsProperty' ),
      phetioDocumentation: 'The loan term in years'
    } );

    this.interestRateProperty = new NumberProperty( 5, {
      tandem: providedOptions.tandem.createTandem( 'interestRateProperty' ),
      phetioDocumentation: 'The annual interest rate as a percentage'
    } );

    // Initialize computed properties
    this.monthlyPaymentProperty = new Property<number>( 0, {
      tandem: providedOptions.tandem.createTandem( 'monthlyPaymentProperty' ),
      phetioDocumentation: 'The monthly payment amount in dollars',
      phetioValueType: NumberIO
    } );

    this.totalInterestProperty = new Property<number>( 0, {
      tandem: providedOptions.tandem.createTandem( 'totalInterestProperty' ),
      phetioDocumentation: 'The total interest paid over the life of the loan',
      phetioValueType: NumberIO
    } );

    this.totalPaidProperty = new Property<number>( 0, {
      tandem: providedOptions.tandem.createTandem( 'totalPaidProperty' ),
      phetioDocumentation: 'The total amount paid (principal + interest)',
      phetioValueType: NumberIO
    } );

    // Initialize amortization schedule as an observable array
    this.scheduleArray = createObservableArray<AmortizationEntry>();

    // Compute initial schedule
    this.computeSchedule();
  }

  /**
   * Computes the amortization schedule and updates all derived properties.
   * Called whenever loan parameters change.
   */
  public computeSchedule(): void {
    const principal = this.loanAmountProperty.value;
    const years = this.termYearsProperty.value;
    const annualRate = this.interestRateProperty.value / 100;

    // Validate inputs
    if ( principal <= 0 || years <= 0 || annualRate < 0 ) {
      // Clear schedule and reset computed values for invalid inputs
      this.scheduleArray.clear();
      this.monthlyPaymentProperty.value = 0;
      this.totalInterestProperty.value = 0;
      this.totalPaidProperty.value = 0;
      return;
    }

    // Compute the amortization schedule using utility function
    const schedule = computeAmortization( principal, annualRate, years );

    // Update the observable array
    this.scheduleArray.clear();
    schedule.forEach( entry => this.scheduleArray.push( entry ) );

    // Update computed properties
    const monthlyPayment = schedule.length > 0 ? schedule[ 0 ].payment : 0;
    const totalInterest = schedule.reduce( ( sum, entry ) => sum + entry.interest, 0 );
    const numberOfPayments = years * 12;
    const totalPaid = monthlyPayment * numberOfPayments;

    this.monthlyPaymentProperty.value = monthlyPayment;
    this.totalInterestProperty.value = totalInterest;
    this.totalPaidProperty.value = totalPaid;
  }

  /**
   * Resets the model to its initial state.
   */
  public reset(): void {
    this.loanAmountProperty.reset();
    this.termYearsProperty.reset();
    this.interestRateProperty.reset();
    this.computeSchedule();
  }

  /**
   * Steps the model forward in time.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    // This simulation is not time-dependent, so step is a no-op
  }
}

amortizationCalc.register( 'AmortizationCalcModel', AmortizationCalcModel );
