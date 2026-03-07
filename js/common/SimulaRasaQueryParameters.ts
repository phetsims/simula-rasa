// Copyright 2022-2026, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author {{AUTHOR}}
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import simulaRasa from '../simulaRasa.js';

const SimulaRasaQueryParameters = QueryStringMachine.getAll( {
  //NOTE add schemas for query parameters
} );

simulaRasa.register( 'SimulaRasaQueryParameters', SimulaRasaQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.simulaRasa.SimulaRasaQueryParameters' );

export default SimulaRasaQueryParameters;