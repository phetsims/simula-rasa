//  Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Bar Magnet' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var SimulaRasaModel = require( 'SIMULA_RASA/simula-rasa/model/SimulaRasaModel' );
  var SimulaRasaScreenView = require( 'SIMULA_RASA/simula-rasa/view/SimulaRasaScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var simulaRasaSimString = require( 'string!SIMULA_RASA/simula-rasa.name' );

  /**
   * Creates the model and view for the SimulaRasaScreen
   * @constructor
   */
  function SimulaRasaScreen() {
    Screen.call( this, simulaRasaSimString, null /* no icon, single-screen sim */,
      function() { return new SimulaRasaModel(); },
      function( model ) { return new SimulaRasaScreenView( model ); },
      { backgroundColor: 'rgb(50,50,50)' }
    );
  }

  return inherit( Screen, SimulaRasaScreen );
} );