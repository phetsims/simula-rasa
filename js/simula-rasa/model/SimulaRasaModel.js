// Copyright 2014-2015, University of Colorado Boulder

/**
 *
 * @author $AUTHOR$
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var simulaRasa = require( 'SIMULA_RASA/simulaRasa' );

  /**
   * @constructor
   */
  function SimulaRasaModel() {

    PropertySet.call( this, {
      //TODO
    } );
  }

  simulaRasa.register( 'SimulaRasaModel', SimulaRasaModel );

  return inherit( PropertySet, SimulaRasaModel, {

    //TODO Called by the animation loop. Optional, so if your model has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle model animation here.
    }
  } );
} );