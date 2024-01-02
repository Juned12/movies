import React, { useEffect, useState } from 'react';
import "./index.css"

const BASE_IMG_URL = "https://image.tmdb.org/t/p/original"

const Movies = ({
    movieYear,
    movieList,
    selectedGenreId,
}) => {

    const getFilteredMovies = (genreId) => {
        if(genreId) {
            const filteredArr = movieList.filter((data)=>{
                return data.genre_ids?.includes(genreId)
            })
            return filteredArr
        } else {
            return movieList
        }
    }
    return (
        <div className='first-node' id={movieYear}>
            <div className='movie-year-text'>
                {movieYear}
            </div>
            <div className='movie-list-wrap'>
                {
                    getFilteredMovies(selectedGenreId).map((movData) => {
                        return (
                            <div className='movie-card-wrap' key={movData?.id}>
                                <img src={`${BASE_IMG_URL}${movData?.poster_path}`} alt="" className='movie-poster' loading='lazy' />
                                <div className='movie-name'>
                                    {movData?.original_title}
                                    <div>
                                        {movData?.vote_average}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Movies;
