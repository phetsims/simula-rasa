// Copyright 2022-2025, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author {{AUTHOR}}
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import amortizationCalc from '../amortizationCalc.js';

const AmortizationCalcQueryParameters = QueryStringMachine.getAll( {
  //TODO add schemas for query parameters
} );

amortizationCalc.register( 'AmortizationCalcQueryParameters', AmortizationCalcQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.amortizationCalc.AmortizationCalcQueryParameters' );

export default AmortizationCalcQueryParameters;
