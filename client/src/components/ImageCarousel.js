import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import '../styles.css';


const ImageCarousel = ({ images }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1, 
        slidesToScroll: 1, 
        arrows: true, 
    };

    return (
        <div className="img-carousel">
            <Slider {...settings}>
                {images.map((url, index) => (
                    <div key={index} className="carousel-image">
                        <img 
                        src={url} 
                        alt={`Carousel Slide ${index}`} 
                        />
                    </div>
                ))}
            </Slider>
        </div>
    )

}

export default ImageCarousel;