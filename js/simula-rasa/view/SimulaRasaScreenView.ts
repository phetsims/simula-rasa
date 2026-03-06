// Copyright 2014-2025, University of Colorado Boulder

/**
 * NOTE Describe this class and its responsibilities. https://github.com/phetsims/{{REPO}}/issues/1
 *
 * @author {{AUTHOR}}
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import SimulaRasaConstants from '../../common/SimulaRasaConstants.js';
import simulaRasa from '../../simulaRasa.js';
import SimulaRasaModel from '../model/SimulaRasaModel.js';

type SelfOptions = {
 //NOTE add options that are specific to SimulaRasaScreenView here. https://github.com/phetsims/{{REPO}}/issues/1
};

type SimulaRasaScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SimulaRasaScreenView extends ScreenView {

  public constructor( model: SimulaRasaModel, providedOptions: SimulaRasaScreenViewOptions ) {

    const options = optionize<SimulaRasaScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      //NOTE add default values for optional SelfOptions here. https://github.com/phetsims/{{REPO}}/issues/1

      //NOTE add default values for optional ScreenViewOptions here. https://github.com/phetsims/{{REPO}}/issues/1
    }, providedOptions );

    super( options );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
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
  public reset(): void {
    //NOTE. https://github.com/phetsims/{{REPO}}/issues/1
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //NOTE. https://github.com/phetsims/{{REPO}}/issues/1
  }
}

simulaRasa.register( 'SimulaRasaScreenView', SimulaRasaScreenView );