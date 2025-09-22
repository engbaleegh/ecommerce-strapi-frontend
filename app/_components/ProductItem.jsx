import Image from "next/image";
import React from "react";
import Link from "next/link";

const ProductItem = ({ product }) => {
  return (
    <Link href={`/product-details/${product?.documentId}`}>
      <Image
        src={`${product?.image[0].url}`}
        alt="image-card"
        width={400}
        height={350}
        className="rounded-t-lg"
      />
      <div className="flex items-center justify-between p-3 rounded-b-lg bg-gray-100">
        <div className="">
          <h2 className="text-[18px] font-bold line-clamp-1">
            {product?.title}
          </h2>
          <h2 className="text-[10px] text-gray-400 flex  gap-1 items-center">
            {/* <List className='w-4 h-4' /> {product?.attributes?.category} */}
          </h2>
        </div>
        <h2 className="text-[14px]">${product?.price}</h2>
      </div>
    </Link>
  );
};

export default ProductItem;
