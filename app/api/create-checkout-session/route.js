import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY , {
  apiVersion: '2023-10-16', // استخدم أحدث إصدار من API
});

export async function POST(req) {
  
  try {
    // استخراج المعلومات من request إذا كنت ترسل بيانات
    // const body = await req.json();
    
    const { amount } = await req.json(); // استخرج المبلغ من جسم الطلب
    
    
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'منتج للاختبار',
            },
            // unit_amount: 2000, // $20.00
            unit_amount: amount, // amount from request body
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    }
  );

    async function sendEmail() {
      const resend = new Resend(process.env.RESEND_API_KEY);

       const { data } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "baleegh243@gmail.com",
      subject: "Hello from Next.js",
      html: "<strong>It works! hello </strong>",
      // react: EmailTemplate({ firstName: "LT Customer" }),
    });
    }

      sendEmail();
    return NextResponse.json({ id: session.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}