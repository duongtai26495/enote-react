
import React from 'react';

const CustomLazyLoadedImage = ({ src, alt, className, onClick = () =>{} }) => {
  return (
    <img
    onClick={onClick}
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
    />
  );
};

export default CustomLazyLoadedImage;