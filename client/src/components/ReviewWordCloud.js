import React, { useEffect, useState, useRef } from 'react'

import cloud from 'd3-cloud';
import * as d3 from 'd3';

import '../styles.css'

const ReviewWordCloud = ( {reviews} ) => {
    const [wordCloudData, setWordCloudData] = useState([]);
    const svgRef = useRef(null);

    const wordFrequencies = {}
    reviews.forEach(review => {
        const words = review.sentimentWords;
        words.forEach(word => {
            wordFrequencies[word] = (wordFrequencies[word] || 0) + 1
        })
    });

    const wordData = Object.keys(wordFrequencies).map((word) => ({
        text: word,
        size: Math.sqrt(wordFrequencies[word] * 100),
    }));

    const width = 450;
    const height = 350;

    const layout = cloud()
        .size([width, height])
        .words(wordData)
        .padding(3)
        .fontSize(word => word.size)
        .font('Montserrat')
        .rotate(0)
        .text(word => word.text)
        .on('end', (outputWords) => {
            setWordCloudData(outputWords);
        });

    useEffect(() => {
        if (!width) {
          return;
        }
        layout.start();
      }, [width]);

    return (
        <div className='word-cloud-container'>
            <h2>Top Words in Reviews</h2>
            <svg ref={svgRef} style={{ width, height, position: "relative" }}>

                <g style={{ transform: `translate(${width / 2}px,${height / 2}px)` }}>
                    {wordCloudData.map((word, i) => (
                        <text
                            key={i}
                            fill="#FFE194"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                fontSize: word.size,
                                textAnchor: "middle",
                                transform: `translate(${word.x}px,${word.y}px)rotate(${word.rotate}deg)`,
                            }}
                        >
                            {word.text}
                        </text>
                    ))}
                </g>
            </svg>
        </div>
    )

}

export default ReviewWordCloud;