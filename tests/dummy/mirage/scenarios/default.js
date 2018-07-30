export default function(server) {


  const songs = server.createList('song', 10);
  const albums = server.createList('album', 10);
  server.createList('artist', 10, { songs, albums });

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  // server.createList('post', 10);
}
