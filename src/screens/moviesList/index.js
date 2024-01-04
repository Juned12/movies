import React, { useEffect, useState, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { fetchMoviesData } from '../../services/movies';
import GenreFilter from '../../components/genreFilter';
import Movies from '../movies';
import "./index.css"

const MoviesList = () => {

    const [allMoviesData, setAllMoviesData] = useState([])
    const [moviesAfter2011, setMoviesAfter2011] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const [selectedGenre, setSelectedGenre] = useState({ id: 0, name: "All" })
    const [yearsArray, setYearsArray] = useState([2012])

    let lastScrollTopRef = useRef(window.pageYOffset || document.documentElement.scrollTop);

    useEffect(() => {

        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const upOffset = 150;
            const downOffSet = 150
            const tempArr = [...yearsArray]
            const lastScrollTop = lastScrollTopRef.current
            // Scroll comparison to check if user is scrolling up and down
            if (scrollTop < upOffset && !isFetching && (scrollTop < lastScrollTop) && !isFetching) {
                const firstYear = tempArr[0]
    
                tempArr.unshift(firstYear-1)
                setYearsArray(tempArr)
            }
            if ((scrollTop + windowHeight >= documentHeight - downOffSet) && !isFetching && (scrollTop > lastScrollTop)) {
                const lastYear = tempArr[tempArr.length - 1]
                if(lastYear !== 2023) {
                    tempArr.push(lastYear+1)
                    setYearsArray(tempArr)
                }
            }
            lastScrollTopRef.current = scrollTop <= 0 ? 0 : scrollTop;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetching]);

    

    useEffect(()=>{
        // Delay and add 2011 so 2012 gets mounted on DOM
        setTimeout(()=>{
            setYearsArray([2011, 2012])
        },50)
    },[])

    useEffect(()=>{
        getMoviesData(yearsArray)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[yearsArray])

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

    const dataAPI = async (year) => {
        const res = await fetchMoviesData(year)
        const records = await res.json()
        return records.results
    }

    const getMoviesData = async (yearsArr) => {
        // Get Movies list and add update it to dom
        try {
            setIsFetching(true)
            const firstMovie = document.querySelectorAll('.first-node')[0];
            const idx2012 = yearsArr.indexOf(2012)
            const movies = [...moviesAfter2011]
            for (let index = yearsArr.length-1; index >= idx2012; index--) {
                const movieElement = document.getElementById(yearsArr[index])
                if(!movieElement) {
                    const moviesRes = await dataAPI(yearsArr[index])
                    movies.push({ [yearsArr[index]]: moviesRes }) 
                }   
            }
            if(movies.length !== moviesAfter2011.length) {
                setMoviesAfter2011([...movies])
            }

            for (let index = 0; index < idx2012; index++) {
                const movieElement = document.getElementById(yearsArr[index])
                if(!movieElement && firstMovie) {
                    const loadingNode = fromHTML("<div class='loading-text' id='loading-top'>Fetching More Movies...</div>")
                    document.body.insertBefore(loadingNode, document.body.firstChild);
                    const moviesRes = await dataAPI(yearsArr[index])
                    setAllMoviesData([
                        ...allMoviesData,
                        { [yearsArr[index]]: moviesRes }
                    ])
                    const clonedMsg = <Movies
                            movieYear={yearsArr[index]}
                            movieList={moviesRes}
                            selectedGenreId={selectedGenre?.id}
                        />
                    const newNode = fromHTML(ReactDOMServer.renderToString(clonedMsg))
                    // Prepend to avoid shifting scroll to top 
                    document.body.insertBefore(newNode, document.body.firstChild);
                    // setting the srcoll to the last first element in DOM
                    document.documentElement.scrollTop = document.body.scrollTop = firstMovie.offsetTop - 180;
                }   
            }
        } finally {
            const loadingElem = document.getElementById('loading-top')
            if(loadingElem) {
                loadingElem.remove()
            }
            setIsFetching(false)
        }
    }

    const getMoviesList = (year) => {
        for (let index = 0; index < allMoviesData.length; index++) {
            const movieYear = Object.keys(allMoviesData[index])[0]
            if(Number(movieYear) === year) {
                return allMoviesData[index][movieYear]
            }
        }
        return []
    }

    useEffect(()=>{
        updateDynamicallyCreatedNodes(selectedGenre)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedGenre])

    const updateDynamicallyCreatedNodes = (selectedGenre) => {
        const idx2012 = yearsArray.indexOf(2012)
        const noOfYears = yearsArray.slice(0,idx2012)
        if(noOfYears.length > 0) {
            for (let index = 0; index <= noOfYears.length-1; index++) {
                const year = noOfYears[index]
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
                {
                    moviesAfter2011.map((movData, idx) => {
                        const movYear = Object.keys(movData)[0]
                        return (
                            <React.Fragment key={movYear}>
                                <Movies
                                    movieYear={movYear}
                                    movieList={movData[movYear]}
                                    key={`${movYear}${idx}`}
                                    selectedGenreId={selectedGenre?.id}
                                />
                                {
                                    isFetching &&
                                    <div className='loading-text'>
                                        Fetching More Movies...
                                    </div>
                                }
                            </React.Fragment>
                        )
                    })
                }
        </>
    );
}

export default MoviesList;
