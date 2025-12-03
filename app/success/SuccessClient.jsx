"use client";

import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { CartContext } from "../_context/CartContext";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("idle");

  const { setCart } = useContext(CartContext);

  useEffect(() => {
    if (!sessionId) {
      setStatus("no-session");
      return;
    }

    const lockKey = `confirm_called_${sessionId}`;
    if (localStorage.getItem(lockKey)) {
      setStatus("success");
      try {
        setCart([]);
      } catch (e) {}
      return;
    }

    const confirm = async () => {
      setStatus("loading");
      try {
        localStorage.setItem(lockKey, "1");
        const res = await fetch("/api/confirm-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          try {
            setCart([]);
          } catch (e) {}
        } else {
          console.error("confirm-order failed:", data);
          localStorage.removeItem(lockKey);
          setStatus("error");
        }
      } catch (err) {
        console.error("confirm-order error:", err);
        localStorage.removeItem(lockKey);
        setStatus("error");
      }
    };

    confirm();
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {status === "loading" && (
        <h1 className="text-xl">جارٍ تأكيد الدفع ومعالجة الطلب...</h1>
      )}
      {status === "success" && (
        <>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            تمت عملية الدفع بنجاح!
          </h1>
          <p>
            شكرًا لك، تم استلام طلبك وسيتم إرسال تأكيد إلى بريدك الإلكتروني.
          </p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            حدث خطأ أثناء معالجة الطلب
          </h1>
          <p>حاول مرة أخرى أو تواصل مع الدعم.</p>
        </>
      )}
      {status === "no-session" && (
        <>
          <h1 className="text-2xl font-bold mb-4">
            لا يوجد معرف جلسة للمعالجة
          </h1>
          <p>لم نتمكن من العثور على معلومات الدفع.</p>
        </>
      )}
      {status === "idle" && (
        <>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            تمت عملية الدفع بنجاح!
          </h1>
          <p>شكرًا لك، تم استلام طلبك وسيتم معالجته قريبًا.</p>
        </>
      )}

      <a href="/" className="mt-6 text-blue-600 hover:underline">
        العودة للصفحة الرئيسية
      </a>
    </div>
  );
}
