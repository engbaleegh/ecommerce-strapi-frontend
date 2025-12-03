import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="shadow-sm animate-pulse">
      <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
      <div className="flex items-center justify-between p-1 rounded-b-lg gap-4">
        <div className="h-6 bg-gray-200 rounded mt-2 w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded mt-2 w-1/2"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
