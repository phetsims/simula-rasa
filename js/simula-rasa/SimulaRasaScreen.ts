// Copyright 2014-2026, University of Colorado Boulder

/**
 * NOTE Describe this class and its responsibilities
 *
 * @author {{AUTHOR}}
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import SimulaRasaColors from '../common/SimulaRasaColors.js';
import SimulaRasaFluent from '../SimulaRasaFluent.js';
import SimulaRasaModel from './model/SimulaRasaModel.js';
import SimulaRasaScreenView from './view/SimulaRasaScreenView.js';

type SelfOptions = {
  //NOTE add options that are specific to SimulaRasaScreen here
};

type SimulaRasaScreenOptions = SelfOptions & ScreenOptions;

export default class SimulaRasaScreen extends Screen<SimulaRasaModel, SimulaRasaScreenView> {

  public constructor( providedOptions: SimulaRasaScreenOptions ) {

    const options = optionize<SimulaRasaScreenOptions, SelfOptions, ScreenOptions>()( {
      name: SimulaRasaFluent.screen.nameStringProperty,

      //NOTE add default values for optional SelfOptions here

      //NOTE add default values for optional ScreenOptions here
      backgroundColorProperty: SimulaRasaColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new SimulaRasaModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new SimulaRasaScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}
