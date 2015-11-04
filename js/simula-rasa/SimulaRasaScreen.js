// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Your Name (Your Affiliation)
 */
define( function( require ) {
  'use strict';

  // modules
  var SimulaRasaModel = require( 'SIMULA_RASA/simula-rasa/model/SimulaRasaModel' );
  var SimulaRasaScreenView = require( 'SIMULA_RASA/simula-rasa/view/SimulaRasaScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var simulaRasaTitleString = require( 'string!SIMULA_RASA/simula-rasa.title' );

  /**
   * @constructor
   */
  function SimulaRasaScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, simulaRasaTitleString, icon,
      function() { return new SimulaRasaModel(); },
      function( model ) { return new SimulaRasaScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, SimulaRasaScreen );
} );