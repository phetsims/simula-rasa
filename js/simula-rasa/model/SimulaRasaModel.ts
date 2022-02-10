// Copyright 2014-2021, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import simulaRasa from '../../simulaRasa.js';

type SimulaRasaModelOptions = {
  tandem?: Tandem
};

class SimulaRasaModel {

  /**
   * @param providedOptions
   */
  constructor( providedOptions: SimulaRasaModelOptions ) {
    //TODO
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   * @public
   */
  step( dt: number ) {
    //TODO
  }
}

simulaRasa.register( 'SimulaRasaModel', SimulaRasaModel );
export default SimulaRasaModel;