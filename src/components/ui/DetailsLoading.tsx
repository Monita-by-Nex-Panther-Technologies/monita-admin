import React from 'react';

const DetailsLoading: React.FC = () => {
    return (
        <div className="container mx-auto p-4 scroll-auto">
        {/* Header */}
        <div className="w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div> {/* Shimmer for Back Button */}
            <div className="h-6 w-48 bg-gray-300 rounded-md animate-pulse"></div> {/* Shimmer for Title */}
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="h-10 w-32 bg-gray-300 rounded-md animate-pulse"></div> {/* Shimmer for Generate Receipt Button */}
          </div>
        </div>
      
        {/* Transaction Info */}
        <div className="bg-white rounded-lg mt-6 p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden animate-pulse"></div> {/* Shimmer for Image */}
              </div>
              <div>
                <div className="h-4 w-40 bg-gray-300 rounded-md animate-pulse"></div> {/* Shimmer for 'Image Verified' Text */}
                <div className="h-3 w-24 bg-gray-300 rounded-md animate-pulse mt-2"></div> {/* Shimmer for 'Match: xyz' */}
              </div>
            </div>
          </div>
      

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div className="h-4 w-32 bg-gray-300 rounded-md animate-pulse"></div> {/* Shimmer for Title */}
                <div className="h-4 w-32 bg-gray-300 rounded-md animate-pulse mt-2"></div> {/* Shimmer for Value */}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div className="h-4 w-32 bg-gray-300 rounded-md animate-pulse"></div> {/* Shimmer for Title */}
                <div className="h-4 w-32 bg-gray-300 rounded-md animate-pulse mt-2"></div> {/* Shimmer for Value */}
              </div>
            ))}
          </div>
      
        
        </div>
      
        {/* Customer Info */}
        <div className="bg-white rounded-lg mt-6 p-6">
          <h2 className="h-6 w-48 bg-gray-300 rounded-md animate-pulse mb-4"></h2> {/* Shimmer for Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div className="h-4 w-32 bg-gray-300 rounded-md animate-pulse"></div> {/* Shimmer for Title */}
                <div className="h-4 w-32 bg-gray-300 rounded-md animate-pulse mt-2"></div> {/* Shimmer for Value */}
              </div>
            ))}
          </div>
        </div>
      
        {/* Device Info */}
        <div className="bg-white rounded-lg mt-6 p-6">
          <h2 className="h-6 w-48 bg-gray-300 rounded-md animate-pulse mb-4"></h2> {/* Shimmer for Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div className="h-4 w-32 bg-gray-300 rounded-md animate-pulse"></div> {/* Shimmer for Title */}
                <div className="h-4 w-32 bg-gray-300 rounded-md animate-pulse mt-2"></div> {/* Shimmer for Value */}
              </div>
            ))}
          </div>
        </div>
      
        {/* Other Details */}
        <div className="bg-white rounded-lg mt-6 p-6">
          <h2 className="h-6 w-48 bg-gray-300 rounded-md animate-pulse mb-4"></h2> {/* Shimmer for Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div className="h-4 w-32 bg-gray-300 rounded-md animate-pulse"></div> {/* Shimmer for Title */}
                <div className="h-4 w-32 bg-gray-300 rounded-md animate-pulse mt-2"></div> {/* Shimmer for Value */}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default DetailsLoading;