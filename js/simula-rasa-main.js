// Copyright 2014-2018, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author {{AUTHOR}}
 */
define( require => {
  'use strict';

  // modules
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var SimulaRasaScreen = require( 'SIMULA_RASA/simula-rasa/SimulaRasaScreen' );

  // strings
  var simulaRasaTitleString = require( 'string!SIMULA_RASA/simula-rasa.title' );

  var simOptions = {
    credits: {
      //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      soundDesign: '',
      thanks: ''
    }
  };

  SimLauncher.launch( () => {
    var sim = new Sim( simulaRasaTitleString, [ new SimulaRasaScreen() ], simOptions );
    sim.start();
  } );
} );