
export default function SuccessPage() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-green-600 mb-4">تمت عملية الدفع بنجاح!</h1>
      <p>شكرًا لك، تم استلام طلبك وسيتم معالجته قريبًا.</p>
      <a href="/" className="mt-6 text-blue-600 hover:underline">العودة للصفحة الرئيسية</a>
    </div>
  );
}