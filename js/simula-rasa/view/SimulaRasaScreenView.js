// Copyright 2014-2019, University of Colorado Boulder

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
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super();

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
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