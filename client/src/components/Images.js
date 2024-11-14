import React, { useRef, useEffect } from 'react';
import ImageCarousel from './ImageCarousel';
import '../styles.css';

const Images = ({reviews}) => {
    const images = reviews
        .map((review) => review.review_img_url)
        .filter((url) => url != null);

    const onlyTenImgs = images.slice(0, 10)
    console.log(onlyTenImgs)

    if (onlyTenImgs.length === 0) return <p>Loading...</p>

    return (
        <div className='img-container'>
            <h2>Explore in Pictures</h2>
            <ImageCarousel images={onlyTenImgs} />
        </div>
    )
}

export default Images;