
![Travis (.org)](https://img.shields.io/travis/justin.poirier@gmail.com/ember-dirtier.svg)


ember-dirtier
==============================================================================

This addon extends ember-data by providing dirty tracking for the following:

* Nested arrays
* Nested object
* Relationships
* Transform types

In addition, it adds the following properties and functions to the DS.model class:

### Properties

* `dirty`
* `dirtyAttributes`
* `dirtyRelationships`
* `dirtyProperties`
* `hasDirtyRelationship`
* `hasDirtyAttribute`
* `${propertyName}Dirty`

### Functions

* `isDirty()`
* `rollback()`

Installation
------------------------------------------------------------------------------

```
ember install ember-dirtier
```


Properties
------------------------------------------------------------------------------

### dirty

Returns true if any attribute or relationship is dirty, otherwise returns false.

```
const artist = this.get('store').createRecord('artist');

artist.set('name', 'john');

debug(artist.get('dirty)); // true
```
### dirtyAttributes

Returns an array of dirty attributes

```
const artist = this.get('store').createRecord('artist');

artist.set('name', 'john');
artist.set('genre', 'country');

debug(artist.get('dirtyAttributes')); // ['genre', 'name']
```

### dirtyRelationships

Returns an array of dirty relationships

```
const artist = this.get('store').createRecord('artist');
const album = this.get('store').createRecord('album');
const albums = A([]);

album.set('name', 'country road');
albums.pushObject(album);

artist.set('name', 'john');
artist.set('genre', 'country');
artist.set('albums', albums);

debug(artist.get('dirtyRelationships')); // ['albums']
```

### dirtyProperties

Returns an array of dirty properties

```
const artist = this.get('store').createRecord('artist');
const album = this.get('store').createRecord('album');
const albums = A([]);

album.set('name', 'country road');
albums.pushObject(album);

artist.set('name', 'john');
artist.set('genre', 'country');
artist.set('albums', albums);

debug(artist.get('dirtyProperties')); // ['albums', 'genre', 'name']
```

### hasDirtyAttribute

Returns true if at least one attribute is dirty, otherwise returns false.

```
const artist = this.get('store').createRecord('artist');

artist.set('name', 'john');
artist.set('genre', 'country');

debug(artist.get('hasDirtyAttribute')); // true
```

### hasDirtyRelationship

Returns an array of dirty properties

```
const artist = this.get('store').createRecord('artist');
const album = this.get('store').createRecord('album');
const albums = A([]);

album.set('name', 'country road');
albums.pushObject(album);

artist.set('name', 'john');
artist.set('genre', 'country');
artist.set('albums', albums);

debug(artist.get('hasDirtyRelationship')); // true
```

### ${propertyName}Dirty

Returns true if a property is dirty, otherwise returns false. 

This is useful when you want to display a visual indicator when a field has been touched.

```
const artist = this.get('store').createRecord('artist');
const album = this.get('store').createRecord('album');
const albums = A([]);

album.set('name', 'country road');
albums.pushObject(album);

artist.set('name', 'john');
artist.set('genre', 'country');
artist.set('albums', albums);

debug(artist.get('nameDirty')); // true
debug(artist.get('genreDirty')) // true
debug(artist.get('albumsDirty')) // true
```
## Functions

### isDirty()

Returns true if model is dirty, otherwise returns false.

```
const artist = this.get('store').createRecord('artist');

artist.set('name', 'john');

debug(artist.isDirty()); // true
```
### rollback()

Rollback the model. This will rollback the model and all its associated relationships.

```
const artist = this.get('store').createRecord('artist');
const album = this.get('store').createRecord('album');
const albums = A([]);

album.set('name', 'country road');
albums.pushObject(album);

artist.set('name', 'john');
artist.set('genre', 'country');
artist.set('albums', albums);

artist.rollback();

debug(artist.get('name')); // undefined
debug(artist.get('genre')); // undefined
debug(album.get('name')); // undefined
```

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-dirtier`
* `npm install`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
