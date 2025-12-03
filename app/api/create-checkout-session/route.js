import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(req) {
  try {
    const { amount, email, productIds } = await req.json();

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // احفظ بيانات المنتجات والبريد في metadata (سلسلة JSON) ليمكن استرجاعها لاحقاً من صفحة النجاح
    const metadata = {
      email: email || "",
      productIds:
        productIds && productIds.length ? JSON.stringify(productIds) : "",
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "منتج للاختبار",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // ضع customer_email حتى يجمع Stripe البريد للمستخدم تلقائياً
      customer_email: metadata.email || undefined,
      metadata,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
