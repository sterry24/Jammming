import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

// const playlistName ='any_string';
// const playlistTracks = [
//   {
//     name:'name',
//     artist:'artist',
//     album:'album',
//     id:'id',
//   },
//   {
//     name:'name2',
//     artist:'artist2',
//     album:'album2',
//     id:'id2',
//   },
// ];

class App extends Component {
  constructor(props){
    super(props);
    this.state = {searchResults:[],
                  playlistName: 'New Playlist',
                  playlistTracks: [],
                 };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  search(term){
    Spotify.search(term).then(searchResults => this.setState({
      searchResults:searchResults
    }));
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({searchResults:[],playlistTracks:[]});
    this.updatePlaylistName('New Playlist');
  }

  updatePlaylistName(name){
    this.setState({playlistName:name});
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(aTrack => aTrack.id === track.id)){
      return;
    }
    let tracks = this.state.playlistTracks;
    tracks.push(track);
    this.setState({playlistTracks:tracks});
  }

  removeTrack(track){
    let tracks = this.state.playlistTracks.filter(rTrack => rTrack.id !== track.id);
    this.setState({playlistTracks:tracks});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
          <SearchResults
            searchResults={this.state.searchResults}
            onAdd={this.addTrack}
          />
          <Playlist
            playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}
          />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
