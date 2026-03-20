// Copyright 2022-2026, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author {{AUTHOR}}
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';

const SimulaRasaQueryParameters = QueryStringMachine.getAll( {
  //NOTE add schemas for query parameters
} );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
phet.log && phet.log( `SimulaRasaQueryParameters: ${JSON.stringify( SimulaRasaQueryParameters, null, 2 )}` );

export default SimulaRasaQueryParameters;
