//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'SimulaRasa' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Main constructor for SimulaRasaModel, which creates the bar magnet..
   * @constructor
   */
  function SimulaRasaModel() {
  }

  return inherit( Object, SimulaRasaModel, {

    // Resets all model elements
    reset: function() {
    },

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function() {
      // Handle model animation here.
    }
  } );
} );