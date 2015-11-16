// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author $AUTHOR$
 */
define( function( require ) {
  'use strict';

  // modules
  var SimulaRasaScreen = require( 'SIMULA_RASA/simula-rasa/SimulaRasaScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simulaRasaTitleString = require( 'string!SIMULA_RASA/simula-rasa.title' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simulaRasaTitleString, [ new SimulaRasaScreen() ], simOptions );
    sim.start();
  } );
} );