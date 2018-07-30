import DS from 'ember-data';

const { Model, attr, hasMany, belongsTo } = DS;

export default Model.extend({
	name: attr('string'),
	year: attr('number'),
	artist: belongsTo('artist', {
		async: false
	}),
	songs: hasMany('song', {
		async: false
	}),
	releaseDate: attr('standard-date')
});
