import React, { useEffect, useState } from 'react';
import { getGenreNames } from '../../services/genere';
import "./index.css";

const GenreFilter = ({
    selectedGenre,
    setSelectedGenre
}) => {

    const [allGenreOptions, setAllGenreOptions] = useState([]);

    useEffect(()=>{
        const getAllGenreName = async () => {
            try {
                const res = await getGenreNames()
                const resData = await res.json()
                setAllGenreOptions([selectedGenre,...resData?.genres])   
            } catch (err) {
                console.log("err",err)
            }  
        }
        getAllGenreName()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  return (
    <div className='gener-filter-wrap'>
        <div className='genre-filter-content'>
            {
                allGenreOptions.map((genData)=>{
                    return (
                            <div className={
                                selectedGenre === genData ? 
                                'genre-name active' :
                                'genre-name inactive'
                                } 
                                onClick={()=> setSelectedGenre(genData)} 
                                key={genData?.id}
                            >
                                {genData?.name}
                            </div>
                    )
                })
            }
        </div>
    </div>
  );
}

export default GenreFilter;
