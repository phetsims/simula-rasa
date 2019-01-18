// Copyright 2014-2018, University of Colorado Boulder

/**
 * @author {{AUTHOR}}
 */
define( function( require ) {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const simulaRasa = require( 'SIMULA_RASA/simulaRasa' );

  class SimulaRasaScreenView extends ScreenView {

    /**
     * @param {SimulaRasaModel} model
     */
    constructor( model ) {

      super();

      const resetAllButton = new ResetAllButton( {
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