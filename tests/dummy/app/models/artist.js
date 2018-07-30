/* eslint-disable */
import DS from 'ember-data';

const { attr, hasMany, Model } = DS;

export default Model.extend({
	name: attr('string'),
	genre: attr('string'),
	country: attr('string'),
	bio: attr(),
	albums: hasMany('album', {
		async: true
	}),
	songs: hasMany('song', {
		async: true
	})
});
