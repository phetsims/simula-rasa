// Copyright 2020-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import LinkableProperty from '../../axon/js/LinkableProperty.js';
import simulaRasa from './simulaRasa.js';

type StringsType = {
  'simula-rasa': {
    'titleStringProperty': LinkableProperty<string>;
  };
  'screen': {
    'nameStringProperty': LinkableProperty<string>;
  }
};

const SimulaRasaStrings = getStringModule( 'SIMULA_RASA' ) as StringsType;

simulaRasa.register( 'SimulaRasaStrings', SimulaRasaStrings );

export default SimulaRasaStrings;
