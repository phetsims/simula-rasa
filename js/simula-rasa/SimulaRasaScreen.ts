// Copyright 2014-2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import SimulaRasaColors from '../common/SimulaRasaColors.js';
import simulaRasa from '../simulaRasa.js';
import SimulaRasaModel from './model/SimulaRasaModel.js';
import SimulaRasaScreenView from './view/SimulaRasaScreenView.js';

type SimulaRasaScreenOptions = {
  tandem: Tandem
};

class SimulaRasaScreen extends Screen<SimulaRasaModel, SimulaRasaScreenView> {

  constructor( providedOptions: SimulaRasaScreenOptions ) {

    const options = merge( {

      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: SimulaRasaColors.screenBackgroundColorProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super(
      () => new SimulaRasaModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new SimulaRasaScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

simulaRasa.register( 'SimulaRasaScreen', SimulaRasaScreen );
export default SimulaRasaScreen;