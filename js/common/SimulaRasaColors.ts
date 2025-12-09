// Copyright 2021-2025, University of Colorado Boulder

/**
 * Defines the colors for this sim.
 *
 * All simulations should have a Colors.js file, see https://github.com/phetsims/scenery-phet/issues/642.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Edit" mode.
 *
 * @author {{AUTHOR}}
 */

import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import simulaRasa from '../simulaRasa.js';

export default class SimulaRasaColors {

  private constructor() {
    // Not intended for instantiation.
  }

  public static readonly screenBackgroundColorProperty = new ProfileColorProperty(
    simulaRasa, 'screenBackgroundColor', {
    default: 'white'
  } );
}


simulaRasa.register( 'SimulaRasaColors', SimulaRasaColors );