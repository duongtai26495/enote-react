
import React from 'react';

const CustomLazyLoadedImage = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
    />
  );
};

export default CustomLazyLoadedImage;