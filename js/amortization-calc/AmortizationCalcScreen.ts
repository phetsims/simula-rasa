// Copyright 2014-2024, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import AmortizationCalcColors from '../common/AmortizationCalcColors.js';
import amortizationCalc from '../amortizationCalc.js';
import AmortizationCalcStrings from '../AmortizationCalcStrings.js';
import AmortizationCalcModel from './model/AmortizationCalcModel.js';
import AmortizationCalcScreenView from './view/AmortizationCalcScreenView.js';

type SelfOptions = {
  //TODO add options that are specific to AmortizationCalcScreen here
};

type AmortizationCalcScreenOptions = SelfOptions & ScreenOptions;

export default class AmortizationCalcScreen extends Screen<AmortizationCalcModel, AmortizationCalcScreenView> {

  public constructor( providedOptions: AmortizationCalcScreenOptions ) {

    const options = optionize<AmortizationCalcScreenOptions, SelfOptions, ScreenOptions>()( {
      name: AmortizationCalcStrings.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: AmortizationCalcColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new AmortizationCalcModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new AmortizationCalcScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

amortizationCalc.register( 'AmortizationCalcScreen', AmortizationCalcScreen );
