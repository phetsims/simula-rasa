// Copyright 2019-2022, University of Colorado Boulder

/**
 * SimulaRasaConstants is the set of constants used throughout the 'Simula Rasa' simulation.
 *
 * @author {{AUTHOR}}
 */

import simulaRasa from '../simulaRasa.js';

export default class SimulaRasaConstants {

  private constructor() {
    // Not intended for instantiation.
  }

  public static readonly SCREEN_VIEW_X_MARGIN = 15;
  public static readonly SCREEN_VIEW_Y_MARGIN = 15;
}

simulaRasa.register( 'SimulaRasaConstants', SimulaRasaConstants );