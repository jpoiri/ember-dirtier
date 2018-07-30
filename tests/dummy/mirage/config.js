export default function() {
	this.namespace = 'api';

	this.get('/albums', (schema) => {
		return schema.albums.all();
	});

	this.get('/artists', (schema) => {
		return schema.artists.all();
	});

	this.get('/songs', (schema) => {
		return schema.songs.all();
  });
  
}
