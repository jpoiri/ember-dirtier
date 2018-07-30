import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
    artist: belongsTo(),
    songs: hasMany()
});
