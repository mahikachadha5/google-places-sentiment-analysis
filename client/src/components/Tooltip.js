import React from "react"
import '../styles.css';

const Tooltip = ( {x, y, content, visible} ) => {
    if (!visible) { return null; }
    return (
        <div
            className="tooltip"
            style={{
                position: 'absolute',
                top: y,
                left: x,
                backgroundColor: '#fff',
                color: '#0D0D0D',
                padding: '8px',
                borderRadius: '4px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                pointerEvents: 'none',
            }}>
            {content}
        </div>
    )
}

export default Tooltip;