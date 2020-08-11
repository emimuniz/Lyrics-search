import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import './App.css';

function App() {
  const {register, handleSubmit, errors } = useForm();

  const [dataSongs, setDataSongs] = useState([]);
  const [data, setData] = useState([]);
  const [music, setMusic] = useState([]);
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [toogle, setToogle] = useState(false);
  
  const apiUrl = `https://api.lyrics.ovh`;

  const fetchData = async url => {
    const response = await fetch(url)
    return await response.json();
  }

  const fetchLyrics = async (artist, title) => {
    const data = await fetchData(`${apiUrl}/v1/${artist}/${title}`)
    const lyrics = data.lyrics.split(/\s*\r\n|\r|\n\s*/g);

    setMusic(lyrics);
    setArtist(artist);
    setTitle(title);
    setToogle(true);
  }

  const getMoreSongs = async url => {
    const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`);
    setDataSongs(data.data);
    setData(data);
  }
  
  const fetchSongs = async term => {
    const data = await fetchData(`${apiUrl}/suggest/${term}`);
    setDataSongs(data.data);
    setData(data);
  }
  
  function onSubmit({ busca }) {
    fetchSongs(busca);
    setMusic([]);
  }

  const lyrics = (
    <>
      <h2><strong>{title}</strong> - {artist}</h2>
      {music.map((row,index) => <p key={index} className="lyrics">{row}</p>)}
      
    </>
  )
  const rowns = dataSongs.map((item, index) => {
    return (
      <li className="song" key={index}>
        <span className="song-artist"><strong>{item.artist.name}</strong> - {item.title}</span>
        <button className="btn" onClick={() => fetchLyrics(item.artist.name, item.title)}>Ver letra</button>
      </li>
    )
  });
    
  const button = data.prev && data.next ? (
    <>
      <button className="btn" onClick={() => getMoreSongs(data.prev)}>Anterior</button>
      <button className="btn" onClick={() => getMoreSongs(data.next)}>Proximo</button>
    </>
    ) : data.next ? (
      <button className="btn" onClick={() => getMoreSongs(data.next)}>Próximo</button>
      ) : data.prev ? (
        <button className="btn" onClick={() => getMoreSongs(data.prev)}>Anterior</button>
      ) : '';

  return (
    <div className="App">
      <header>
        <h1>Busca Letras</h1>
        <form onSubmit={handleSubmit(onSubmit)} id="form">
          <input 
            name="busca"
            type="text"
            placeholder="Insira o nome do artista ou da música..." ref={register({ required: true })}
          />
          {errors.busca &&  <li className="warning-message">Por favor, digite um termo valido</li>}
          <button type="submit">Buscar</button>
        </form>
      </header>

      <ul id="songs-container" className="songs-container songs">
        {music.length === 0 ? rowns : lyrics}
      </ul>
      <div id="prev-and-next-container" className="prev-and-next-container">
        {!toogle ? button: ''}
      </div>
    </div>
  );
}

export default App;
