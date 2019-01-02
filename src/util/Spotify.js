let token;
const clientId = 'b9a0fb88990941afa4dd9cb62c3a24f9';
const redirectURI = 'http://localhost:3000';

const Spotify = {
  getAccessToken(){
    if (token){
      return token;
    }
    else
    {
      const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresMatch = window.location.href.match(/expires_in=([^&]*)/);
      if (tokenMatch && expiresMatch){
        token = tokenMatch[1];
        const expiresIn = parseInt(expiresMatch[1],10);
        window.setTimeout(() => token='',expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return token;
      }
      else{
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-private&redirect_uri=${redirectURI}`;
      }

    }
  },
  search(term) {
    Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {Authorization: `Bearer ${token}`}
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }))
        }
      )
  },
  savePlaylist(name, arr) {
    Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${token}`};
    let userID = '';
    let playlistID ='';

    if (name !=='' && arr!=='') {
      return fetch(`https://api.spotify.com/v1/me`, {headers: headers}
      ).then(response => {
        if (response.ok) {
          return response.json();
        }
        else {
          console.log('failed get userID');
        }
      }).then(jsonResponse => {
        if (jsonResponse.id) {
          userID = jsonResponse.id;
        }
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
          {headers: headers, method: 'POST', body: JSON.stringify({name: name})}
        ).then(response => {
          if (response.ok) {
            return response.json();
          }
          else {
            console.log('failed create new playlist');
          }
        }).then(jsonResponse => {
          if (jsonResponse.id) {
            playlistID = jsonResponse.id;
          }
          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
        {headers: headers, method: 'POST', body: JSON.stringify({uris: arr})});
       });
     });
   }
 }
};

export default Spotify;
