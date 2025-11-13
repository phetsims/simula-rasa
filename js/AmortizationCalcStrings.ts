// Copyright 2020-2024, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/browser/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/browser/LocalizedStringProperty.js';
import amortizationCalc from './amortizationCalc.js';

type StringsType = {
  'amortization-calc': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'nameStringProperty': LocalizedStringProperty;
  }
};

const AmortizationCalcStrings = getStringModule( 'AMORTIZATION_CALC' ) as StringsType;

amortizationCalc.register( 'AmortizationCalcStrings', AmortizationCalcStrings );

export default AmortizationCalcStrings;
