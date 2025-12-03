"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useContext } from "react";
import { CartContext } from "../_context/CartContext";
import OrderApis from "../_utils/OrderApis";
import CartApis from "../_utils/CartApis";

// تحضير Stripe مرة واحدة فقط خارج المكون
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "20.00";
  console.log("Amount from query:", amount);
  console.log(cart)

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");
      // create new order
      // await createOrder();

      const userEmail =
        user?.primaryEmailAddress?.emailAddress ||
        (user?.emailAddresses && user.emailAddresses[0]?.emailAddress) ||
        user?.email;

      const productIds = cart.map((item) => item?.product?.id).filter(Boolean);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // يمكنك إرسال بيانات إضافية هنا
        // body: JSON.stringify({ productId: '123' }),
        body: JSON.stringify({
          amount: parseFloat(amount) * 100, // سنتات
          email: userEmail,
          productIds,
        }),
      });

      const session = await response.json();

      if (session.error) {
        console.error(session.error);
        setLoading(false);
        return;
      }

      // تحويل إلى صفحة الدفع الخاصة ب Stripe
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
      // create new order
      // await createOrder();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // const createOrder = async () => {
  //   let productIds = [];
  //   cart.forEach((item) => {
  //     productIds.push(item?.product?.id);
  //   });
  //   const data = {
  //     data: {
  //       email: user.primaryEmailAddress.emailAddress,
  //       username: user.fullName,
  //       amount: parseFloat(amount) * 100,
  //       products: productIds,
  //     },
  //   };
  //   try {
  //     await OrderApis.createOrder(data);
  //     cart.forEach((item) => {
  //       CartApis.deleteCartItem(item?.id).then((res) => {});
  //     });
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">صفحة الدفع</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "جاري التحميل..." : "ادفع الآن"}
      </button>
    </div>
  );
}
