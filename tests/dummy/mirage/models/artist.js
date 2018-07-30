import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
    albums: hasMany(),
    songs: hasMany()
});
