import { debug } from '@ember/debug';
import DS from 'ember-data';
import EmberDirtier from 'ember-dirtier/mixins/ember-dirtier';
const { Model } = DS;

export function initialize() {
  debug('initializing ember-dirtier');
  Model.reopen(EmberDirtier,{});
}

export default {
  name: "ember-dirtier",
  after: "ember-data",
  initialize
};
