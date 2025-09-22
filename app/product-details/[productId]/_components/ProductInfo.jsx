'use client'

import React, { useContext } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import CartApis from '../../../_utils/CartApis'
import { CartContext } from '../../../_context/CartContext'
import { BadgeCheck, ShoppingCart } from 'lucide-react'


const ProductInfo = ({product}) => {
  const {user} = useUser()
  const router = useRouter()
  const {cart, setCart} = useContext(CartContext);
  const {cartId, setCartId} = useContext(CartContext);
  const handleAddToCart = () => {
    if(!user){
      return router.push('/sign-in')
    } else {
      // add to cart functionality
      const data = {
        data: {
        username: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
        // products: {
        //   connect: [{ id: product.id }] // مخصص لـ Strapi v5 relations
        // }
        products: [product?.id]
      }
      }
      CartApis.addToCart(data).then(res=>{
        setCartId(res?.data?.data?.id)
        // console.log("cart response ", res.data);
        setCart(oldCart=>[
          ...oldCart,
          {
            id: res?.data?.data?.id,
            product
          }
        ])
      }).catch(err=>{
        console.log(err);
      })
    }
  }
  return (
    <div>
       <h2 className='text-[20px]'>{product?.title}</h2>
       <h2 className='text-[15px] text-gray-500'>{product?.category}</h2>
       <h2 className='text-[15px] mt-5'>{product?.description?.[0].children?.[0].text}</h2>
       <h2 className='flex gap-2 items-center mt-2 text-[11px] text-gray-500'> <BadgeCheck className='w-5 h-5 text-red-500' /> Eligible For Instant Delivery</h2>
       <h2 className='text-[32px] mt-10 text-primary'>${product?.price}</h2>
       <button onClick={()=> handleAddToCart()} className='flex gap-2 bg-primary text-white hover:bg-red-600 p-4 mt-4 rounded-md'> <ShoppingCart /> Add To Cart</button>
    </div>
  )
}

export default ProductInfo