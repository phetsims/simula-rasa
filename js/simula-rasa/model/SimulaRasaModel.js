// Copyright 2014-2020, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import merge from '../../../../chipper/dist/phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import simulaRasa from '../../simulaRasa.js';

class SimulaRasaModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

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