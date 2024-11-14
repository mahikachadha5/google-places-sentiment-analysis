import React, { useRef, useEffect} from 'react'
import '../styles.css';
import * as d3 from 'd3';


const BarChart = ({ reviews }) => {

        // set dimensions
        var margin = {top: 18, right: 8, bottom: 24, left: 85},
            width = 600 - margin.left - margin.right,
            height = 480 - margin.top - margin.bottom;

        const counts = { Positive: 0, Negative: 0, Neutral: 0 }

        reviews.forEach((review) => {
            if (review && review.sentiment) {
                counts[review.sentiment]++
            }
        })

        const data = [
            { label: 'Positive', value: counts.Positive },
            { label: 'Negative', value: counts.Negative },
            { label: 'Neutral', value: counts.Neutral },
        ]

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, counts.Positive + counts.Negative + counts.Neutral])
            .range([0, width]);

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(function (d) { return d.label; }))
            .padding(.1);


    return (
        <div className='bar-chart-container'>
            <h2>Breakdown of User Reviews</h2>
            <p>This graph shows the proportion of user reviews classified as Positive, Neutral, or Negative based on sentiment analysis.</p>
            <svg 
                width={width + margin.left + margin.right}
                height={height + margin.top + margin.bottom}
                style={{ fontFamily: 'Montserrat'}}
            >
                {/* gradient */}
                <defs>
                    <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#FFE194" /> 
                        <stop offset="100%" stopColor="#FFA299" /> 
                    </linearGradient>
                </defs>

                <g transform={`translate(${margin.left},${margin.top})`}>
                    {/*x-axis */}
                    <g transform={`translate(0,${height})`}
                        ref={(node) => {
                            d3.select(node)
                                .call(d3.axisBottom(x).ticks(5))
                                .selectAll('text')
                                .attr('transform', 'translate(5,3)')
                                .style("text-anchor", "end")
                                .style('font-family', 'Montserrat')
                                .style('font-size', '16px');
                        }}>
                    </g>

                    {/* y-axis */}
                    <g ref={(node) => 
                        d3.select(node)
                            .call(d3.axisLeft(y))
                            .selectAll('text')
                            .attr('transform', 'translate(-5,0)')
                            .style('font-family', 'Montserrat')
                            .style('font-size', '16px')
                        }>
                    </g>

                    {/* Bars */}
                    {data.map((d) => (
                        <rect
                            key={d.label}
                            x={x(0)}
                            y={y(d.label)}
                            width={x(d.value)}
                            height={y.bandwidth()}
                            fill="url(#gradient)"
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
};

export default BarChart;