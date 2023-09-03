import React from 'react'

const LoadingAnimation = ({className}) => {
    return (
        <div className={`${className} items-center justify-center h-screen w-screen bg-white transition-all duration-300 delay-300`}>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
        </div>
      );
}

export default LoadingAnimation