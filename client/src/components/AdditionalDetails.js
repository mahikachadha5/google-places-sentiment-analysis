import React from "react";

const AdditionalDetails = ({reviews, calculateAverageRatings}) => {
    const reviewCategories = reviews.map(review => review.review_questions)
    const {ratingCategories, descriptiveCategories} = calculateAverageRatings(reviewCategories);

    return (
        <div className="additional-details-card">
            <h2>Key Details</h2>
            <div className="details-title-container">
                <p>Category</p>
                <p>User Recommendations</p>
            </div>
            {descriptiveCategories.map((item, index) => (
                item.values.length > 0 && 
                    <div key={index} className="details-item">
                        <p className="details-item-category">{item.category} </p>
                        <p className="details-item-value">{item.values[0]}</p>
                    </div>
                ))}
        </div>
    )
}

export default AdditionalDetails;