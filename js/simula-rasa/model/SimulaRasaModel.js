// Copyright 2014-2019, University of Colorado Boulder

/**
 * @author {{AUTHOR}}
 */
define( require => {
  'use strict';

  // modules
  const simulaRasa = require( 'SIMULA_RASA/simulaRasa' );

  /**
   * @constructor
   */
  class SimulaRasaModel  {

    constructor() {
      //TODO
    }

    // @public resets the model
    reset() {
      //TODO Reset things here.
    }

    // @public
    step( dt ) {
      //TODO Handle model animation here.
    }
  }

  return simulaRasa.register( 'SimulaRasaModel', SimulaRasaModel );
} );