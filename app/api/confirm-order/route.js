import { NextResponse } from "next/server";
import Stripe from "stripe";
import axiosClient from "../../_utils/axiosClient";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(req) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId)
      return NextResponse.json(
        { error: "sessionId required" },
        { status: 400 }
      );

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "line_items"],
    });

    // التحقق من حالة الدفع
    const paid =
      session.payment_status === "paid" ||
      session.payment_intent?.status === "succeeded";
    if (!paid) {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const email =
      session.customer_details?.email || session.metadata?.email || "";

    let productIds = [];
    try {
      productIds = session.metadata?.productIds
        ? JSON.parse(session.metadata.productIds)
        : [];
    } catch (e) {
      productIds = [];
    }

    // أنشئ الطلب في Strapi (تجنّب الإنشاء المزدوج)
    let createdOrder = null;
    try {
      // تحقق أولاً إن وجد طلب بنفس البريد والمبلغ لتفادي التكرار
      const existingRes = await axiosClient.get(
        `orders?filters[email][$eq]=${encodeURIComponent(email)}&filters[amount][$eq]=${session.amount_total}`
      );
      const existing = existingRes?.data?.data || [];
      if (existing.length > 0) {
        console.log(
          "Found existing order(s), skipping creation:",
          existing.map((o) => o.id)
        );
        createdOrder = existing[0];
      } else {
        const orderPayload = {
          data: {
            email: email,
            username: email,
            amount: session.amount_total || 0,
            products: productIds || [],
          },
        };
        console.log(
          "Creating order in Strapi with payload:",
          JSON.stringify(orderPayload)
        );
        const orderRes = await axiosClient.post("/orders", orderPayload);
        console.log("Strapi create order response status:", orderRes.status);
        console.log(
          "Strapi create order response data:",
          JSON.stringify(orderRes.data)
        );
        createdOrder = orderRes?.data?.data || null;
      }
    } catch (e) {
      console.error(
        "Failed to create order in Strapi:",
        e?.response?.data || e.message || e
      );
    }

    // حذف عناصر السلة للمستخدم
    try {
      if (email) {
        const cartsRes = await axiosClient.get(
          `carts?filters[email][$eq]=${encodeURIComponent(email)}`
        );
        console.log(
          "Carts fetched for cleanup:",
          JSON.stringify(cartsRes?.data)
        );
        const carts = cartsRes?.data?.data || [];
        const deleteResults = await Promise.all(
          carts.map(async (c) => {
            try {
              const delRes = await axiosClient.delete(`/carts/${c.documentId}`);
              console.log(`Deleted cart ${c.id} response:`, delRes.status);
              return { id: c.documentId, ok: true };
            } catch (err) {
              console.error(
                `Failed to delete cart ${c.id}:`,
                err?.response?.data || err.message || err
              );
              return { id: c.id, ok: false, error: err };
            }
          })
        );
        console.log("Cart delete results:", JSON.stringify(deleteResults));
      }
    } catch (e) {
      console.error(
        "Failed to cleanup carts:",
        e?.response?.data || e.message || e
      );
    }

    // أرسل البريد عبر Resend
    try {
      if (email) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM || "onboarding@resend.dev",
          to: email,
          subject: "تأكيد الطلب - تم استلام دفعتك",
          html: `<p>تم تأكيد الدفع بنجاح. المبلغ: $${((session.amount_total || 0) / 100).toFixed(2)}</p>`,
        });
      }
    } catch (e) {
      console.error("Failed to send confirmation email:", e);
    }

    return NextResponse.json({ ok: true, order: createdOrder });
  } catch (err) {
    console.error("confirm-order error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
