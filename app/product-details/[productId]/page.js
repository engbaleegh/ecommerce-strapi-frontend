"use client";

import BreadCrumb from "../../_components/BreadCrumb";
import ProductApis from "../../_utils/ProductApis";
import React, { useEffect, useState } from "react";
import ProductBanner from "./_components/ProductBanner";
import ProductInfo from "./_components/ProductInfo";
import ProductList from "../../_components/ProductList";
import { usePathname } from "next/navigation";

const ProductDetails = ({ params }) => {
  const path = usePathname();
  const [productDetails, setProductDetails] = useState({});
  const [productList, setProductList] = useState([]);

  const getProductById_ = () => {
    ProductApis.getProductById(params?.productId).then((res) => {
      console.log("product item ", res.data.data);
      setProductDetails(res.data.data);
      getProductListByCategory(res.data.data);
    });
  };

  useEffect(() => {
    getProductById_();
  }, [params?.productId]);

  const getProductListByCategory = (product) => {
    ProductApis.getProductsByCategory(product?.category).then((res) => {
      console.log(res?.data?.data);
      setProductList(res?.data?.data);
    });
  };

  return (
    <>
      <div className="px-10 py-8 md:px-28">
        <BreadCrumb path={path} />
        <div className="grid grid-cols-1 mt-10 gap-5 sm:sm:grid-cols-2">
          <ProductBanner product={productDetails} />
          <ProductInfo product={productDetails} />
        </div>
      </div>
      <div className="w-[95%] mx-auto">
        <h2 className="mt-24 mb-4 text-xl border-b-4 border-solid border-gray-300">
          Similar Products
        </h2>
        <ProductList productList={productList} />
      </div>
    </>
  );
};

export default ProductDetails;
