// Copyright 2014-2020, University of Colorado Boulder

/**
 * @author {{AUTHOR}}
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import simulaRasa from '../../simulaRasa.js';

class SimulaRasaModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
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
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

simulaRasa.register( 'SimulaRasaModel', SimulaRasaModel );
export default SimulaRasaModel;