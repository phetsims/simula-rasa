// Copyright 2014-2024, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import amortizationCalc from '../../amortizationCalc.js';

type SelfOptions = {
  //TODO add options that are specific to AmortizationCalcModel here
};

type AmortizationCalcModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class AmortizationCalcModel implements TModel {

  public constructor( providedOptions: AmortizationCalcModelOptions ) {
    //TODO
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}

amortizationCalc.register( 'AmortizationCalcModel', AmortizationCalcModel );
