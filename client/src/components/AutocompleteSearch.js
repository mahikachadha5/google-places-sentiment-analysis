import React, { useEffect } from 'react';
import '../styles.css'
import searchIcon from '../images/searchIcon.png';


const AutocompleteSearch = ({ onPlaceSelected }) => {
    useEffect(() => {
        const initAutocomplete = () => {
            const input = document.getElementById('search-input')
            
            const autocomplete = new window.google.maps.places.Autocomplete(input, {
                fields: ['place_id', 'name', 'formatted_address']
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();

                if (place.place_id) {
                    console.log("Place ID:", place.place_id)
                    console.log("Place Name:", place.name)
                    console.log("Place Address:", place.formatted_address)

                    onPlaceSelected(place);
                    console.log("Place Selected from autocomplete:", place);

                }
            });
        };
        initAutocomplete();
    }, [onPlaceSelected]);

    return (
        <div className='center-container'>
            <div className='search-container'>
                <img src={searchIcon} className='search-icon' alt='Search Icon'/>
                <input 
                    id='search-input'
                    type='text'
                    placeholder='Search for a place'
                />
            </div>
        </div>
        

    )
}

export default AutocompleteSearch;