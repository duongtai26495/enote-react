
import React from 'react';

const CustomLazyLoadedImage = ({ src, alt, style }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={style}
    />
  );
};

export default CustomLazyLoadedImage;