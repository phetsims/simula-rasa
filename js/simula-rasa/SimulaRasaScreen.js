// Copyright 2014-2018, University of Colorado Boulder

/**
 * @author {{AUTHOR}}
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const simulaRasa = require( 'SIMULA_RASA/simulaRasa' );
  const SimulaRasaModel = require( 'SIMULA_RASA/simula-rasa/model/SimulaRasaModel' );
  const SimulaRasaScreenView = require( 'SIMULA_RASA/simula-rasa/view/SimulaRasaScreenView' );

  class SimulaRasaScreen extends Screen {

    constructor() {

      const options = {
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