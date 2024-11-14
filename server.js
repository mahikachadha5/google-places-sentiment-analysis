const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
const Outscraper = require('outscraper');

///////// fetching place details
const PORT = 3001;
const API_KEY = 'AIzaSyB8Jt7DGnkn9EMXEQoRhaflcwKrsROtmpM';
const API_KEY_REVIEWS = 'ZTk4OTk5MDY4YzQ3NDlkMzg4MTBiNjg3YjVmODYxYzB8YjNjNzk3MjM4Yw';
let client = new Outscraper(API_KEY_REVIEWS);

const getPlaceId = (req, res) => {
    const placeId = req.query.place_id;
    if (!placeId) {
        throw new Error('place_id is required to fetch reviews');
    }
    return placeId
}

// fetches placedetails for a specific place based on the place_id
app.get('/place_details', async (req, res) => {
    const placeId = getPlaceId(req, res)
    if (!placeId) return;
    try {
        // fetch place details (including reviews) 
        const placeDetailsResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
            params: {
                place_id: placeId,
                key: API_KEY,
                fields: 'name,rating,formatted_address'
            }
        });
        const placeDetails = placeDetailsResponse.data.result;
        res.json(placeDetails);
    } catch (error) {
        console.error("error fetching reviews from Google PlacesAPI:", error)
        res.status(500).send('An error occurred while fetching place details from Google Places API.');
    }
});

// fetches reviews for a specific place based on the place_id
app.get('/reviews', async (req, res) => {
    const placeId = getPlaceId(req, res);
    if (!placeId) {
        console.log('place id not found', placeId)
        return res.status(400).send('Place ID not found');
    }

    try {
        const initResponse = await axios.get('https://api.app.outscraper.com/maps/reviews-v3', {
            params: {
                query: placeId,
                reviewsLimit: 100,
                async: false,
            }, 
            headers: {
                'X-API-KEY': API_KEY_REVIEWS,
            }
        });

        if (initResponse.data.status === 'Success' && initResponse.data.data && initResponse.data.data[0]) {
            const placeData = initResponse.data.data[0]
            const reviewsData = placeData.reviews_data || [];
            res.json({reviews_data: reviewsData})
        } else if (initResponse.data.status === 'Pending' && initResponse.data.results_location) {
            const pollingResult = await fetchReviewsWithPolling(initResponse.data.results_location)
            const reviewsData = pollingResult.data?.[0]?.reviews_data || [];
            res.json({ reviews_data: reviewsData });
        } else {
            res.status(404).send('No reviews found for this place')
        }    
    } catch (error) {
        console.error("error fetching reviews from Outscraper:", error)
        res.status(500).send('An error occurred while fetching reviews from Outscraper.')
    }
})

// fetch reviews with polling 
const fetchReviewsWithPolling = async (resultsLocation) => {
    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            const response = await axios.get(resultsLocation)
            const data = response.data

            if (data.status !== 'Pending') {
                return data.result;
            } 

            // if it is still pending, we will wait and then try again
            await new Promise((resolve) => setTimeout(resolve, 4000))

        } catch (error) {
            console.error('error polling for reviews:', error)
            throw new Error('Error retrieving the review data');
        }
    }
    throw new Error('Review data was not ready in time (5 attempts)')
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});