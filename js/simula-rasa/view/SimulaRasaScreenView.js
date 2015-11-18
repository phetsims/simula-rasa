// Copyright 2014-2015, University of Colorado Boulder

/**
 *
 * @author $AUTHOR$
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var simulaRasa = require( 'SIMULA_RASA/simulaRasa' );

  /**
   * @param {SimulaRasaModel} simulaRasaModel
   * @constructor
   */
  function SimulaRasaScreenView( simulaRasaModel ) {

    ScreenView.call( this );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        simulaRasaModel.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  simulaRasa.register( 'SimulaRasaScreenView', SimulaRasaScreenView );

  return inherit( ScreenView, SimulaRasaScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    }
  } );
} );