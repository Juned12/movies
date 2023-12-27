import React, { useEffect, useState } from 'react';
import { getGenreNames } from '../../services/genere';
import "./index.css";

const GenreFilter = () => {

    const [allGenreOptions, setAllGenreOptions] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState({id:0, name: "All"})

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
    },[])

  return (
    <div className='gener-filter-wrap'>
            {
                allGenreOptions.map((genData)=>{
                    return (
                            <div className={
                                selectedGenre === genData?.name ? 
                                'genre-name active' :
                                'genre-name inactive'
                                } 
                                onClick={()=> setSelectedGenre(genData?.name)} 
                                key={genData?.id}
                            >
                                {genData?.name}
                            </div>
                    )
                })
            }
    </div>
  );
}

export default GenreFilter;
