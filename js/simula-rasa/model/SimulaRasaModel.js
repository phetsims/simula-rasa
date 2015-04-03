//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Your Name (Your Affiliation)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @constructor
   */
  function SimulaRasaModel() {

    PropertySet.call( this, {} );
  }

  return inherit( PropertySet, SimulaRasaModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      // Handle model animation here.
    }
  } );
} );