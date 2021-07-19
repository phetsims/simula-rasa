// Copyright 2014-2020, University of Colorado Boulder

/**
 * @author {{AUTHOR}}
 */

import Screen from '../../../joist/js/Screen.js';
import simulaRasaColorProfie from '../common/simulaRasaColorProfie.js';
import simulaRasa from '../simulaRasa.js';
import SimulaRasaModel from './model/SimulaRasaModel.js';
import SimulaRasaScreenView from './view/SimulaRasaScreenView.js';

class SimulaRasaScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: simulaRasaColorProfie.screenBackgroundColorProperty,
      tandem: tandem
    };

    super(
      () => new SimulaRasaModel( tandem.createTandem( 'model' ) ),
      model => new SimulaRasaScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

simulaRasa.register( 'SimulaRasaScreen', SimulaRasaScreen );
export default SimulaRasaScreen;