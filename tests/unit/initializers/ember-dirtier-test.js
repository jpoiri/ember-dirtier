import { A } from '@ember/array';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Initializer | ember-dirtier', function(hooks) {
  setupTest(hooks);

	test('isHasManyRelationship', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const subject = store.createRecord('album');

			assert.equal(
				subject._isHasManyRelationship({
					kind: 'hasMany'
				}),
				true
			);
			assert.equal(
				subject._isHasManyRelationship({
					kind: 'belongsTo'
				}),
				false
			);
			assert.equal(subject._isHasManyRelationship(''), false);
			assert.equal(subject._isHasManyRelationship(null), false);
		});
	});

	test('isBelongsToRelationship', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const subject = store.createRecord('album');

			assert.equal(
				subject._isBelongsToRelationship({
					kind: 'belongsTo'
				}),
				true,
				'Test is equal to true when its a belongsTo relationship'
			);
			assert.equal(
				subject._isBelongsToRelationship({
					kind: 'hasMany'
				}),
				false,
				'Test is equal to false when its a hasMany relationship'
			);
			assert.equal(
				subject._isBelongsToRelationship(''),
				false,
				'Test is equal to false when the relationship descriptor is an empty string'
			);
			assert.equal(
				subject._isBelongsToRelationship([]),
				false,
				'Test is equal to false when the relationship descriptor is an empty array'
			);
			assert.equal(
				subject._isBelongsToRelationship(null),
				false,
				'Test is equal to false when the relationship descriptor is null'
			);
		});
	});

	test('isHasManyRelationshipDirty', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');
			const song1 = store.createRecord('song');
			const song2 = store.createRecord('song');
			const song3 = store.createRecord('song');
			const song4 = store.createRecord('song');

			song1.set('name', 'butterfly dance');

			const dirtySongs = A([]);
			dirtySongs.pushObject(song1);
			dirtySongs.pushObject(song2);

			const pristineSongs = A([]);
			pristineSongs.pushObject(song3);
			pristineSongs.pushObject(song4);

			album.set('songs', dirtySongs);
			assert.equal(album._isHasManyRelationshipDirty('songs'), true, 'Test is equal to true when at least one object is dirty');

			album.set('songs', pristineSongs);
			assert.equal(album._isHasManyRelationshipDirty('songs'), false, 'Test is equal to false when no objects is dirty');

			album.set('songs', []);
			assert.equal(
				album._isHasManyRelationshipDirty('songs'),
				false,
				'Test is equal to false when the relationship is an empty array'
			);

			assert.equal(album._isHasManyRelationshipDirty(null), false, 'Test is equal to false when the relationship name is null');
		});
	});

	test('isBelongsToRelationshipDirty', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');
			const dirtyArtist = store.createRecord('artist');
			const pristineArtist = store.createRecord('artist');

			dirtyArtist.set('name', 'Areosmith');

			album.set('artist', dirtyArtist);
			assert.equal(album._isBelongsToRelationshipDirty('artist'), true, 'Test is equal to true when the relationship is dirty');

			album.set('artist', pristineArtist);

			assert.equal(
				album._isBelongsToRelationshipDirty('artist'),
				false,
				'Test is equal to false when the relationship is not dirty'
			);

			album.set('artist', null);
			assert.equal(album._isBelongsToRelationshipDirty('artist'), false, 'Test is equal to false when the relationship is null');

			album.set('artist', '');
			assert.equal(
				album._isBelongsToRelationshipDirty('artist'),
				false,
				'Test is equal to false when the relationship is an empty string'
			);

			album.set('artist', []);
			assert.equal(
				album._isBelongsToRelationshipDirty('artist'),
				false,
				'Test is equal to false when the relationship is an empty array'
			);

			assert.equal(album._isBelongsToRelationshipDirty(null), false, 'Test is equal to false when the relationship name is null');
		});
	});

	test('isDirtyAttribute', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			let album = store.createRecord('album');

			album.set('name', 'nevermind');

			assert.equal(album._isDirtyAttribute('name'), true, 'Test is equal to true when attribute is dirty');

			album.set('name', null);
			assert.equal(album._isDirtyAttribute('name'), false, 'Test is equal to false when attribute is not dirty');

			album.set('savedAttributesMap', null);
			assert.equal(album._isDirtyAttribute('name'), false, 'Test is equal to false when savesValues is null');

			album.set('savedAttributesMap', '');
			assert.equal(album._isDirtyAttribute('name'), false, 'Test is equal to false when savesValues is an empty string');

			album.set('savedAttributesMap', []);
			assert.equal(album._isDirtyAttribute('name'), false, 'Test is equal to false when savesValues is an empty array');

			album = store.createRecord('artist');

			assert.equal(album._isDirtyAttribute(null), false, 'Test is equal to false when attributeName is null');
		});
	});

	test('saveAttributes', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			album.set('name', 'nevermind');
			album._saveAttributes();

			assert.notEqual(album.get('savedAttributesMap'), null, 'Test is savedValuesMap is not equal null');
			assert.equal(album.get('savedAttributesMap').get('name'), 'nevermind', 'Test attribute name is saved');
		});
	});

	test('isHasManyRelationshipLoaded', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');
			const song = store.createRecord('song');

			assert.equal(
				album._isHasManyRelationshipLoaded('songs'),
				false,
				'Test is equal to false when the relationship is not loaded'
			);

			const songs = A([]);
			songs.pushObject(song);
			album.set('songs', songs);

			assert.equal(album._isHasManyRelationshipLoaded('songs'), true, 'Test is equal to true when the relationship is loaded');

			assert.equal(album._isHasManyRelationshipLoaded(null), false, 'Test is equal to false when the relationship name is null');
		});
	});

	test('isBelongsToRelationshipLoaded', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');
			const artist = store.createRecord('artist');

			assert.equal(
				album._isBelongsToRelationshipLoaded('artist'),
				false,
				'Test is equal to false when the relationship is not loaded'
			);

			album.set('artist', artist);
			assert.equal(album._isBelongsToRelationshipLoaded('artist'), true, 'Test is equal to true when the relationship is loaded');

			assert.equal(album._isBelongsToRelationshipLoaded(null), false, 'Test is equal to false when the relationship name is null');
		});
	});

	test('isAsyncRelationship', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			assert.equal(
				album._isAsyncRelationship({
					options: {
						async: true
					}
				}),
				true,
				'Test is equal to true when the relationship is async'
			);

			assert.equal(
				album._isAsyncRelationship({
					options: {
						async: false
					}
				}),
				false,
				'Test is equal to false when the relationship is not async'
			);

			assert.equal(
				album._isAsyncRelationship({
					options: {}
				}),
				false,
				'Test is equal to true when the relationship has no async property'
			);

			assert.equal(album._isAsyncRelationship({}), false, 'Test is equal to true when the relationship has no options property');
		});
	});

	test('updateState', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album1 = store.createRecord('album');
			const album2 = store.createRecord('album');
			const album3 = store.createRecord('album');
			const album4 = store.createRecord('album');
			const artist = store.createRecord('artist');
			const song1 = store.createRecord('song');
			const song2 = store.createRecord('song');
			const song3 = store.createRecord('song');
			const songs = A([]);
			const albums = A([]);

			const date = Date();

			album2.set('name', 'in utero');
			album2.set('releaseDate', date);
			albums.pushObject(album2);
			album3.set('name', 'nevermind');
			albums.pushObject(album3);
			album4.set('name', 'biggest hits');
			albums.pushObject(album4);

			song1.set('name', 'falling out');
			song1.set('instruments', ['guitar', 'bass', 'drums']);
			songs.pushObject(song1);
			song2.set('name', 'longview');
			song2.set('instruments', ['guitar', 'piano', 'drums']);
			songs.pushObject(song2);
			song3.set('name', 'come as you are');
			song3.set('instruments', ['guitar', 'drums']);
			songs.pushObject(song3);

			artist.set('name', 'Fallout boy');
			artist.set('albums', albums);
			artist.set('bio', {
				desc: 'something'
			});
			artist.set('genre', 'Punk');

			album1.set('songs', songs);
			album1.set('year', 2015);
			album1.set('artist', artist);

			assert.equal(album1.get('dirtyProperties.length'), 3, 'Test album1 has 3 dirty properties');
			assert.equal(album1.get('dirtyAttributes.length'), 1, 'Test album1 has 1 dirty attributes');
			assert.equal(album1.get('dirtyRelationships.length'), 2, 'Test album1 has 2 dirty relationships');
			assert.equal(album1.get('dirty'), true, 'Test album1 dirty flag is true');
			assert.equal(album1.get('hasDirtyAttribute'), true, 'Test album1 hasDirtyAttribute is true');
			assert.equal(album1.get('hasDirtyRelationship'), true, 'Test album1 hasDirtyRelationship is true');
			assert.equal(album1.get('songsDirty'), true, 'Test album1 songsDirty is true');
			assert.equal(album1.get('yearDirty'), true, 'Test album1 yearDirty is true');
			assert.equal(album1.get('artistDirty'), true, 'Test album1 artistDirty is true');
			assert.equal(album1.get('nameDirty'), false, 'Test album1 nameDirty is false');

			assert.equal(album2.get('dirtyProperties.length'), 3, 'Test album2 has 3 dirty properties');
			assert.equal(album2.get('dirtyAttributes.length'), 2, 'Test album2 has 2 dirty attributes');
			assert.equal(album2.get('dirtyRelationships.length'), 1, 'Test album2 has 1 dirty relationships');
			assert.equal(album2.get('dirty'), true, 'Test album2 dirty flag is true');
			assert.equal(album2.get('hasDirtyAttribute'), true, 'Test album2 hasDirtyAttribute is true');
			assert.equal(album2.get('hasDirtyRelationship'), true, 'Test album2 hasDirtyRelationship is true');
			assert.equal(album2.get('songsDirty'), false, 'Test album2 songsDirty is false');
			assert.equal(album2.get('yearDirty'), false, 'Test album2 yearDirty is false');
			assert.equal(album2.get('artistDirty'), true, 'Test album2 artistDirty is true');
			assert.equal(album2.get('nameDirty'), true, 'Test album2 nameDirty is true');
			assert.equal(album2.get('releaseDateDirty'), true, 'Test album2 releaseDateDirty is true');

			assert.equal(album3.get('dirtyProperties.length'), 2, 'Test album3 has 2 dirty properties');
			assert.equal(album3.get('dirtyAttributes.length'), 1, 'Test album3 has 1 dirty attributes');
			assert.equal(album3.get('dirtyRelationships.length'), 1, 'Test album3 has 1 dirty relationships');
			assert.equal(album3.get('dirty'), true, 'Test album3 dirty flag is true');
			assert.equal(album3.get('hasDirtyAttribute'), true, 'Test album3 hasDirtyAttribute is true');
			assert.equal(album3.get('hasDirtyRelationship'), true, 'Test album3 hasDirtyRelationship is true');
			assert.equal(album3.get('songsDirty'), false, 'Test album3 songsDirty is false');
			assert.equal(album3.get('yearDirty'), false, 'Test album3 yearDirty is false');
			assert.equal(album3.get('artistDirty'), true, 'Test album3 artistDirty is true');
			assert.equal(album3.get('nameDirty'), true, 'Test album3 nameDirty is true');

			assert.equal(album4.get('dirtyProperties.length'), 2, 'Test album4 has 2 dirty properties');
			assert.equal(album4.get('dirtyAttributes.length'), 1, 'Test album4 has 1 dirty attributes');
			assert.equal(album4.get('dirtyRelationships.length'), 1, 'Test album4 has 1 dirty relationships');
			assert.equal(album4.get('dirty'), true, 'Test album4 dirty flag is true');
			assert.equal(album4.get('hasDirtyAttribute'), true, 'Test album4 hasDirtyAttribute is true');
			assert.equal(album4.get('hasDirtyRelationship'), true, 'Test album4 hasDirtyRelationship is true');
			assert.equal(album4.get('songsDirty'), false, 'Test album4 songsDirty is false');
			assert.equal(album4.get('yearDirty'), false, 'Test album4 yearDirty is false');
			assert.equal(album4.get('artistDirty'), true, 'Test album4 artistDirty is true');
			assert.equal(album4.get('nameDirty'), true, 'Test album4 nameDirty is true');

			assert.equal(song1.get('dirtyProperties.length'), 3, 'Test song1 has 3 dirty properties');
			assert.equal(song1.get('dirtyAttributes.length'), 2, 'Test song1 has 2 dirty attributes');
			assert.equal(song1.get('dirtyRelationships.length'), 1, 'Test song1 has 1 dirty relationships');
			assert.equal(song1.get('dirty'), true, 'Test song1 dirty flag is true');
			assert.equal(song1.get('hasDirtyAttribute'), true, 'Test song1 hasDirtyAttribute is true');
			assert.equal(song1.get('hasDirtyRelationship'), true, 'Test song1 hasDirtyRelationship is true');
			assert.equal(song1.get('nameDirty'), true, 'Test song1 nameDirty is true');
			assert.equal(song1.get('albumDirty'), true, 'Test song1 albumDirty is true');
			assert.equal(song1.get('instrumentsDirty'), true, 'Test song1 instrumentsDirty is true');

			assert.equal(song2.get('dirtyProperties.length'), 3, 'Test song2 has 3 dirty properties');
			assert.equal(song2.get('dirtyAttributes.length'), 2, 'Test song2 has 2 dirty attributes');
			assert.equal(song2.get('dirtyRelationships.length'), 1, 'Test song2 has 1 dirty relationships');
			assert.equal(song2.get('dirty'), true, 'Test song2 dirty flag is true');
			assert.equal(song2.get('hasDirtyAttribute'), true, 'Test song2 hasDirtyAttribute is true');
			assert.equal(song2.get('hasDirtyRelationship'), true, 'Test song2 hasDirtyRelationship is true');
			assert.equal(song2.get('nameDirty'), true, 'Test song2 nameDirty is true');
			assert.equal(song2.get('albumDirty'), true, 'Test song2 albumDirty is true');
			assert.equal(song2.get('instrumentsDirty'), true, 'Test song2 instrumentsDirty is true');

			assert.equal(song3.get('dirtyProperties.length'), 3, 'Test song3 has 3 dirty properties');
			assert.equal(song3.get('dirtyAttributes.length'), 2, 'Test song3 has 2 dirty attributes');
			assert.equal(song3.get('dirtyRelationships.length'), 1, 'Test song3 has 1 dirty relationships');
			assert.equal(song3.get('dirty'), true, 'Test song3 dirty flag is true');
			assert.equal(song3.get('hasDirtyAttribute'), true, 'Test song3 hasDirtyAttribute is true');
			assert.equal(song3.get('hasDirtyRelationship'), true, 'Test song3 hasDirtyRelationship is true');
			assert.equal(song3.get('nameDirty'), true, 'Test song3 nameDirty is true');
			assert.equal(song3.get('albumDirty'), true, 'Test song3 albumDirty is true');
			assert.equal(song3.get('instrumentsDirty'), true, 'Test song3 instrumentsDirty is true');

			assert.equal(artist.get('dirtyProperties.length'), 4, 'Test artist has 4 dirty properties');
			assert.equal(artist.get('dirtyAttributes.length'), 3, 'Test artist has 3 dirty attributes');
			assert.equal(artist.get('dirtyRelationships.length'), 1, 'Test artist has 1 dirty relationships');
			assert.equal(artist.get('dirty'), true, 'Test artist dirty flag is true');
			assert.equal(artist.get('hasDirtyAttribute'), true, 'Test artist hasDirtyAttribute is true');
			assert.equal(artist.get('hasDirtyRelationship'), true, 'Test artist hasDirtyRelationship is true');
			assert.equal(artist.get('nameDirty'), true, 'Test artist nameDirty is true');
			assert.equal(artist.get('genreDirty'), true, 'Test artist genreDirty is true');
			assert.equal(artist.get('countryDirty'), false, 'Test artist countryDirty is false');
			assert.equal(artist.get('albumsDirty'), true, 'Test artist albumsDirty is true');
			assert.equal(artist.get('songsDirty'), false, 'Test artist songsDirty is false');
			assert.equal(artist.get('bioDirty'), true, 'Test artist bioDirty is false');

			album1._updateState();

			assert.equal(album1.get('dirtyProperties.length'), 0, 'Test album1 has 0 dirty properties');
			assert.equal(album1.get('dirtyAttributes.length'), 0, 'Test album1 has 0 dirty attributes');
			assert.equal(album1.get('dirtyRelationships.length'), 0, 'Test album1 has 0 dirty relationships');
			assert.equal(album1.get('dirty'), false, 'Test album1 dirty flag is false');
			assert.equal(album1.get('hasDirtyAttribute'), false, 'Test album1 hasDirtyAttribute is false');
			assert.equal(album1.get('hasDirtyRelationship'), false, 'Test album1 hasDirtyRelationship is false');
			assert.equal(album1.get('songsDirty'), false, 'Test album1 songsDirty is false');
			assert.equal(album1.get('yearDirty'), false, 'Test album1 yearDirty is false');
			assert.equal(album1.get('artistDirty'), false, 'Test album1 artistDirty is false');
			assert.equal(album1.get('nameDirty'), false, 'Test album1 nameDirty is false');

			assert.equal(album2.get('dirtyProperties.length'), 0, 'Test album2 has 0 dirty properties');
			assert.equal(album2.get('dirtyAttributes.length'), 0, 'Test album2 has 0 dirty attributes');
			assert.equal(album2.get('dirtyRelationships.length'), 0, 'Test album2 has 0 dirty relationships');
			assert.equal(album2.get('dirty'), false, 'Test album2 dirty flag is false');
			assert.equal(album2.get('hasDirtyAttribute'), false, 'Test album2 hasDirtyAttribute is false');
			assert.equal(album2.get('hasDirtyRelationship'), false, 'Test album2 hasDirtyRelationship is false');
			assert.equal(album2.get('songsDirty'), false, 'Test album2 songsDirty is false');
			assert.equal(album2.get('yearDirty'), false, 'Test album2 yearDirty is false');
			assert.equal(album2.get('artistDirty'), false, 'Test album2 artistDirty is false');
			assert.equal(album2.get('nameDirty'), false, 'Test album2 nameDirty is false');
			assert.equal(album2.get('releaseDateDirty'), false, 'Test album2 releaseDateDirty is true');

			assert.equal(album3.get('dirtyProperties.length'), 0, 'Test album3 has 0 dirty properties');
			assert.equal(album3.get('dirtyAttributes.length'), 0, 'Test album3 has 0 dirty attributes');
			assert.equal(album3.get('dirtyRelationships.length'), 0, 'Test album3 has 0 dirty relationships');
			assert.equal(album3.get('dirty'), false, 'Test album3 dirty flag is false');
			assert.equal(album3.get('hasDirtyAttribute'), false, 'Test album3 hasDirtyAttribute is false');
			assert.equal(album3.get('hasDirtyRelationship'), false, 'Test album3 hasDirtyRelationship is false');
			assert.equal(album3.get('songsDirty'), false, 'Test album3 songsDirty is false');
			assert.equal(album3.get('yearDirty'), false, 'Test album3 yearDirty is false');
			assert.equal(album3.get('artistDirty'), false, 'Test album3 artistDirty is false');
			assert.equal(album3.get('nameDirty'), false, 'Test album3 nameDirty is false');

			assert.equal(album4.get('dirtyProperties.length'), 0, 'Test album4 has 0 dirty properties');
			assert.equal(album4.get('dirtyAttributes.length'), 0, 'Test album4 has 0 dirty attributes');
			assert.equal(album4.get('dirtyRelationships.length'), 0, 'Test album4 has 0 dirty relationships');
			assert.equal(album4.get('dirty'), false, 'Test album4 dirty flag is false');
			assert.equal(album4.get('hasDirtyAttribute'), false, 'Test album4 hasDirtyAttribute is false');
			assert.equal(album4.get('hasDirtyRelationship'), false, 'Test album4 hasDirtyRelationship is false');
			assert.equal(album4.get('songsDirty'), false, 'Test album4 songsDirty is false');
			assert.equal(album4.get('yearDirty'), false, 'Test album4 yearDirty is false');
			assert.equal(album4.get('artistDirty'), false, 'Test album4 artistDirty is false');
			assert.equal(album4.get('nameDirty'), false, 'Test album4 nameDirty is false');

			assert.equal(song1.get('dirtyProperties.length'), 0, 'Test song1 has 0 dirty properties');
			assert.equal(song1.get('dirtyAttributes.length'), 0, 'Test song1 has 0 dirty attributes');
			assert.equal(song1.get('dirtyRelationships.length'), 0, 'Test song1 has 0 dirty relationships');
			assert.equal(song1.get('dirty'), false, 'Test song1 dirty flag is false');
			assert.equal(song1.get('hasDirtyAttribute'), false, 'Test song1 hasDirtyAttribute is false');
			assert.equal(song1.get('hasDirtyRelationship'), false, 'Test song1 hasDirtyRelationship is false');
			assert.equal(song1.get('nameDirty'), false, 'Test song1 nameDirty is false');
			assert.equal(song1.get('albumDirty'), false, 'Test song1 albumDirty is false');
			assert.equal(song1.get('instrumentsDirty'), false, 'Test song2 instrumentsDirty is false');

			assert.equal(song2.get('dirtyProperties.length'), 0, 'Test song2 has 0 dirty properties');
			assert.equal(song2.get('dirtyAttributes.length'), 0, 'Test song2 has 0 dirty attributes');
			assert.equal(song2.get('dirtyRelationships.length'), 0, 'Test song2 has 0 dirty relationships');
			assert.equal(song2.get('dirty'), false, 'Test song2 dirty flag is false');
			assert.equal(song2.get('hasDirtyAttribute'), false, 'Test song2 hasDirtyAttribute is false');
			assert.equal(song2.get('hasDirtyRelationship'), false, 'Test song2 hasDirtyRelationship is false');
			assert.equal(song2.get('nameDirty'), false, 'Test song2 nameDirty is false');
			assert.equal(song2.get('albumDirty'), false, 'Test song2 albumDirty is false');
			assert.equal(song2.get('instrumentsDirty'), false, 'Test song2 instrumentsDirty is false');

			assert.equal(song3.get('dirtyProperties.length'), 0, 'Test song3 has 0 dirty properties');
			assert.equal(song3.get('dirtyAttributes.length'), 0, 'Test song3 has 0 dirty attributes');
			assert.equal(song3.get('dirtyRelationships.length'), 0, 'Test song3 has 0 dirty relationships');
			assert.equal(song3.get('dirty'), false, 'Test song3 dirty flag is false');
			assert.equal(song3.get('hasDirtyAttribute'), false, 'Test song3 hasDirtyAttribute is false');
			assert.equal(song3.get('hasDirtyRelationship'), false, 'Test song3 hasDirtyRelationship is false');
			assert.equal(song3.get('nameDirty'), false, 'Test song3 nameDirty is false');
			assert.equal(song3.get('albumDirty'), false, 'Test song3 albumDirty is false');
			assert.equal(song3.get('instrumentsDirty'), false, 'Test song3 instrumentsDirty is false');

			assert.equal(artist.get('dirtyProperties.length'), 0, 'Test artist has 0 dirty properties');
			assert.equal(artist.get('dirtyAttributes.length'), 0, 'Test artist has 0 dirty attributes');
			assert.equal(artist.get('dirtyRelationships.length'), 0, 'Test artist has 0 dirty relationships');
			assert.equal(artist.get('dirty'), false, 'Test artist dirty flag is false');
			assert.equal(artist.get('hasDirtyAttribute'), false, 'Test artist hasDirtyAttribute is false');
			assert.equal(artist.get('hasDirtyRelationship'), false, 'Test artist hasDirtyRelationship is false');
			assert.equal(artist.get('nameDirty'), false, 'Test artist nameDirty is false');
			assert.equal(artist.get('genreDirty'), false, 'Test artist genreDirty is false');
			assert.equal(artist.get('countryDirty'), false, 'Test artist countryDirty is false');
			assert.equal(artist.get('albumsDirty'), false, 'Test artist albumsDirty is false');
			assert.equal(artist.get('songsDirty'), false, 'Test artist songsDirty is false');
			assert.equal(artist.get('bioDirty'), false, 'Test artist bioDirty is false');
		});
	});

	test('initState', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			album.set('name', 'nevermind');
			album.set('year', 2023);

			album._initState();

			assert.equal(album.get('dirtyProperties.length'), 0, 'Test album has 0 dirty properties');
			assert.equal(album.get('dirtyAttributes.length'), 0, 'Test album has 0 dirty attributes');
			assert.equal(album.get('dirtyRelationships.length'), 0, 'Test album has 0 dirty relationships');
			assert.equal(album.get('dirty'), false, 'Test album dirty flag is false');
			assert.equal(album.get('hasDirtyAttribute'), false, 'Test album hasDirtyAttribute is false');
			assert.equal(album.get('hasDirtyRelationship'), false, 'Test album hasDirtyRelationship is false');
			assert.equal(album.get('songsDirty'), false, 'Test album songsDirty is false');
			assert.equal(album.get('yearDirty'), false, 'Test album yearDirty is false');
			assert.equal(album.get('artistDirty'), false, 'Test album artistDirty is false');
			assert.equal(album.get('nameDirty'), false, 'Test album nameDirty is false');
			assert.equal(album.get('savedAttributesMap').get('name'), 'nevermind');
			assert.equal(album.get('savedAttributesMap').get('year'), 2023);
		});
	});

	test('resetFlags', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			album.set('name', 'nevermind');
			album.set('year', 2023);

			album._resetFlags();

			assert.equal(album.get('songsDirty'), false, 'Test album songsDirty is false');
			assert.equal(album.get('yearDirty'), false, 'Test album yearDirty is false');
			assert.equal(album.get('artistDirty'), false, 'Test album artistDirty is false');
			assert.equal(album.get('nameDirty'), false, 'Test album nameDirty is false');
		});
	});

	test('dirtyRelationshipsChanged', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			album.get('dirtyRelationships').pushObject('someString');
			assert.equal(album.get('hasDirtyRelationship'), true, 'Test hasDirtyRelationship flag is true when there is a relationship');
			album.get('dirtyRelationships').removeObject('someString');
			assert.equal(
				album.get('hasDirtyRelationship'),
				false,
				'Test hasDirtyRelationship flag is false when there is not a relationship'
			);
		});
	});

	test('dirtyAttributesChanged', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			album.get('dirtyAttributes').pushObject('someString');
			assert.equal(album.get('hasDirtyAttribute'), true, 'Test hasDirtyAttribute flag is true when there is a attributes');
			album.get('dirtyAttributes').removeObject('someString');
			assert.equal(album.get('hasDirtyAttribute'), false, 'Test hasDirtyAttribute flag is false when there is not a attributes');
		});
	});

	test('dirtyPropertiesChanged', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			album.get('dirtyProperties').pushObject('someString');
			assert.equal(album.get('dirty'), true, 'Test dirty is true flag when there is a attributes');
			album.get('dirtyProperties').removeObject('someString');
			assert.equal(album.get('dirty'), false, 'Test dirty is false flag when there is not a attributes');
		});
	});

	test('setDirtyProperty', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			album._setDirtyProperty('test', true);
			assert.equal(album.get('testDirty'), true, 'Test dirty property is true');

			album._setDirtyProperty('test', false);
			assert.equal(album.get('testDirty'), false, 'Test dirty property is false');
		});
	});

	test('safeRemoveObject', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			album.get('dirtyProperties').pushObject('someString');
			assert.equal(album.get('dirtyProperties.length'), 1, 'Test dirtyProperties length is 1');
			album._safeRemoveObject('dirtyProperties', 'someString');
			assert.equal(album.get('dirtyProperties.length'), 0, 'Test dirtyProperties length is 0 when the property exist');

			album.get('dirtyProperties').pushObject('someString');
			album._safeRemoveObject('dirtyProperties', 'someString2');
			assert.equal(album.get('dirtyProperties.length'), 1, 'Test dirtyProperties length is 1 when the property does not exist');

			album._safeRemoveObject('dirtyProperties', null);
			assert.equal(album.get('dirtyProperties.length'), 1, 'Test dirtyProperties length is 1 when the property is null');

			album._safeRemoveObject(null, 'someString2');
			assert.equal(album.get('dirtyProperties.length'), 1, 'Test dirtyProperties length is 1 when the array name is null');
		});
	});

	test('safePushObject', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			album._safePushObject('dirtyProperties', 'someString');
			assert.equal(album.get('dirtyProperties.length'), 1, 'Test dirtyProperties length is 1 when the property exist');

			album.get('dirtyProperties').removeObject('someString');

			album._safeRemoveObject('dirtyProperties', null);
			assert.equal(album.get('dirtyProperties.length'), 0, 'Test dirtyProperties length is 1 when the property is null');

			album._safeRemoveObject(null, 'someString2');
			assert.equal(album.get('dirtyProperties.length'), 0, 'Test dirtyProperties length is 1 when the array name is null');
		});
	});

	test('removeDirtyRelationship', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');
			const artist = store.createRecord('artist');

			artist.set('name', 'some artist name');
			album.set('artist', artist);

			assert.equal(album.get('artistDirty'), true, 'Test artistDirty flag is true before calling removeDirtyRelationship');
			assert.equal(
				album.get('dirtyProperties.length'),
				1,
				'Test there is 1 dirtyProperties before calling removeDirtyRelationship'
			);
			assert.equal(
				album.get('dirtyRelationships.length'),
				1,
				'Test there is 1 dirtyRelationships before calling removeDirtyRelationship'
			);

			album._removeDirtyRelationship('artist');

			assert.equal(album.get('artistDirty'), false, 'Test artistDirty flag is false');
			assert.equal(album.get('dirtyProperties.length'), 0, 'Test there is 0 dirtyProperties');
			assert.equal(album.get('dirtyRelationships.length'), 0, 'Test there is 0 dirtyRelationships');
		});
	});

	test('addDirtyRelationship', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			album._addDirtyRelationship('artist');

			assert.equal(album.get('artistDirty'), true, 'Test relationship is dirty');
			assert.equal(album.get('dirtyProperties.length'), 1, 'Test dirtyProperties is 1');
			assert.equal(album.get('dirtyRelationships.length'), 1, 'Test dirtyRelationships is 1');
		});
	});

	test('removeDirtyAttribute', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			album.set('name', 'where the lamb sauce?');

			assert.equal(album.get('nameDirty'), true, 'Test nameDirty flag is true before calling removeDirtyAttribute');
			assert.equal(album.get('dirtyAttributes.length'), 1, 'Test there is 1 dirtyAttributes before calling removeDirtyAttribute');
			assert.equal(album.get('dirtyProperties.length'), 1, 'Test there is 1 dirtyProperties before calling removeDirtyAttribute');

			album._removeDirtyAttribute('name');

			assert.equal(album.get('nameDirty'), false, 'Test nameDirty flag is false');
			assert.equal(album.get('dirtyAttributes.length'), 0, 'Test there is 0 dirtyAttributes');
			assert.equal(album.get('dirtyProperties.length'), 0, 'Test there is 0 dirtyProperties');
		});
	});

	test('addDirtyAttribute', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');

			album._addDirtyAttribute('name');

			assert.equal(album.get('nameDirty'), true, 'Test nameDirty flag is true');
			assert.equal(album.get('dirtyAttributes.length'), 1, 'Test there is 1 dirtyAttributes');
			assert.equal(album.get('dirtyProperties.length'), 1, 'Test there is 1 dirtyProperties');
		});
	});

	test('addObservers', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album1 = store.createRecord('album');
			const album2 = store.createRecord('album');
			const album3 = store.createRecord('album');
			const album4 = store.createRecord('album');
			const artist = store.createRecord('artist');
			const song1 = store.createRecord('song');
			const song2 = store.createRecord('song');
			const song3 = store.createRecord('song');
			const songs = A([]);
			const albums = A([]);

			album2.set('name', 'in utero');
			albums.pushObject(album2);
			album3.set('name', 'nevermind');
			albums.pushObject(album3);
			album4.set('name', 'biggest hits');
			albums.pushObject(album4);

			song1.set('name', 'falling out');
			songs.pushObject(song1);
			song2.set('name', 'longview');
			songs.pushObject(song2);
			song3.set('name', 'come as you are');
			songs.pushObject(song3);

			artist.set('name', 'Fallout boy');
			artist.set('albums', albums);
			artist.set('genre', 'Punk');

			album1.set('songs', songs);
			album1.set('year', 2015);
			album1.set('artist', artist);

			assert.equal(album1.get('dirtyProperties.length'), 3, 'Test album1 has 3 dirty properties');
			assert.equal(album1.get('dirtyAttributes.length'), 1, 'Test album1 has 1 dirty attributes');
			assert.equal(album1.get('dirtyRelationships.length'), 2, 'Test album1 has 2 dirty relationships');
			assert.equal(album1.get('dirty'), true, 'Test album1 dirty flag is true');
			assert.equal(album1.get('hasDirtyAttribute'), true, 'Test album1 hasDirtyAttribute is true');
			assert.equal(album1.get('hasDirtyRelationship'), true, 'Test album1 hasDirtyRelationship is true');
			assert.equal(album1.get('songsDirty'), true, 'Test album1 songsDirty is true');
			assert.equal(album1.get('yearDirty'), true, 'Test album1 yearDirty is true');
			assert.equal(album1.get('artistDirty'), true, 'Test album1 artistDirty is true');
			assert.equal(album1.get('nameDirty'), false, 'Test album1 nameDirty is false');

			assert.equal(album2.get('dirtyProperties.length'), 2, 'Test album2 has 2 dirty properties');
			assert.equal(album2.get('dirtyAttributes.length'), 1, 'Test album2 has 1 dirty attributes');
			assert.equal(album2.get('dirtyRelationships.length'), 1, 'Test album2 has 1 dirty relationships');
			assert.equal(album2.get('dirty'), true, 'Test album2 dirty flag is true');
			assert.equal(album2.get('hasDirtyAttribute'), true, 'Test album2 hasDirtyAttribute is true');
			assert.equal(album2.get('hasDirtyRelationship'), true, 'Test album2 hasDirtyRelationship is true');
			assert.equal(album2.get('songsDirty'), false, 'Test album2 songsDirty is false');
			assert.equal(album2.get('yearDirty'), false, 'Test album2 yearDirty is false');
			assert.equal(album2.get('artistDirty'), true, 'Test album2 artistDirty is true');
			assert.equal(album2.get('nameDirty'), true, 'Test album2 nameDirty is true');

			assert.equal(album3.get('dirtyProperties.length'), 2, 'Test album3 has 2 dirty properties');
			assert.equal(album3.get('dirtyAttributes.length'), 1, 'Test album3 has 1 dirty attributes');
			assert.equal(album3.get('dirtyRelationships.length'), 1, 'Test album3 has 1 dirty relationships');
			assert.equal(album3.get('dirty'), true, 'Test album3 dirty flag is true');
			assert.equal(album3.get('hasDirtyAttribute'), true, 'Test album3 hasDirtyAttribute is true');
			assert.equal(album3.get('hasDirtyRelationship'), true, 'Test album3 hasDirtyRelationship is true');
			assert.equal(album3.get('songsDirty'), false, 'Test album3 songsDirty is false');
			assert.equal(album3.get('yearDirty'), false, 'Test album3 yearDirty is false');
			assert.equal(album3.get('artistDirty'), true, 'Test album3 artistDirty is true');
			assert.equal(album3.get('nameDirty'), true, 'Test album3 nameDirty is true');

			assert.equal(album4.get('dirtyProperties.length'), 2, 'Test album4 has 2 dirty properties');
			assert.equal(album4.get('dirtyAttributes.length'), 1, 'Test album4 has 1 dirty attributes');
			assert.equal(album4.get('dirtyRelationships.length'), 1, 'Test album4 has 1 dirty relationships');
			assert.equal(album4.get('dirty'), true, 'Test album4 dirty flag is true');
			assert.equal(album4.get('hasDirtyAttribute'), true, 'Test album4 hasDirtyAttribute is true');
			assert.equal(album4.get('hasDirtyRelationship'), true, 'Test album4 hasDirtyRelationship is true');
			assert.equal(album4.get('songsDirty'), false, 'Test album4 songsDirty is false');
			assert.equal(album4.get('yearDirty'), false, 'Test album4 yearDirty is false');
			assert.equal(album4.get('artistDirty'), true, 'Test album4 artistDirty is true');
			assert.equal(album4.get('nameDirty'), true, 'Test album4 nameDirty is true');

			assert.equal(song1.get('dirtyProperties.length'), 2, 'Test song1 has 2 dirty properties');
			assert.equal(song1.get('dirtyAttributes.length'), 1, 'Test song1 has 1 dirty attributes');
			assert.equal(song1.get('dirtyRelationships.length'), 1, 'Test song1 has 1 dirty relationships');
			assert.equal(song1.get('dirty'), true, 'Test song1 dirty flag is true');
			assert.equal(song1.get('hasDirtyAttribute'), true, 'Test song1 hasDirtyAttribute is true');
			assert.equal(song1.get('hasDirtyRelationship'), true, 'Test song1 hasDirtyRelationship is true');
			assert.equal(song1.get('nameDirty'), true, 'Test song1 nameDirty is true');
			assert.equal(song1.get('albumDirty'), true, 'Test song1 albumDirty is true');

			assert.equal(song2.get('dirtyProperties.length'), 2, 'Test song2 has 2 dirty properties');
			assert.equal(song2.get('dirtyAttributes.length'), 1, 'Test song2 has 1 dirty attributes');
			assert.equal(song2.get('dirtyRelationships.length'), 1, 'Test song2 has 1 dirty relationships');
			assert.equal(song2.get('dirty'), true, 'Test song2 dirty flag is true');
			assert.equal(song2.get('hasDirtyAttribute'), true, 'Test song2 hasDirtyAttribute is true');
			assert.equal(song2.get('hasDirtyRelationship'), true, 'Test song2 hasDirtyRelationship is true');
			assert.equal(song2.get('nameDirty'), true, 'Test song2 nameDirty is true');
			assert.equal(song2.get('albumDirty'), true, 'Test song2 albumDirty is true');

			assert.equal(song3.get('dirtyProperties.length'), 2, 'Test song3 has 2 dirty properties');
			assert.equal(song3.get('dirtyAttributes.length'), 1, 'Test song3 has 1 dirty attributes');
			assert.equal(song3.get('dirtyRelationships.length'), 1, 'Test song3 has 1 dirty relationships');
			assert.equal(song3.get('dirty'), true, 'Test song3 dirty flag is true');
			assert.equal(song3.get('hasDirtyAttribute'), true, 'Test song3 hasDirtyAttribute is true');
			assert.equal(song3.get('hasDirtyRelationship'), true, 'Test song3 hasDirtyRelationship is true');
			assert.equal(song3.get('nameDirty'), true, 'Test song3 nameDirty is true');
			assert.equal(song3.get('albumDirty'), true, 'Test song3 albumDirty is true');

			assert.equal(artist.get('dirtyProperties.length'), 3, 'Test artist has 3 dirty properties');
			assert.equal(artist.get('dirtyAttributes.length'), 2, 'Test artist has 2 dirty attributes');
			assert.equal(artist.get('dirtyRelationships.length'), 1, 'Test artist has 1 dirty relationships');
			assert.equal(artist.get('dirty'), true, 'Test artist dirty flag is true');
			assert.equal(artist.get('hasDirtyAttribute'), true, 'Test artist hasDirtyAttribute is true');
			assert.equal(artist.get('hasDirtyRelationship'), true, 'Test artist hasDirtyRelationship is true');
			assert.equal(artist.get('nameDirty'), true, 'Test artist nameDirty is true');
			assert.equal(artist.get('genreDirty'), true, 'Test artist genreDirty is true');
			assert.equal(artist.get('countryDirty'), false, 'Test artist countryDirty is false');
			assert.equal(artist.get('albumsDirty'), true, 'Test artist albumsDirty is true');
			assert.equal(artist.get('songsDirty'), false, 'Test artist songsDirty is false');
		});
	});

	test('rollback', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album1 = store.createRecord('album');
			const album2 = store.createRecord('album');
			const album3 = store.createRecord('album');
			const album4 = store.createRecord('album');
			const artist = store.createRecord('artist');
			const song1 = store.createRecord('song');
			const song2 = store.createRecord('song');
			const song3 = store.createRecord('song');
			const songs = A([]);
			const albums = A([]);

			const date = Date();

			album2.set('name', 'in utero');
			album2.set('releaseDate', date);
			albums.pushObject(album2);
			album3.set('name', 'nevermind');
			albums.pushObject(album3);
			album4.set('name', 'biggest hits');
			albums.pushObject(album4);

			song1.set('name', 'falling out');
			song1.set('instruments', ['guitar', 'bass', 'drums']);
			songs.pushObject(song1);
			song2.set('name', 'longview');
			song2.set('instruments', ['guitar', 'piano', 'drums']);
			songs.pushObject(song2);
			song3.set('name', 'come as you are');
			song3.set('instruments', ['guitar', 'drums']);
			songs.pushObject(song3);

			artist.set('name', 'Fallout boy');
			artist.set('albums', albums);
			artist.set('bio', {
				desc: 'something'
			});
			artist.set('genre', 'Punk');

			album1.set('songs', songs);
			album1.set('year', 2015);
			album1.set('artist', artist);

			assert.equal(album1.get('dirtyProperties.length'), 3, 'Test album1 has 3 dirty properties');
			assert.equal(album1.get('dirtyAttributes.length'), 1, 'Test album1 has 1 dirty attributes');
			assert.equal(album1.get('dirtyRelationships.length'), 2, 'Test album1 has 2 dirty relationships');
			assert.equal(album1.get('dirty'), true, 'Test album1 dirty flag is true');
			assert.equal(album1.get('hasDirtyAttribute'), true, 'Test album1 hasDirtyAttribute is true');
			assert.equal(album1.get('hasDirtyRelationship'), true, 'Test album1 hasDirtyRelationship is true');
			assert.equal(album1.get('songsDirty'), true, 'Test album1 songsDirty is true');
			assert.equal(album1.get('yearDirty'), true, 'Test album1 yearDirty is true');
			assert.equal(album1.get('artistDirty'), true, 'Test album1 artistDirty is true');
			assert.equal(album1.get('nameDirty'), false, 'Test album1 nameDirty is false');
			assert.equal(album1.get('year'), 2015, 'Test album1 year is valid');

			assert.equal(album2.get('dirtyProperties.length'), 3, 'Test album2 has 3 dirty properties');
			assert.equal(album2.get('dirtyAttributes.length'), 2, 'Test album2 has 2 dirty attributes');
			assert.equal(album2.get('dirtyRelationships.length'), 1, 'Test album2 has 1 dirty relationships');
			assert.equal(album2.get('dirty'), true, 'Test album2 dirty flag is true');
			assert.equal(album2.get('hasDirtyAttribute'), true, 'Test album2 hasDirtyAttribute is true');
			assert.equal(album2.get('hasDirtyRelationship'), true, 'Test album2 hasDirtyRelationship is true');
			assert.equal(album2.get('songsDirty'), false, 'Test album2 songsDirty is false');
			assert.equal(album2.get('yearDirty'), false, 'Test album2 yearDirty is false');
			assert.equal(album2.get('artistDirty'), true, 'Test album2 artistDirty is true');
			assert.equal(album2.get('nameDirty'), true, 'Test album2 nameDirty is true');
			assert.equal(album2.get('name'), 'in utero', 'Test album2 name is valid');
			assert.equal(album2.get('releaseDate'), date, 'Test album2 releaseDate is valid');

			assert.equal(album3.get('dirtyProperties.length'), 2, 'Test album3 has 2 dirty properties');
			assert.equal(album3.get('dirtyAttributes.length'), 1, 'Test album3 has 1 dirty attributes');
			assert.equal(album3.get('dirtyRelationships.length'), 1, 'Test album3 has 1 dirty relationships');
			assert.equal(album3.get('dirty'), true, 'Test album3 dirty flag is true');
			assert.equal(album3.get('hasDirtyAttribute'), true, 'Test album3 hasDirtyAttribute is true');
			assert.equal(album3.get('hasDirtyRelationship'), true, 'Test album3 hasDirtyRelationship is true');
			assert.equal(album3.get('songsDirty'), false, 'Test album3 songsDirty is false');
			assert.equal(album3.get('yearDirty'), false, 'Test album3 yearDirty is false');
			assert.equal(album3.get('artistDirty'), true, 'Test album3 artistDirty is true');
			assert.equal(album3.get('nameDirty'), true, 'Test album3 nameDirty is true');
			assert.equal(album3.get('name'), 'nevermind', 'Test album3 name is valid');

			assert.equal(album4.get('dirtyProperties.length'), 2, 'Test album4 has 2 dirty properties');
			assert.equal(album4.get('dirtyAttributes.length'), 1, 'Test album4 has 1 dirty attributes');
			assert.equal(album4.get('dirtyRelationships.length'), 1, 'Test album4 has 1 dirty relationships');
			assert.equal(album4.get('dirty'), true, 'Test album4 dirty flag is true');
			assert.equal(album4.get('hasDirtyAttribute'), true, 'Test album4 hasDirtyAttribute is true');
			assert.equal(album4.get('hasDirtyRelationship'), true, 'Test album4 hasDirtyRelationship is true');
			assert.equal(album4.get('songsDirty'), false, 'Test album4 songsDirty is false');
			assert.equal(album4.get('yearDirty'), false, 'Test album4 yearDirty is false');
			assert.equal(album4.get('artistDirty'), true, 'Test album4 artistDirty is true');
			assert.equal(album4.get('nameDirty'), true, 'Test album4 nameDirty is true');
			assert.equal(album4.get('name'), 'biggest hits', 'Test album3 name is valid');

			assert.equal(song1.get('dirtyProperties.length'), 3, 'Test song1 has 3 dirty properties');
			assert.equal(song1.get('dirtyAttributes.length'), 2, 'Test song1 has 2 dirty attributes');
			assert.equal(song1.get('dirtyRelationships.length'), 1, 'Test song1 has 1 dirty relationships');
			assert.equal(song1.get('dirty'), true, 'Test song1 dirty flag is true');
			assert.equal(song1.get('hasDirtyAttribute'), true, 'Test song1 hasDirtyAttribute is true');
			assert.equal(song1.get('hasDirtyRelationship'), true, 'Test song1 hasDirtyRelationship is true');
			assert.equal(song1.get('nameDirty'), true, 'Test song1 nameDirty is true');
			assert.equal(song1.get('albumDirty'), true, 'Test song1 albumDirty is true');
			assert.equal(song1.get('name'), 'falling out', 'Test song1 name is valid');
			assert.deepEqual(song1.get('instruments'), ['guitar', 'bass', 'drums'], 'Test song1 instruments is valid 3');

			assert.equal(song2.get('dirtyProperties.length'), 3, 'Test song2 has 2 dirty properties');
			assert.equal(song2.get('dirtyAttributes.length'), 2, 'Test song2 has 1 dirty attributes');
			assert.equal(song2.get('dirtyRelationships.length'), 1, 'Test song2 has 1 dirty relationships');
			assert.equal(song2.get('dirty'), true, 'Test song2 dirty flag is true');
			assert.equal(song2.get('hasDirtyAttribute'), true, 'Test song2 hasDirtyAttribute is true');
			assert.equal(song2.get('hasDirtyRelationship'), true, 'Test song2 hasDirtyRelationship is true');
			assert.equal(song2.get('nameDirty'), true, 'Test song2 nameDirty is true');
			assert.equal(song2.get('albumDirty'), true, 'Test song2 albumDirty is true');
			assert.equal(song2.get('name'), 'longview', 'Test song2 name is valid');
			assert.deepEqual(song2.get('instruments'), ['guitar', 'piano', 'drums'], 'Test song2 instruments is valid');

			assert.equal(song3.get('dirtyProperties.length'), 3, 'Test song3 has 2 dirty properties');
			assert.equal(song3.get('dirtyAttributes.length'), 2, 'Test song3 has 1 dirty attributes');
			assert.equal(song3.get('dirtyRelationships.length'), 1, 'Test song3 has 1 dirty relationships');
			assert.equal(song3.get('dirty'), true, 'Test song3 dirty flag is true');
			assert.equal(song3.get('hasDirtyAttribute'), true, 'Test song3 hasDirtyAttribute is true');
			assert.equal(song3.get('hasDirtyRelationship'), true, 'Test song3 hasDirtyRelationship is true');
			assert.equal(song3.get('nameDirty'), true, 'Test song3 nameDirty is true');
			assert.equal(song3.get('albumDirty'), true, 'Test song3 albumDirty is true');
			assert.equal(song3.get('name'), 'come as you are', 'Test song3 name is valid');
			assert.deepEqual(song3.get('instruments'), ['guitar', 'drums'], 'Test song3 instruments is valid');

			assert.equal(artist.get('dirtyProperties.length'), 4, 'Test artist has 4 dirty properties');
			assert.equal(artist.get('dirtyAttributes.length'), 3, 'Test artist has 3 dirty attributes');
			assert.equal(artist.get('dirtyRelationships.length'), 1, 'Test artist has 1 dirty relationships');
			assert.equal(artist.get('dirty'), true, 'Test artist dirty flag is true');
			assert.equal(artist.get('hasDirtyAttribute'), true, 'Test artist hasDirtyAttribute is true');
			assert.equal(artist.get('hasDirtyRelationship'), true, 'Test artist hasDirtyRelationship is true');
			assert.equal(artist.get('nameDirty'), true, 'Test artist nameDirty is true');
			assert.equal(artist.get('genreDirty'), true, 'Test artist genreDirty is true');
			assert.equal(artist.get('countryDirty'), false, 'Test artist countryDirty is false');
			assert.equal(artist.get('albumsDirty'), true, 'Test artist albumsDirty is true');
			assert.equal(artist.get('songsDirty'), false, 'Test artist songsDirty is false');
			assert.equal(artist.get('name'), 'Fallout boy', 'Test artist name is valid');
			assert.equal(artist.get('genre'), 'Punk', 'Test artist genre is valid');
			assert.deepEqual(
				artist.get('bio'), { desc: 'something' },
'Test artist bio is valid'
			);

			artist.rollback();

			assert.equal(album1.get('dirtyProperties.length'), 0, 'Test album1 has 0 dirty properties');
			assert.equal(album1.get('dirtyAttributes.length'), 0, 'Test album1 has 0 dirty attributes');
			assert.equal(album1.get('dirtyRelationships.length'), 0, 'Test album1 has 0 dirty relationships');
			assert.equal(album1.get('dirty'), false, 'Test album1 dirty flag is false');
			assert.equal(album1.get('hasDirtyAttribute'), false, 'Test album1 hasDirtyAttribute is false');
			assert.equal(album1.get('hasDirtyRelationship'), false, 'Test album1 hasDirtyRelationship is false');
			assert.equal(album1.get('songsDirty'), false, 'Test album1 songsDirty is false');
			assert.equal(album1.get('yearDirty'), false, 'Test album1 yearDirty is false');
			assert.equal(album1.get('artistDirty'), false, 'Test album1 artistDirty is false');
			assert.equal(album1.get('nameDirty'), false, 'Test album1 nameDirty is false');
			assert.equal(album1.get('year'), null, 'Test album1 year is valid');

			assert.equal(album2.get('dirtyProperties.length'), 0, 'Test album2 has 0 dirty properties');
			assert.equal(album2.get('dirtyAttributes.length'), 0, 'Test album2 has 0 dirty attributes');
			assert.equal(album2.get('dirtyRelationships.length'), 0, 'Test album2 has 0 dirty relationships');
			assert.equal(album2.get('dirty'), false, 'Test album2 dirty flag is false');
			assert.equal(album2.get('hasDirtyAttribute'), false, 'Test album2 hasDirtyAttribute is false');
			assert.equal(album2.get('hasDirtyRelationship'), false, 'Test album2 hasDirtyRelationship is false');
			assert.equal(album2.get('songsDirty'), false, 'Test album2 songsDirty is false');
			assert.equal(album2.get('yearDirty'), false, 'Test album2 yearDirty is false');
			assert.equal(album2.get('artistDirty'), false, 'Test album2 artistDirty is false');
			assert.equal(album2.get('nameDirty'), false, 'Test album2 nameDirty is false');
			assert.equal(album2.get('name'), null, 'Test album2 name is valid');
			assert.equal(album2.get('releaseDate'), null, 'Test album2 releaseDate is valid');

			assert.equal(album3.get('dirtyProperties.length'), 0, 'Test album3 has 0 dirty properties');
			assert.equal(album3.get('dirtyAttributes.length'), 0, 'Test album3 has 0 dirty attributes');
			assert.equal(album3.get('dirtyRelationships.length'), 0, 'Test album3 has 0 dirty relationships');
			assert.equal(album3.get('dirty'), false, 'Test album3 dirty flag is false');
			assert.equal(album3.get('hasDirtyAttribute'), false, 'Test album3 hasDirtyAttribute is false');
			assert.equal(album3.get('hasDirtyRelationship'), false, 'Test album3 hasDirtyRelationship is false');
			assert.equal(album3.get('songsDirty'), false, 'Test album3 songsDirty is false');
			assert.equal(album3.get('yearDirty'), false, 'Test album3 yearDirty is false');
			assert.equal(album3.get('artistDirty'), false, 'Test album3 artistDirty is false');
			assert.equal(album3.get('nameDirty'), false, 'Test album3 nameDirty is false');
			assert.equal(album3.get('name'), null, 'Test album3 name is valid');

			assert.equal(album4.get('dirtyProperties.length'), 0, 'Test album4 has 0 dirty properties');
			assert.equal(album4.get('dirtyAttributes.length'), 0, 'Test album4 has 0 dirty attributes');
			assert.equal(album4.get('dirtyRelationships.length'), 0, 'Test album4 has 0 dirty relationships');
			assert.equal(album4.get('dirty'), false, 'Test album4 dirty flag is false');
			assert.equal(album4.get('hasDirtyAttribute'), false, 'Test album4 hasDirtyAttribute is false');
			assert.equal(album4.get('hasDirtyRelationship'), false, 'Test album4 hasDirtyRelationship is false');
			assert.equal(album4.get('songsDirty'), false, 'Test album4 songsDirty is false');
			assert.equal(album4.get('yearDirty'), false, 'Test album4 yearDirty is false');
			assert.equal(album4.get('artistDirty'), false, 'Test album4 artistDirty is false');
			assert.equal(album4.get('nameDirty'), false, 'Test album4 nameDirty is false');
			assert.equal(album4.get('name'), null, 'Test album4 name is valid');

			assert.equal(song1.get('dirtyProperties.length'), 0, 'Test song1 has 0 dirty properties');
			assert.equal(song1.get('dirtyAttributes.length'), 0, 'Test song1 has 0 dirty attributes');
			assert.equal(song1.get('dirtyRelationships.length'), 0, 'Test song1 has 0 dirty relationships');
			assert.equal(song1.get('dirty'), false, 'Test song1 dirty flag is false');
			assert.equal(song1.get('hasDirtyAttribute'), false, 'Test song1 hasDirtyAttribute is false');
			assert.equal(song1.get('hasDirtyRelationship'), false, 'Test song1 hasDirtyRelationship is false');
			assert.equal(song1.get('nameDirty'), false, 'Test song1 nameDirty is false');
			assert.equal(song1.get('albumDirty'), false, 'Test song1 albumDirty is false');
			assert.equal(song1.get('name'), null, 'Test song1 name is valid');
			assert.equal(song1.get('instruments'), null, 'Test song1 instruments is valid 2');

			assert.equal(song2.get('dirtyProperties.length'), 0, 'Test song2 has 0 dirty properties');
			assert.equal(song2.get('dirtyAttributes.length'), 0, 'Test song2 has 0 dirty attributes');
			assert.equal(song2.get('dirtyRelationships.length'), 0, 'Test song2 has 0 dirty relationships');
			assert.equal(song2.get('dirty'), false, 'Test song2 dirty flag is false');
			assert.equal(song2.get('hasDirtyAttribute'), false, 'Test song2 hasDirtyAttribute is false');
			assert.equal(song2.get('hasDirtyRelationship'), false, 'Test song2 hasDirtyRelationship is false');
			assert.equal(song2.get('nameDirty'), false, 'Test song2 nameDirty is false');
			assert.equal(song2.get('albumDirty'), false, 'Test song2 albumDirty is false');
			assert.equal(song2.get('name'), null, 'Test song2 name is valid');
			assert.equal(song2.get('instruments'), null, 'Test song2 instruments is valid');

			assert.equal(song3.get('dirtyProperties.length'), 0, 'Test song3 has 0 dirty properties');
			assert.equal(song3.get('dirtyAttributes.length'), 0, 'Test song3 has 0 dirty attributes');
			assert.equal(song3.get('dirtyRelationships.length'), 0, 'Test song3 has 0 dirty relationships');
			assert.equal(song3.get('dirty'), false, 'Test song3 dirty flag is false');
			assert.equal(song3.get('hasDirtyAttribute'), false, 'Test song3 hasDirtyAttribute is false');
			assert.equal(song3.get('hasDirtyRelationship'), false, 'Test song3 hasDirtyRelationship is false');
			assert.equal(song3.get('nameDirty'), false, 'Test song3 nameDirty is false');
			assert.equal(song3.get('albumDirty'), false, 'Test song3 albumDirty is false');
			assert.equal(song3.get('name'), null, 'Test song3 name is valid');
			assert.equal(song3.get('instruments'), null, 'Test song3 instruments is valid');

			assert.equal(artist.get('dirtyProperties.length'), 0, 'Test artist has 0 dirty properties');
			assert.equal(artist.get('dirtyAttributes.length'), 0, 'Test artist has 0 dirty attributes');
			assert.equal(artist.get('dirtyRelationships.length'), 0, 'Test artist has 0 dirty relationships');
			assert.equal(artist.get('dirty'), false, 'Test artist dirty flag is false');
			assert.equal(artist.get('hasDirtyAttribute'), false, 'Test artist hasDirtyAttribute is false');
			assert.equal(artist.get('hasDirtyRelationship'), false, 'Test artist hasDirtyRelationship is false');
			assert.equal(artist.get('nameDirty'), false, 'Test artist nameDirty is false');
			assert.equal(artist.get('genreDirty'), false, 'Test artist genreDirty is false');
			assert.equal(artist.get('countryDirty'), false, 'Test artist countryDirty is false');
			assert.equal(artist.get('albumsDirty'), false, 'Test artist albumsDirty is false');
			assert.equal(artist.get('songsDirty'), false, 'Test artist songsDirty is false');
			assert.equal(artist.get('name'), null, 'Test artist name is valid');
			assert.equal(artist.get('genre'), null, 'Test artist genre is valid');
			assert.equal(artist.get('bio'), null, 'Test artist bio is valid');

		});
	});

	test('isDirty', function(assert) {
		run(() => {
			const store = this.owner.lookup('service:store');
			const album = store.createRecord('album');
			const album2 = store.createRecord('album');
			const artist = store.createRecord('artist');
	
			album.set('name', 'bullocks');
			assert.equal(album.isDirty(), true, 'Test isDirty is true when attribute is dirty');
			album.set('name', null);
			assert.equal(album.isDirty(), false, 'Test isDirty is false when attribute is not dirty');

			album2.set('artist', artist);
			artist.set('name', 'sex pistols');
			assert.equal(album2.isDirty(), true, 'Test isDirty is true when relationship is dirty');
			artist.set('name', null);
			assert.equal(album2.isDirty(), false, 'Test isDirty is false when relationship is not dirty');
		});
	});
});
