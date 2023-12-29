import React, { useEffect, useState } from 'react';
import { getMoviesData } from '../../services/movies';
import GenreFilter from '../../components/genreFilter';
import Movies from '../movies';
import "./index.css"

const MoviesList = () => {

    const [currentYear, setCurrentYear] = useState(2012)
    const [moviesData, setMoviesData] = useState([])
    const [allMoviesData, setAllMoviesData] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const [selectedGenre, setSelectedGenre] = useState({id:0, name: "All"})

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    useEffect(() => {
        const handleScroll = (e) => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const upOffset = 150;
            const downOffSet = 100
            if (scrollTop < upOffset && !isFetching && scrollTop < lastScrollTop && !isFetching) {
                if(currentYear-1 === 2011) {
                    setCurrentYear(2010)
                } else {
                    setCurrentYear(currentYear-1)
                }
            }
            if (scrollTop + windowHeight >= documentHeight - downOffSet && !isFetching && scrollTop > lastScrollTop) {
                setCurrentYear(currentYear+1)
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, [isFetching, moviesData]);

    useEffect(()=>{
        getMoviesRecords(currentYear)
    },[currentYear])

    useEffect(()=>{
        if(allMoviesData.length > 0) {
            genreFilter(selectedGenre?.id)
        }
    },[selectedGenre, allMoviesData])

    useEffect(()=>{
        setTimeout(()=>{
            setCurrentYear(2011)
        },500)
    },[])
    
    const getMoviesRecords = async (year) => {
        if(!moviesData[year]) {
            try {
                setIsFetching(true)
                const res = await getMoviesData(year)
                const records = await res.json()
                const movies = records.results.slice(0,20)
                if(year >= 2012) {
                    setAllMoviesData((moviesData) => [
                        ...moviesData,
                        {[year]: movies},
                    ])
                } else {
                    var old_height = document.documentElement.scrollHeight;
                    var old_scroll = window.scrollY;
                    setAllMoviesData((moviesData) => [
                        {[year]: movies},
                        ...moviesData
                    ])
                    setTimeout(()=>{
                        window.scrollTo({
                            top:(old_scroll + document.documentElement.scrollHeight - old_height) - 130
                        })
                    },20)
                }           
            } catch (error) {
                console.log("err",error)
            } finally {
                setIsFetching(false)
            }
        }
    }

    const genreFilter = (genreId) => {
        if(genreId) {
            const newArr = []
            for (let index = 0; index < allMoviesData.length; index++) {
                const element = allMoviesData[index];
                const movYear = Object.keys(element)[0]
                const filteredArr = element[movYear].filter((data)=>{
                    return data.genre_ids.includes(genreId)
                })
                newArr.push({
                    [movYear]:filteredArr 
                })           
            }
            setMoviesData(newArr)
        } else {
            setMoviesData(allMoviesData)
        }
    }
  return (
    <>
    <GenreFilter selectedGenre={selectedGenre} setSelectedGenre={(data)=>setSelectedGenre(data)}/>
    <div className='movies-wrap'>
      {
        moviesData.map((movData, idx)=>{
            const movYear = Object.keys(movData)[0]
            return (
                    <Movies
                        movieYear={movYear}
                        movieList={movData[movYear]}
                        key={`${movYear}${idx}`}
                    />
            )
        })
      }
    </div>
    </>
  );
}

export default MoviesList;
