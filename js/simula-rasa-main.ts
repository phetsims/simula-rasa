// Copyright 2014-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author {{AUTHOR}}
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import SimulaRasaScreen from './simula-rasa/SimulaRasaScreen.js';
import SimulaRasaStrings from './SimulaRasaStrings.js';
import './common/SimulaRasaQueryParameters.js';
import { computeAmortization, renderAmortizationTable } from './amortizationTable';


// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded. See https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461
simLauncher.launch( () => {
  (() => {
  // choose a container; use an existing element if your HTML provides one, otherwise document.body
  const target = document.getElementById( 'sim-root' ) || document.body;

  // wrapper styles so it is visually separate from the sim
  const wrapper = document.createElement( 'div' );
  wrapper.id = 'amortization-wrapper';
  wrapper.style.padding = '12px';
  wrapper.style.maxWidth = '760px';
  wrapper.style.background = '#ffffff';
  wrapper.style.border = '1px solid #ddd';
  wrapper.style.margin = '12px auto';
  wrapper.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
  target.appendChild( wrapper );

  // default loan values
  const principal = 20000;
  const annualRate = 0.05; // 5% = 0.05
  const years = 5;

  // compute and render (amortizationTable.ts must export these functions)
  const schedule = computeAmortization( principal, annualRate, years );
  renderAmortizationTable( wrapper, schedule, 24 );
})();
  const titleStringProperty = SimulaRasaStrings[ 'simula-rasa' ].titleStringProperty;

  const screens = [
    new SimulaRasaScreen( { tandem: Tandem.ROOT.createTandem( 'simulaRasaScreen' ) } )
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