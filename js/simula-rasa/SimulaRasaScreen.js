// Copyright 2014-2015, University of Colorado Boulder

/**
 *
 * @author $AUTHOR$
 */
define( function( require ) {
  'use strict';

  // modules
  var SimulaRasaModel = require( 'SIMULA_RASA/simula-rasa/model/SimulaRasaModel' );
  var SimulaRasaScreenView = require( 'SIMULA_RASA/simula-rasa/view/SimulaRasaScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var simulaRasa = require( 'SIMULA_RASA/simulaRasa' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  /**
   * @constructor
   */
  function SimulaRasaScreen() {

    var options = {
      backgroundColorProperty: new Property( Color.toColor( 'white' ) )
    };

    Screen.call( this,
      function() { return new SimulaRasaModel(); },
      function( model ) { return new SimulaRasaScreenView( model ); },
      options
    );
  }

  simulaRasa.register( 'SimulaRasaScreen', SimulaRasaScreen );

  return inherit( Screen, SimulaRasaScreen );
} );