// pages/payment-success.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Order {
  payment_id: string;
  order_id: string;
  amount: number;
  date: string;
  items: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    selectedSize?: string;
    image: string;
  }[];
}

export default function PaymentSuccess() {
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("lastOrder");
    if (savedOrder) setOrder(JSON.parse(savedOrder));
    else router.push("/cart");
  }, [router]);

  const downloadPDF = () => {
    if (!order) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice - My Clothing Store", 14, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.order_id}`, 14, 30);
    doc.text(`Payment ID: ${order.payment_id}`, 14, 36);
    doc.text(`Date: ${order.date}`, 14, 42);

    const tableData = order.items.map((item, index) => [
      index + 1,
      item.name,
      item.selectedSize || "N/A",
      item.quantity,
      `₹${item.price}`,
      `₹${item.price * item.quantity}`,
    ]);

    (doc as any).autoTable({
      startY: 50,
      head: [["#", "Product", "Size", "Qty", "Price", "Total"]],
      body: tableData,
    });

    doc.text(`Grand Total: ₹${order.amount}`, 14, (doc as any).lastAutoTable.finalY + 10);
    doc.save(`Invoice_${order.order_id}.pdf`);
  };

  if (!order) return null;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-green-600 mb-6">✅ Payment Successful!</h1>

      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Invoice</h2>
        <p><strong>Order ID:</strong> {order.order_id}</p>
        <p><strong>Payment ID:</strong> {order.payment_id}</p>
        <p><strong>Date:</strong> {order.date}</p>
        <p><strong>Total Amount:</strong> ₹{order.amount}</p>

        <h3 className="text-lg font-medium mt-6 mb-2">Items</h3>
        <div className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <div key={item._id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded border" />
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Size: {item.selectedSize || "N/A"}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-gray-900 font-semibold">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button onClick={() => router.push("/")} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg">
          Continue Shopping
        </button>
        <button onClick={downloadPDF} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg">
          Download Invoice (PDF)
        </button>
        <button onClick={() => router.push("/orders")} className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg">
          Your Orders
        </button>
      </div>
    </div>
  );
}
