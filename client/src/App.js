import React, { useState } from 'react';
import './styles.css';

import AutocompleteSearch from './components/AutocompleteSearch';
import PlaceDetails from './components/PlaceDetails';
import ReviewWordCloud from './components/ReviewWordCloud';
import SentimentOverTime from './components/SentimentOverTime';
import BarChart from './components/BarChart';
import Images from './components/Images';
import Summary from './components/Summary';
import PulseLoader from "react-spinners/PulseLoader";
import AverageRatingByCategory from './components/AverageRatingByCategory';
import AdditionalDetails from './components/AdditionalDetails';

import axios from 'axios';
import Sentiment from 'sentiment';

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // async function that is called when the user types as place into the search bar.
  // passed to AutocompleteSearch as a prop and fetches place details and reviews when the user clicks 
  // on a place
  const handlePlaceSelected = async (place) => {
    const placeId = place.place_id;
    setIsLoading(true);

    try {
      const placeDetails = await fetchPlaceDetails(placeId)
      const placeReviews = await fetchPlaceReviews(placeId)

      if (!placeDetails) {
        console.error("Error: Place details not found!");
        return;
      }

      const reviews = placeReviews?.data.reviews_data || [];
      
      if (reviews.length > 0) {
        const analyzedReviews = analyzeReviews(reviews);

        setSelectedPlace({
          name: placeDetails.name,
          address: placeDetails.formatted_address,
          rating: placeDetails.rating || "N/A",
          reviews: analyzedReviews,
        });
      } else {
        setSelectedPlace({
          name: placeDetails.name,
          address: placeDetails.formatted_address,
          rating: placeDetails.rating || "N/A",
          reviews: [],
        });
      }
      console.log('selected place after update', selectedPlace);
    } catch (error) {
      console.error("Error fetching details from server", error);
    } finally {
      setIsLoading(false)
    }
  }

  // async function that takes in 'placeId' as a parameter and fetches place details of the selected place 
  // from the backend endpoint '/place_details'
  const fetchPlaceDetails = async (placeId) => {
    const response = await axios.get('http://localhost:3001/place_details', {
      params: {
        place_id: placeId
      }
    })
    const placeDetails = response.data;
    return placeDetails;
  }

  // async function that takes in the 'placeId' parameter and fetches the associated reviews from the backend
  // endpoint '/reviews'
  const fetchPlaceReviews = async (placeId) => {
    try {
      const response = await axios.get('http://localhost:3001/reviews', {
        params: {
          place_id: placeId,
        }
      })

      console.log(response.data)
      return response;

    } catch (error) {
      console.error('(App.js) Error Fetching Reviews', error)
      return { reviews_data: [] };
    }
  }

  // function that operates sentiment analysis on reviews
  // Returns (for each review) all contents of the review, a sentiment score, sentiment classification, sentiment words, normalized score, date posted 
  const analyzeReviews = (reviews) => {
    const sentiment = new Sentiment();

    const analyzedReviews = reviews.map(review => {
      if (!review.review_text || !review.review_datetime_utc) {
        throw new Error("Review Text or Review Timestamp DNE for", review)
      }
      const analysis = sentiment.analyze(review.review_text);
     // console.log(`Review for ${review.name}: ${review.review_text}, Sentiment Score: ${analysis.score}, Positive Words: ${analysis.positive}, Negative Words: ${analysis.negative},Words: ${analysis.words}, Time: ${new Date(review.review_timestamp * 1000)}`);
      return {
        ...review,
        sentimentScore: analysis.score,
        sentiment: analysis.score > 0 ? 'Positive' : analysis.score < 0 ? 'Negative' : 'Neutral',
        positiveWords: analysis.positive,
        negativeWords: analysis.negative,
        sentimentWords: analysis.words,
        normalizedScore: analysis.score / analysis.words.length,
        date: new Date(review.review_datetime_utc),

      }
    });
    return analyzedReviews
  }

  const calculateAverageRatings = (reviewCategories) => {
    const categoryData = {};
    const nonNumericCategories = {};
    reviewCategories.forEach(review => {

      if (review !== null && review !== undefined) {
        Object.keys(review).forEach(key => {
          const value = review[key]

          if (key === null || key === undefined || key.trim() === '' || key === "null") {
            return;
          }

          const rating = parseInt(value)
          if (!isNaN(rating)) {
            if (!categoryData[key]) {
              categoryData[key] = { total: 0, count: 0 }
            }
            categoryData[key].total += rating
            categoryData[key].count += 1
          } else if (value !== null && value !== undefined && value.trim() !== '' && value !== "null") {
            if (!nonNumericCategories[key]) {
              nonNumericCategories[key] = new Set();
            }
            nonNumericCategories[key].add(value);

          }
        })
      }
    })

    const ratingCategories = Object.keys(categoryData).map(category => ({
      category,
      rating: categoryData[category].count > 0
        ? Math.round(categoryData[category].total / categoryData[category].count)
        : 0
    }));

    const descriptiveCategories = Object.keys(nonNumericCategories).map(category => ({
      category,
      values: Array.from(nonNumericCategories[category]).slice(0, 3)
    }));

    return { ratingCategories, descriptiveCategories }
  }

  return (
    <div className="App">
      <h1>Echo</h1>
      <p>Real-time sentiment analysis of user reviews for any place</p>
      <AutocompleteSearch onPlaceSelected={handlePlaceSelected} />
      
      {isLoading ? (
        <PulseLoader
          loading={isLoading}
          speedMultiplier={0.5}
          size={15}
          className='pulse-loader'
        />
      ) : (
        selectedPlace
        && selectedPlace.reviews
        && selectedPlace.reviews.length > 0
        && (
          <>
            <div className='component-container'>
              <PlaceDetails
                name={selectedPlace.name}
                address={selectedPlace.address}
                rating={selectedPlace.rating}
                reviews={selectedPlace.reviews}
              />
              <Images reviews={selectedPlace.reviews}/>
              <Summary reviews={selectedPlace.reviews}/>
              <AdditionalDetails reviews={selectedPlace.reviews} calculateAverageRatings={calculateAverageRatings} />
              <BarChart reviews={selectedPlace.reviews} />

              <AverageRatingByCategory reviews={selectedPlace.reviews} calculateAverageRatings={calculateAverageRatings} />
              <SentimentOverTime reviews={selectedPlace.reviews} />
              <ReviewWordCloud reviews={selectedPlace.reviews} />
              
            </div>
          </>
        )
      )}
    </div>
  );
}

export default App;
