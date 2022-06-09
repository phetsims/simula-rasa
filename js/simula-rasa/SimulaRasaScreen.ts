// Copyright 2014-2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import SimulaRasaColors from '../common/SimulaRasaColors.js';
import simulaRasa from '../simulaRasa.js';
import SimulaRasaModel from './model/SimulaRasaModel.js';
import SimulaRasaScreenView from './view/SimulaRasaScreenView.js';

type SelfOptions = {
  //TODO add options that are specific to SimulaRasaScreen here
};

type SimulaRasaScreenOptions = SelfOptions & ScreenOptions;

class SimulaRasaScreen extends Screen<SimulaRasaModel, SimulaRasaScreenView> {

  public constructor( providedOptions: SimulaRasaScreenOptions ) {

    const options = optionize<SimulaRasaScreenOptions, SelfOptions, ScreenOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: SimulaRasaColors.screenBackgroundColorProperty
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