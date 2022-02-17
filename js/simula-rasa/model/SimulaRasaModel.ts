// Copyright 2014-2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import simulaRasa from '../../simulaRasa.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';

type SimulaRasaModelOptions = Required<Pick<PhetioObjectOptions, 'tandem'>>;

class SimulaRasaModel {

  constructor( providedOptions: SimulaRasaModelOptions ) {
    //TODO
  }

  /**
   * Resets the model.
   */
  reset(): void {
    //TODO
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  step( dt: number ): void {
    //TODO
  }
}

simulaRasa.register( 'SimulaRasaModel', SimulaRasaModel );
export default SimulaRasaModel;