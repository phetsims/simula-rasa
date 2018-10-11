// Copyright 2014-2018, University of Colorado Boulder

/**
 * @author {{AUTHOR}}
 */
define( function( require ) {
  'use strict';

  // modules
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var simulaRasa = require( 'SIMULA_RASA/simulaRasa' );

  class SimulaRasaScreenView extends ScreenView {

    /**
     * @param {SimulaRasaModel} model
     */
    constructor( model ) {

      super();

      var resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10
      } );
      this.addChild( resetAllButton );
    }

    // @public
    step( dt ) {
      //TODO Handle view animation here.
    }
  }

  return simulaRasa.register( 'SimulaRasaScreenView', SimulaRasaScreenView );
} );