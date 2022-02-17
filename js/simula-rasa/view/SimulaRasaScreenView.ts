// Copyright 2014-2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SimulaRasaConstants from '../../common/SimulaRasaConstants.js';
import simulaRasa from '../../simulaRasa.js';
import SimulaRasaModel from '../model/SimulaRasaModel.js';
import optionize from '../../../../phet-core/js/optionize.js';

class SimulaRasaScreenView extends ScreenView {

  constructor( model: SimulaRasaModel, providedOptions: ScreenViewOptions ) {

    const options = optionize<ScreenViewOptions, {}, ScreenViewOptions, 'tandem'>( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions );

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
   */
  reset(): void {
    //TODO
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  step( dt: number ): void {
    //TODO
  }
}

simulaRasa.register( 'SimulaRasaScreenView', SimulaRasaScreenView );
export default SimulaRasaScreenView;