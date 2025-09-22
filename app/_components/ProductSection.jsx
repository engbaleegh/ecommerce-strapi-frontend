"use client";
import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import ProductApis from "../_utils/ProductApis";

const ProductSection = () => {
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    getLatestProducts_();
  }, []);

  const getLatestProducts_ = () => {
    ProductApis.getLatestProducts()
      .then((response) => {
        setProductList(response.data.data);
      })
      .catch((error) => {
        console.log("Error while fetching latest products: ", error);
      });
  };
  return (
    <div className="w-[95%] mx-auto">
      <h1 className="text-xl border-b-4 border-solid border-gray-300 mb-4">
        Latest Products
      </h1>
      <ProductList productList={productList} />
    </div>
  );
};

export default ProductSection;
