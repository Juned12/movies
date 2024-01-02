import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { getMoviesData } from '../../services/movies';
import GenreFilter from '../../components/genreFilter';
import Movies from '../movies';
import "./index.css"

const MoviesList = () => {

    const [currentYear, setCurrentYear] = useState(2012)
    const [allMoviesData, setAllMoviesData] = useState([])
    const [moviesAfter2011, setMoviesAfter2011] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const [selectedGenre, setSelectedGenre] = useState({ id: 0, name: "All" })

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    useEffect(() => {

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isFetching]);

    const handleScroll = (e) => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const upOffset = 150;
        const downOffSet = 100

        if (scrollTop < upOffset && !isFetching && scrollTop < lastScrollTop && !isFetching) {
            if (currentYear === 2012) {
                setCurrentYear(currentYear - 2)
            } else {
                setCurrentYear(currentYear - 1)
            }
        }
        if (scrollTop + windowHeight >= documentHeight - downOffSet && !isFetching && scrollTop > lastScrollTop) {
            if (currentYear === 2011) {
                setCurrentYear(currentYear + 2)
            } else if(currentYear !== 2023){
                setCurrentYear(currentYear + 1)
            }
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    useEffect(() => {
        getMoviesRecords(currentYear)
    }, [currentYear])


    useEffect(() => {
        setTimeout(() => {
            setCurrentYear(2011)
        }, 50)
    }, [])


    function fromHTML(html, trim = true) {
        // Process the HTML string.
        html = trim ? html : html.trim();
        if (!html) return null;

        // Then set up a new template element.
        const template = document.createElement('template');
        template.innerHTML = html;
        const result = template.content.children;

        // Then return either an HTMLElement or HTMLCollection,
        // based on whether the input HTML had one or more roots.
        if (result.length === 1) return result[0];
        return result;
    }

    const getMoviesRecords = async (year) => {
            try {
                setIsFetching(true)
                const res = await getMoviesData(year)
                const records = await res.json()
                const movies = records.results
                setAllMoviesData((moviesData)=> [
                    ...moviesData,
                    { [year]: movies },
                ])
                if (year >= 2012) {
                    setMoviesAfter2011((moviesData) => [
                        ...moviesData,
                        { [year]: movies },
                    ])
                } else {
                    const firstMovie = document.querySelectorAll('.first-node')[0];
                    if (firstMovie && currentYear) {
                        const clonedMsg = <Movies
                            movieYear={year}
                            movieList={movies}
                            selectedGenreId={selectedGenre?.id}

                        />
                        const newNode = fromHTML(ReactDOMServer.renderToString(clonedMsg))
                        document.body.insertBefore(newNode, document.body.firstChild);
                        document.documentElement.scrollTop = document.body.scrollTop = firstMovie.offsetTop - 130;
                    }
                }
            } catch (error) {
                const errorInfoDiv = document.createElement('div')
                errorInfoDiv.className = 'error-wrap'
                errorInfoDiv.innerText = "Something went wrong"
                document.body.insertBefore(errorInfoDiv, document.body.firstChild);
                console.log("err", error)
            } finally {
                setIsFetching(false)
            }
    }

    const getMoviesList = (year) => {
        for (let index = 0; index < allMoviesData.length; index++) {
            const movieYear = Object.keys(allMoviesData[index])[0]
            if(movieYear == year) {
                return allMoviesData[index][movieYear]
            }
        }
        return []
    }

    useEffect(()=>{
        if(selectedGenre?.id) {
            updateDynamicallayCreatedNodes(selectedGenre)
        }
    },[selectedGenre])

    const updateDynamicallayCreatedNodes = (selectedGenre) => {
        const noOfYears = 2012 - currentYear
        if(noOfYears > 0) {
            for (let index = 1; index <= noOfYears; index++) {
                const year = 2012 - index
                const element = document.getElementById(year);
                if(element) {
                    const newMovie = <Movies
                        movieYear={year}
                        movieList={getMoviesList(year)}
                        selectedGenreId={selectedGenre?.id}
                    />
                    const newNode = fromHTML(ReactDOMServer.renderToString(newMovie))
                    const parentElement = element.parentElement;
                    parentElement.replaceChild(newNode, element);
                    element.remove()
                }
                
            }
        }
        
    }
    
    return (
        <>
            <GenreFilter selectedGenre={selectedGenre} setSelectedGenre={(data) => setSelectedGenre(data)} />
            <div className='movies-wrap'>
                {
                    moviesAfter2011.map((movData, idx) => {
                        const movYear = Object.keys(movData)[0]
                        return (
                            <Movies
                                movieYear={movYear}
                                movieList={movData[movYear]}
                                key={`${movYear}${idx}`}
                                selectedGenreId={selectedGenre?.id}
                            />
                        )
                    })
                }
            </div>
        </>
    );
}

export default MoviesList;
