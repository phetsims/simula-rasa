// Copyright 2014-2024, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities. https://github.com/phetsims/{{REPO}}/issues/1
 *
 * @author {{AUTHOR}}
 */

import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import simulaRasa from '../../simulaRasa.js';

type SelfOptions = {
  //TODO add options that are specific to SimulaRasaModel here. https://github.com/phetsims/{{REPO}}/issues/1
};

type SimulaRasaModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SimulaRasaModel implements TModel {

  public constructor( providedOptions: SimulaRasaModelOptions ) {
    //TODO. https://github.com/phetsims/{{REPO}}/issues/1
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    //TODO. https://github.com/phetsims/{{REPO}}/issues/1
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO. https://github.com/phetsims/{{REPO}}/issues/1
  }
}

simulaRasa.register( 'SimulaRasaModel', SimulaRasaModel );