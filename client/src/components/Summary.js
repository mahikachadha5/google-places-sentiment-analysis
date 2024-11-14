import React from 'react'
import thumbsUp from '../images/thumbsUp.png';
import thumbsDown from '../images/thumbsDown.png';


function Summary({reviews}) {

    // first make the categories 
    let categories = {
        quality: [
            'high-quality', 'reliable', 'impressive', 'top-notch', 
            'consistent', 'dependable', 'outstanding', 'solid', 'remarkable', 'satisfying', 'exceptional', 
            'positive', 'enjoyable', 'first-class', 'top-tier'
        ],
        service: [
            'helpful', 'professional', 'prompt', 'quick', 'fast', 'speedy', 'accommodating', 'responsive', 'efficient',
            'welcoming', 'attentive', 'courteous',
        ],
        atmosphere: [
            'clean', 'cozy', 'spacious', 'classy',
            'modern', 'stylish', 'elegant', 'sophisticated', 'luxurious', 'upscale', 'fancy',
        ],
        space: [
            'organized', 'tidy', 'spotless', 'pristine', 'well-maintained',
            'airy', 'roomy', 'convenient', 'well-designed', 'minimalist', 'aesthetic',
        ],
        location: [
            'convenient', 'central', 'close', 'nearby', 'easy-to-find',
            'well-located', 'prime', 'strategic', 'walking-distance', 'proximity',
        ],
        value: [
            'affordable', 'worth it', 'fair', 'reasonable', 'great value', 'good deal', 'cost-effective', 
            'inexpensive', 'budget-friendly', 'premium', 'high-quality', 'valuable', 'fairly priced', 'expensive', 
            'cheap', 'good pricing',
        ],
        amenities: [
            'free wifi', 'parking', 'gym', 'pool', 'lounge', 'study rooms', 'cafeteria', 'play area', 
            'meeting rooms', 'workspace', 'air conditioning', 'conference room', 'bar', 'kitchen', 
            'rooftop', 'outdoor seating', 'library', 'printer access'
        ],
        foodDrink: [
            'delicious', 'tasty', 'flavorful', 'fresh', 'unique', 'mouth-watering', 'exquisite', 
            'well-prepared', 'high-quality', 'savory', 'refreshing', 'satisfying', 'authentic', 'homemade', 
            'signature', 'handcrafted', 'comforting', 'yummy', 'scrumptious', 'gourmet',
        ]
    }

    let wordScores = {}
    let categoryMatches = {
        quality: new Set(),
        atmosphere: new Set(),
        service: new Set(),
        space: new Set(),
        location: new Set(),
        value: new Set(),
        amenities: new Set(),
        foodDrink: new Set(),

    }

    reviews.forEach(review => {
        const words = review.sentimentWords
        const isPositive = review.sentimentScore > 0

        words.forEach(word => {
            // initialize wordScores with each word
            if (!wordScores[word]) {
                wordScores[word] = { positive: 0, negative: 0, count: 0 }
            }
            
            // update counts and pos, neg counts 
            wordScores[word].count++
            if (isPositive) {
                wordScores[word].positive++
            } else {
                wordScores[word].negative++
            }

            // categorize words
            for (const [category, keywords] of Object.entries(categories)) {
                if (keywords.includes(word.toLowerCase())) {
                    categoryMatches[category].add(word);
                }
            }
        })
    })

    // helper function to get top 2 words from a category
    const getTopWords = (category, count = 2, isPositive = true) => {
        return Array.from(categoryMatches[category])
            .map(word => ({
                word,
                score: wordScores[word].positive / wordScores[word].count,
                count: wordScores[word].count
            }))
            .filter(item => (isPositive ? item.score > 0.5 : item.score < 0.4))
            .sort((a, b) => b.count - a.count)
            .slice(0, count)
            .map(item => item.word);
    };

    const generateHighlights = () => {
        const positiveHighlights = [];
        const negativeHighlights = [];

        const qualityPositiveWords = getTopWords('quality', true);
        const qualityNegativeWords = getTopWords('quality', false);

        if (qualityPositiveWords.length > 0) {
            positiveHighlights.push(`Overall, customers describe the quality of this place as ${qualityPositiveWords.join(' and ')}. `);
        }
        if (qualityNegativeWords.length > 0) {
            negativeHighlights.push(`Some customers find the general quality to be ${qualityNegativeWords.join(' and ')}.`);
        }

        const atmospherePositiveWords = getTopWords('atmosphere', true);
        const atmosphereNegativeWords = getTopWords('atmosphere', false);

        if (atmospherePositiveWords.length > 0) {
            positiveHighlights.push(`Reviews mention that the atmosphere is ${atmospherePositiveWords.join(' and ')}. `);
        }
        if (atmosphereNegativeWords.length > 0) {
            negativeHighlights.push(`Some customers mention that the atmosphere is ${atmosphereNegativeWords.join(' and ')}. `);
        }

        const servicePositiveWords = getTopWords('service', true);
        const serviceNegativeWords = getTopWords('service', false);

        if (servicePositiveWords.length > 0) {
            positiveHighlights.push(`Customers mention that the service is ${servicePositiveWords.join(' and ')}. `);
        }
        if (serviceNegativeWords.length > 0) {
            negativeHighlights.push(`Some customers mention that the service is ${serviceNegativeWords.join(' and ')}. `);
        }

        const foodDrinkPositiveWords = getTopWords('foodDrink', true);
        const foodDrinkNegativeWords = getTopWords('foodDrink', false);

        if (foodDrinkPositiveWords.length > 0) {
            positiveHighlights.push(`Customers mention that the food & drink quality is ${foodDrinkPositiveWords.join(' and ')}. `);
        }
        if (foodDrinkNegativeWords.length > 0) {
            negativeHighlights.push(`Some customers find the food & drink quality as ${foodDrinkNegativeWords.join(' and ')}. `);
        }

        const spacePositiveWords = getTopWords('space', true);
        const spaceNegativeWords = getTopWords('space', false);

        if (spacePositiveWords.length > 0) {
            positiveHighlights.push(`Reviews mention that the space is ${spacePositiveWords.join(' and ')}. `);
        }
        if (spaceNegativeWords.length > 0) {
            negativeHighlights.push(`Some customers find the space as ${spaceNegativeWords.join(' and ')}. `);
        }

        const valuePositiveWords = getTopWords('value', true);
        const valueNegativeWords = getTopWords('value', false);

        if (valuePositiveWords.length > 0) {
            positiveHighlights.push(`Reviews mention that the value for money is ${valuePositiveWords.join(' and ')}. `);
        }
        if (valueNegativeWords.length > 0) {
            negativeHighlights.push(`Some customers say that the value for money is ${valueNegativeWords.join(' and ')}. `);
        }

        return { positiveHighlights, negativeHighlights };
    };

    const { positiveHighlights, negativeHighlights } = generateHighlights();

    return (
        <div className='summary-container'>
            <h2>Highlights from Reviews</h2>
            <div className='positive-highlights'>
                <div className='icon-title'>
                    <img src={thumbsUp}/>
                    <p className="summary-title">What Customers Loved</p>
                </div>
                {positiveHighlights.length > 0 ? (
                    <p>{positiveHighlights}</p>
                    
                ) : <p>This place has mixed reviews. More data is required for an in-depth summary.</p>}
            </div>

            <div className='negative-highlights'>
                <div className='icon-title'>
                    <img src={thumbsDown}/>
                    <p className="summary-title">Areas for Improvement</p>
                </div>
                {negativeHighlights.length > 0 ? (
                    negativeHighlights.map((highlight, index) => (
                        <p key={index}>{highlight}</p>
                    ))
                ) : <p>No negative highlights found.</p>}
            </div>
        </div>
    )

}

export default Summary;