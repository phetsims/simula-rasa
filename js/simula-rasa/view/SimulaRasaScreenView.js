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
    this.addChild( new ResetAllButton( { right: this.layoutBounds.maxX - 10, bottom: this.layoutBounds.maxY - 10} ) );
  }

  return inherit( ScreenView, SimulaRasaView );
} );