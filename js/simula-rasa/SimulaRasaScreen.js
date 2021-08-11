// Copyright 2014-2021, University of Colorado Boulder

/**
 * @author {{AUTHOR}}
 */

import Screen from '../../../joist/js/Screen.js';
import simulaRasaColors1 from '../common/simulaRasaColors1.js';
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
      backgroundColorProperty: simulaRasaColors1.screenBackgroundColorProperty,
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