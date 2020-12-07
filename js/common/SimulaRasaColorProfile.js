// Copyright 2020, University of Colorado Boulder

/**
 * SimulaRasaColorProfile defines the color profile for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
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