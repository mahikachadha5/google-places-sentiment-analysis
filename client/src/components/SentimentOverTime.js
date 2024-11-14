import React from 'react';
import * as d3 from 'd3';
import '../styles.css';
import Legend from './Legend'

const SentimentOverTime = ({ reviews }) => {
    const margin = {top: 25, right: 120, bottom: 60, left: 30},
        width = 810 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;
        
        // generate an array of the last 12  months
        const months = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1
            }
        }).reverse();

        // grouping data and calculating sentiment counts
        const data = months.map(({ year, month }) => {
            const monthlyReviews = reviews.filter(review => {
                const reviewDate = new Date(review.review_timestamp * 1000); // Convert timestamp to date if it's in seconds
                return reviewDate.getFullYear() === year && (reviewDate.getMonth() + 1) === month;
            });
        
            return {
                year,
                month,
                Positive: monthlyReviews.filter(rev => rev.sentiment === 'Positive').length,
                Negative: monthlyReviews.filter(rev => rev.sentiment === 'Negative').length,
                Neutral: monthlyReviews.filter(rev => rev.sentiment === 'Neutral').length,
            };
        });

        const keys = ['Positive', 'Negative', 'Neutral']

        // color scheme
        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(['#D7FFC8', '#FFA299', '#FFE194'])

        const xScale = d3
            .scaleLinear()
            .domain([0,11])
            .range([0,width])
        
        // add y-axis
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d =>  d.Positive + d.Negative + d.Neutral)])
            .range([height, 0])

        // Line Generators
        const lineGenerator = (key) =>
            d3
                .line()
                .x((_, i) => xScale(i))
                .y((d) => yScale(d[key]));


    return (
        <div className="sentiment-chart-container">
        <h2>Customer Sentiment Over the Past Year</h2>
        <p >This chart tracks changes in the number of Positive, Neutral, and Negative user reviews per month over the past year.</p>
        <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
            <g transform={`translate(${margin.left},${margin.top})`}>
                {/* x-axis */}
                <g transform={`translate(0,${height})`}>
                    <line x1={0} x2={width} stroke="white" />
                    {months.map((_, i) => (
                        <text key={i} x={xScale(i) + 20} y={24} fill="white" textAnchor="middle" transform={`rotate(45, ${xScale(i)}, 25)`}>
                            {months[i].year}-{String(months[i].month).padStart(2, '0')}
                        </text>
                    ))}
                </g>

                {/* Y-axis */}
                <g>
                    {yScale.ticks(5).map((tick, i) => (
                        <g key={i} transform={`translate(0,${yScale(tick)})`}>
                            <line x1={0} x2={width} stroke="white" opacity="0.1" />
                            <text x={-20} fill="white" dy=".32em">
                                {tick}
                            </text>
                        </g>
                    ))}
                </g>

                {/* Lines */}
                {keys.map((key) => (
                    <path
                        key={key}
                        d={lineGenerator(key)(data)}
                        fill="none"
                        stroke={color(key)}
                        strokeWidth={2}
                    />
                ))}

            </g>
            <Legend color={color} keys={keys} />
        </svg>
    </div>
    );
};

export default SentimentOverTime;