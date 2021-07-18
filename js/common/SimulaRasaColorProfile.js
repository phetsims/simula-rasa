// Copyright 2020-2021, University of Colorado Boulder

/**
 * SimulaRasaColorProfile defines the color profile for this sim.
 * All simulations are required to have a ColorProfile, even if they only have the 'default' profile.
 * See https://github.com/phetsims/scenery-phet/issues/642.
 *
 * @author {{AUTHOR}}
 */

import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import simulaRasa from '../simulaRasa.js';

const SimulaRasaColorProfile = {

  // Background color that for screens in this sim
  screenBackgroundColorProperty: new ProfileColorProperty( 'background', {
    default: 'white'
  } )
};

simulaRasa.register( 'SimulaRasaColorProfile', SimulaRasaColorProfile );
export default SimulaRasaColorProfile;