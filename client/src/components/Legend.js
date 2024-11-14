import React from "react"
import '../styles.css';
import * as d3 from 'd3';

const Legend = ( {color, keys} ) => {
    const size = 20; // Size of the colored squares
    const legendX = 700; // X position for the legend
    const legendY = 20; // Starting Y position for the legend items
    const spacing = 25; 

    return (
        <g className="legend">
            {keys.map((key, i) => (
                <g key={key} transform={`translate(${legendX}, ${legendY + i * spacing})`}>
                <rect
                    x={0}
                    y={0}
                    width={size}
                    height={size}
                    fill={color(key)}
                />
                <text
                    x={size + 10}
                    y={size / 2}
                    dy=".35em"
                    textAnchor="start"
                    fill={color(key)}
                >
                    {key}
                </text>
            </g>
            ))}
        </g>
    )
}

export default Legend;