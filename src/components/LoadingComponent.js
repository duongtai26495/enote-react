import React from 'react'

const LoadingComponent = ({className, size = "h-16 w-16"}) => {
    return (
        <div className={`items-center justify-center bg-transparent transition-all duration-300 delay-300 ${className} `}>
          <div className={`animate-spin rounded-full ${size} border-t-4 border-b-4 border-red-500`}></div>
        </div>
      );
}

export default LoadingComponent