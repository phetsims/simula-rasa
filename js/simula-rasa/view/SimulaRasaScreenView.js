//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'SimulaRasa' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );

  /**
   * Constructor for the SimulaRasaView
   * @param {SimulaRasaModel} simulaRasaModel the model for the entire screen
   * @constructor
   */
  function SimulaRasaView( simulaRasaModel ) {

    ScreenView.call( this );

    // Create and add the Reset All Button in the bottom right
    //TODO: Wire up the reset all button to the model's reset function
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        simulaRasaModel.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, SimulaRasaView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );