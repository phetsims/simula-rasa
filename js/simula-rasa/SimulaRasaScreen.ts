// Copyright 2014-2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import SimulaRasaColors from '../common/SimulaRasaColors.js';
import simulaRasa from '../simulaRasa.js';
import SimulaRasaModel from './model/SimulaRasaModel.js';
import SimulaRasaScreenView from './view/SimulaRasaScreenView.js';
import { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';

type SimulaRasaScreenSelfOptions = Required<Pick<PhetioObjectOptions, 'tandem'>>;
type SimulaRasaScreenOptions = SimulaRasaScreenSelfOptions & ScreenOptions;

class SimulaRasaScreen extends Screen<SimulaRasaModel, SimulaRasaScreenView> {

  constructor( providedOptions: SimulaRasaScreenOptions ) {

    const options = optionize<SimulaRasaScreenOptions, SimulaRasaScreenSelfOptions, ScreenOptions, 'tandem'>( {

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