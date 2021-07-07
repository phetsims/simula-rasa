// Copyright 2020-2021, University of Colorado Boulder

/**
 * SimulaRasaColorProfile defines the color profile for this sim.
 * All simulations are required to have a ColorProfile, even if they only have the 'default' profile.
 * See https://github.com/phetsims/scenery-phet/issues/642.
 *
 * @author {{AUTHOR}}
 */

import ColorProfile from '../../../scenery-phet/js/ColorProfile.js';
import simulaRasa from '../simulaRasa.js';

const SimulaRasaColorProfile = new ColorProfile( [ 'default' ], {

  // Background color that for screens in this sim
  screenBackgroundColor: {
    default: 'white'
  }
} );

simulaRasa.register( 'SimulaRasaColorProfile', SimulaRasaColorProfile );
export default SimulaRasaColorProfile;