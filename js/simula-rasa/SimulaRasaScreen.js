// Copyright 2014-2018, University of Colorado Boulder

/**
 * @author {{AUTHOR}}
 */
define( require => {
  'use strict';

  // modules
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var simulaRasa = require( 'SIMULA_RASA/simulaRasa' );
  var SimulaRasaModel = require( 'SIMULA_RASA/simula-rasa/model/SimulaRasaModel' );
  var SimulaRasaScreenView = require( 'SIMULA_RASA/simula-rasa/view/SimulaRasaScreenView' );

  class SimulaRasaScreen extends Screen {

    constructor() {

      var options = {
        backgroundColorProperty: new Property( 'white' )
      };

      super(
        () => new SimulaRasaModel(),
        ( model ) => new SimulaRasaScreenView( model ),
        options
      );
    }
  }

  return simulaRasa.register( 'SimulaRasaScreen', SimulaRasaScreen );
} );