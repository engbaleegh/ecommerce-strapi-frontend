export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">تم إلغاء عملية الدفع</h1>
      <p>لقد تم إلغاء عملية الدفع الخاصة بك. يمكنك المحاولة مرة أخرى في أي وقت.</p>
      <a href="/checkout" className="mt-4 text-blue-600 hover:underline">العودة إلى صفحة الدفع</a>
    </div>
  );
}