import React from 'react';
import "./index.css"

const BASE_IMG_URL = "https://image.tmdb.org/t/p/original"
const MoviesList = ({
    movieYear,
    movieList
}) => {
  return (
    <div>
        <div className='movie-year-text'>
            {movieYear}
        </div>
        <div className='movie-list-wrap'>
            {
                movieList.map((movData)=>{
                    return (
                        <div className='movie-card-wrap' key={movData?.id}>
                            <img src={`${BASE_IMG_URL}${movData?.poster_path}`} alt="" className='movie-poster' loading='lazy'/>
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

export default MoviesList;
