import React, { useState} from 'react'
import '../styles.css'
import StarRatings from 'react-star-ratings';

const PlaceDetails = ({ name, address, rating, reviews }) => {
    return (
        <div className='place-details'>

            {reviews && reviews.length > 0 ? (
                <div>
                    <h2>Place Overview</h2>
                    <div className='place-details-info'>
                        <h3 className='name-label'>Name</h3>
                        <p>{name}</p>
                        <h3 className='address-label'>Address</h3>
                        <p>{address}</p>
                        <h3 className='rating-label'>Average Rating</h3>
                        <StarRatings
                            rating={rating}
                            starRatedColor="#FFE194"
                            starEmptyColor='#B1B1B1'
                            numberOfStars={5}
                            starDimension='26px'
                            starSpacing='2px'
                        />
                    </div>
                </div>
            ) : (
                <p>Sorry, we don't have information on this place yet.</p>
            )}
        </div>
    )
}

export default PlaceDetails;