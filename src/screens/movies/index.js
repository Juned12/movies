import React, { useEffect, useState } from 'react';
import { getMoviesData } from '../../services/movies';
import MoviesList from '../moviesList';
import "./index.css"

const Movies = () => {

    const [currentYear, setCurrentYear] = useState(2012)
    const [moviesData, setMoviesData] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const [isLoadingTop, setIsLoadingTop] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const bottomOffset = document.body.offsetHeight - window.innerHeight;
            if ((window.scrollY <= 200 ) && !isFetching && !isLoadingTop) {
                setIsLoadingTop(true)
                setCurrentYear(currentYear-1)
            } 
            if((bottomOffset - window.scrollY <= 200) && !isFetching && !isLoadingBottom) {
                setIsLoadingBottom(true)
                setCurrentYear(currentYear+1)
            }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, [isFetching]);

    useEffect(()=>{
        getMoviesRecords(currentYear)
    },[currentYear])

    useEffect(()=>{
        if(isLoadingBottom || isLoadingTop) {
            setIsLoadingBottom(false)
            setIsLoadingTop(false)
        }
    },[moviesData])

    

    const getMoviesRecords = async (year) => {
        if(!moviesData[year]) {
            try {
                setIsFetching(true)
                const res = await getMoviesData(year)
                const records = await res.json()
                const movies = records.results.slice(0,10)
                if(year >= 2012) {
                    setMoviesData([
                        ...moviesData,
                        {[year]: movies},
                    ])
                } else {
                    setMoviesData([
                        {[year]: movies},
                        ...moviesData
                    ])
                }
                
            } catch (error) {
                console.log("err",error)
            } finally {
                setIsFetching(false)
            }
        }
    }
  return (
    <div className='movies-wrap'>
        {
            isFetching &&
            <h2>Fetching Please wait</h2>
        }
      {
        moviesData.map((movData, idx)=>{
            const movYear = Object.keys(movData)[0]
            return (
                    <MoviesList
                        movieYear={movYear}
                        movieList={movData[movYear]}
                        key={`${movYear}${idx}`}
                    />
            )
        })
      }
    </div>
  );
}

export default Movies;
