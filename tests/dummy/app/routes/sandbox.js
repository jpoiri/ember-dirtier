import Route from '@ember/routing/route';
import DS from 'ember-data';

const { Model } = DS;

export default Route.extend({
    model() {

        console.dir(Model);

        //return this.get('store').createRecord('artist');

        //return this.get('store').findAll('artist');
    },
});
