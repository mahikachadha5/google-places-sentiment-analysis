import React from "react"
import StarRatings from 'react-star-ratings';
import '../styles.css';


const AverageRatingByCategory = ({reviews, calculateAverageRatings}) => {
    const reviewCategories = reviews.map(review => review.review_questions)
    const {ratingCategories, descriptiveCategories} = calculateAverageRatings(reviewCategories);

    return (
        <div className="average-rating-card">
            <h2>Ratings by Category</h2>
            {reviewCategories && ratingCategories.map((item, index) => (
                <div key={index} className="rating-item">
                    <span className="rating-category">{item.category}</span>
                    <StarRatings
                        className='star-ratings'
                        rating={item.rating}
                        starRatedColor="#FFE194"
                        starEmptyColor='#B1B1B1'
                        numberOfStars={5}
                        starDimension='24px'
                        starSpacing='2px'
                    />
                </div>
            ))}
        </div>
        
    )
}

export default AverageRatingByCategory;
