// Copyright 2014-2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import simulaRasa from '../../simulaRasa.js';
import { RequiredTandem } from '../../../../tandem/js/PhetioObject.js';

type SimulaRasaModelOptions = RequiredTandem;

class SimulaRasaModel {

  constructor( providedOptions: SimulaRasaModelOptions ) {
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