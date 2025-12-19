// Copyright 2025, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from simula-rasa-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import simulaRasa from './simulaRasa.js';
import SimulaRasaStrings from './SimulaRasaStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( SimulaRasaStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};



// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${FluentLibrary.formatMultilineForFtl( stringProperty.value )}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const SimulaRasaFluent = {
  "simula-rasa": {
    titleStringProperty: _.get( SimulaRasaStrings, 'simula-rasa.titleStringProperty' )
  },
  screen: {
    nameStringProperty: _.get( SimulaRasaStrings, 'screen.nameStringProperty' )
  }
};

export default SimulaRasaFluent;

simulaRasa.register('SimulaRasaFluent', SimulaRasaFluent);
