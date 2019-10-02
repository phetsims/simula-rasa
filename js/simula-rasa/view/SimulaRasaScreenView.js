// Copyright 2014-2019, University of Colorado Boulder

/**
 * @author {{AUTHOR}}
 */
define( require => {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const simulaRasa = require( 'SIMULA_RASA/simulaRasa' );
  const SimulaRasaConstants = require( 'SIMULA_RASA/common/SimulaRasaConstants' );

  class SimulaRasaScreenView extends ScreenView {

    /**
     * @param {SimulaRasaModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super();

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput(); // cancel interactions that may be in progress
          model.reset();
          this.reset();
        },
        right: this.layoutBounds.maxX - SimulaRasaConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - SimulaRasaConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }

    /**
     * Resets the view.
     * @public
     */
    reset() {
      //TODO
    }

    /**
     * Steps the view.
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      //TODO
    }
  }

  return simulaRasa.register( 'SimulaRasaScreenView', SimulaRasaScreenView );
} );