import React, { useRef, useState } from "react";
import '../styles.css';
import * as d3 from 'd3';


const Heatmap = ({ reviews }) => {

    const svgRef = useRef();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const [hoveredCell, setHoveredCell] = useState(null);

    // dimensions
    const width = 600;
    const height = 560;
    const margin = { top: 25, right: 25, bottom: 40, left: 50 };
    const cellWidth = (width - margin.right - margin.left) / days.length;
    const cellHeight = (height - margin.top - margin.bottom) / days.hours;

    // data
    const data = []
    const dayIndices = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
    days.forEach(day => {
        const dayIndex = dayIndices[day];
        hours.forEach(hour => {
            const count = reviews.filter((review) => {
                const reviewDate = new Date(review.review_timestamp * 1000);
                return (reviewDate.getDay() === dayIndex && reviewDate.getHours() === hour && review.sentiment === "Positive")
            }).length;
            data.push({day, hour, count})
        })
    })

    console.log(data)
    
    // color scale
    const maxCount = d3.max(data, d => d.count);
    const colorScale = d3.scaleSequential(d3.interpolateGreens).domain([0, maxCount]);

    // x and y scales
    // x is days of week
    const xScale = d3
        .scaleBand()
        .domain(days)
        .range([margin.left, width - margin.right])

    // add y-axis
    // y is hours of day
    const yScale = d3
        .scaleBand()
        .domain(hours)
        .range([margin.top, height - margin.bottom])

    // Build the rectangles
    const allShapes = data.map((d, i) => {
        const x = xScale(d.day);
        const y = yScale(d.hour);

        if (d.value === null || !x || !y) {
            return;
        }

        return (
            <rect
                key={i}
                r={4}
                x={x}
                y={y}
                width={xScale.bandwidth()}
                height={yScale.bandwidth()}
                opacity={1}
                fill={colorScale(d.count)}
                rx={5}
                stroke={"white"}
                cursor="pointer"
                onMouseEnter={(e) => {
                    setHoveredCell({
                      xLabel: "Day: " + d.x,
                      yLabel: "Hour: " + d.y,
                      xPos: x + xScale.bandwidth() + margin.left,
                      yPos: y + xScale.bandwidth() / 2 + margin.top,
                      value: Math.round(d.value * 100) / 100,
                    });
                  }}
                  onMouseLeave={() => setHoveredCell(null)}
            />
        );
    });

    return (
        <div className="heatmap">
            <h2>Average Positive Reviews by Day of Week / Hour of Day</h2>
            <svg width={width} height={height}>
                <g>{allShapes}</g>
                {/* x-axis */}
                <g transform={`translate(0,${height - margin.bottom})`}>
                    {days.map((day, i) => (
                        <text key={i} x={xScale(day) + 30} y={20} fill="white" textAnchor="middle">
                        {day}
                        </text>
                    ))}
                    <text x={width / 2} y={height - 30} textAnchor="middle" fill="white">Day of the Week</text>
                </g>

                {/* y-axis */}
                <g>
                    {hours.map((hour, i) => (
                        <text key={i} y={yScale(hour) + 15} x={35} fill="white" textAnchor="middle">
                        {hour}
                        </text>
                    ))}
                    <text x={-height / 2} y={10} textAnchor="middle" transform={'rotate(-90)'} fill="white">Hour of the Day</text>
                </g>
            </svg>
        </div>
    )
}

export default Heatmap;