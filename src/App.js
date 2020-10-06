import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

function App() {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () => {
      // Pegando a lista TOTAL
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Pegando o Featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1 ));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    loadAll();
  },[]);

  useEffect(()=>{
    const scrolllistener = () => {
      if(window.scrollY > 30) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrolllistener);

    return () => {
      window.removeEventListener('scroll', scrolllistener);
    }
  },[])

  return (
    <div className="page">

      <Header black={blackHeader}></Header>

    {featuredData && <FeaturedMovie item={featuredData}></FeaturedMovie> }

      <section className="lists">
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items}></MovieRow>
        ))}
      </section>

      <footer>
        Réplica feita por <strong>Douglas Cidral</strong>, para fins didáticos <br/>
        Direitos de imagem para <span>Netflix</span> <br/>
        Dados pegos do site Themoviedb.org
      </footer>

    </div>
  );
}

export default App;
