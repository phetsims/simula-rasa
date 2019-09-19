// Copyright 2014-2019, University of Colorado Boulder

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

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        backgroundColorProperty: new Property( 'white' ),
        tandem: tandem
      };

      super(
        () => new SimulaRasaModel( tandem.createTandem( 'model' ) ),
        model => new SimulaRasaScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return simulaRasa.register( 'SimulaRasaScreen', SimulaRasaScreen );
} );