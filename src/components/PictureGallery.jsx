import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { firestore } from '../firebase.js';
import { getDocs, collection } from 'firebase/firestore';

const PictureGallery = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'ease-in-out',
  };

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const placeholderImageUrl = 'https://via.placeholder.com/1200x800';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'pictures'));
        const imagesData = querySnapshot.docs.map(doc => doc.data().imageURL);
        setImages(imagesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading images...</div>;
  }

  if (images.length === 0) {
    return <div className="flex justify-center items-center h-screen">No images found.</div>;
  }

  // Split images into 4 arrays for the 4 sliders
  const chunkSize = Math.ceil(images.length / 4);
  const imageChunks = Array.from({ length: 4 }, (_, index) => 
    images.slice(index * chunkSize, index * chunkSize + chunkSize)
  );

  return (
    <div className="picture-gallery-container py-10 mx-auto max-w-screen-xl">
      <h2 className="text-3xl font-semibold text-center mb-8">Picture Gallery</h2>
      <div className="space-y-8">
        {imageChunks.map((chunk, idx) => (
          <div key={idx} className="flex justify-center items-center">
            <div className="w-full">
              <Slider {...settings}>
                {chunk.map((image, index) => (
                  <div key={index} className="flex justify-center items-center">
                    <img
                      src={image || placeholderImageUrl}
                      onError={(e) => { e.target.src = placeholderImageUrl }}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-80 object-cover rounded-lg shadow-lg transition-transform hover:scale-105" // Adjusted height
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PictureGallery;
