//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'SimulaRasa' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Main constructor for SimulaRasaModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function SimulaRasaModel() {
  }

  return inherit( Object, SimulaRasaModel, {

    // Resets all model elements
    reset: function() {
    },

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      // Handle model animation here.
    }
  } );
} );