// Copyright 2014-2021, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import simulaRasaColors from '../common/SimulaRasaColors.js';
import simulaRasa from '../simulaRasa.js';
import SimulaRasaModel from './model/SimulaRasaModel.js';
import SimulaRasaScreenView from './view/SimulaRasaScreenView.js';

class SimulaRasaScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: simulaRasaColors.screenBackgroundColorProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super(
      () => new SimulaRasaModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new SimulaRasaScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

simulaRasa.register( 'SimulaRasaScreen', SimulaRasaScreen );
export default SimulaRasaScreen;