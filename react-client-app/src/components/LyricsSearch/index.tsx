import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [trackInfo, setTrackInfo] = useState(null);
  const [lyrics, setLyrics] = useState('');

  const searchTrack = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/lyrics/search`, {
        params: { track_name: trackName, artist_name: artistName }
      });
      const trackId = response.data.track_id;
      setTrackInfo(response.data);

      const lyricsResponse = await axios.get(`http://localhost:5000/lyrics`, {
        params: { track_id: trackId }
      });
      setLyrics(lyricsResponse.data);
    } catch (error) {
      console.error('Error searching track:', error);
    }
  };

  return (
    <div>
      <h1>Search Track and Lyrics</h1>
      <input type="text" placeholder="Enter track name" value={trackName} onChange={(e) => setTrackName(e.target.value)} />
      <input type="text" placeholder="Enter artist name" value={artistName} onChange={(e) => setArtistName(e.target.value)} />
      <button onClick={searchTrack}>Search</button>

      {trackInfo && (
        <div>
          <h2>Track Info</h2>
          <p>Track Name: {trackInfo.track_name}</p>
          <p>Artist Name: {trackInfo.artist_name}</p>
        </div>
      )}

      {lyrics && (
        <div>
          <h2>Lyrics</h2>
          <pre>{lyrics}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
