import React from "react";
import ProductItem from "./ProductItem";

const ProductList = ({ productList }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {productList.map((item) => (
        <div
          key={item.id}
          className="p-1 border-primary rounded-lg hover:border hover:shadow-md hover:cursor-pointer"
        >
          {" "}
          <ProductItem product={item} />{" "}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
