// Copyright 2020-2021, University of Colorado Boulder

/**
 * simulaRasaColorProfile defines the color profile for this sim.
 * All simulations are required to have a color file, even if they only have the 'default' profile.
 * TODO: https://github.com/phetsims/scenery-phet/issues/515 decide the name for this color file
 * See https://github.com/phetsims/scenery-phet/issues/642.
 *
 * @author {{AUTHOR}}
 */

import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import simulaRasa from '../simulaRasa.js';

const simulaRasaColorProfile = {

  // Background color that for screens in this sim
  screenBackgroundColorProperty: new ProfileColorProperty( 'background', {
    default: 'white'
  } )
};

simulaRasa.register( 'simulaRasaColorProfile', simulaRasaColorProfile );
export default simulaRasaColorProfile;