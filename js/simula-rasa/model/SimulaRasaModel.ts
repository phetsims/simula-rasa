// Copyright 2014-2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import simulaRasa from '../../simulaRasa.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  //TODO add options that are specific to SimulaRasaModel here
};

type SimulaRasaModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class SimulaRasaModel {

  public constructor( providedOptions: SimulaRasaModelOptions ) {
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

simulaRasa.register( 'SimulaRasaModel', SimulaRasaModel );
export default SimulaRasaModel;