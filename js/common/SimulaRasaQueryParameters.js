// Copyright 2022, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author {{AUTHOR}}
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import simulaRasa from '../simulaRasa.js';

const SCHEMA_MAP = {
  //TODO add schemas for query parameters
};

const SimulaRasaQueryParameters = QueryStringMachine.getAll( SCHEMA_MAP );

// The schema map is a read-only part of the public API, in case schema details (e.g. validValues) are needed elsewhere.
SimulaRasaQueryParameters.SCHEMA_MAP = SCHEMA_MAP;

simulaRasa.register( 'SimulaRasaQueryParameters', SimulaRasaQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.simulaRasa.SimulaRasaQueryParameters' );

export default SimulaRasaQueryParameters;