// Copyright 2014-2021, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SimulaRasaConstants from '../../common/SimulaRasaConstants.js';
import simulaRasa from '../../simulaRasa.js';
import SimulaRasaModel from '../model/SimulaRasaModel.js';

class SimulaRasaScreenView extends ScreenView {

  /**
   * @param {SimulaRasaModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    assert && assert( model instanceof SimulaRasaModel, 'invalid model' );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - SimulaRasaConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - SimulaRasaConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

simulaRasa.register( 'SimulaRasaScreenView', SimulaRasaScreenView );
export default SimulaRasaScreenView;