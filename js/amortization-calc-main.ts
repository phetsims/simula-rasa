// Copyright 2014-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Luke Thorne
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import AmortizationCalcScreen from './amortization-calc/AmortizationCalcScreen.js';
import AmortizationCalcStrings from './AmortizationCalcStrings.js';
import './common/AmortizationCalcQueryParameters.js';


// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded. See https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461
simLauncher.launch( () => {
  const titleStringProperty = AmortizationCalcStrings[ 'amortization-calc' ].titleStringProperty;

  const screens = [
    new AmortizationCalcScreen( { tandem: Tandem.ROOT.createTandem( 'amortizationCalcScreen' ) } )
  ];

  const options: SimOptions = {

    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
    credits: {
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      contributors: '',
      qualityAssurance: '',
      graphicArts: '',
      soundDesign: '',
      thanks: ''
    }
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );