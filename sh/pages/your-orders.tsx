// pages/your-orders.tsx
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

export default function YourOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedOrders = sessionStorage.getItem("allOrders");
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  const downloadPDF = (order: Order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice - CLOSETCRAFT", 14, 20);
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

    doc.text(
      `Grand Total: ₹${order.amount}`,
      14,
      (doc as any).lastAutoTable.finalY + 10
    );
    doc.save(`Invoice_${order.order_id}.pdf`);
  };

  if (orders.length === 0)
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl font-medium mb-4">No orders yet.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg"
        >
          ← Back to Home
        </button>
      </div>
    );

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛒 Your Orders</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
        >
          ← Back to Home
        </button>
      </div>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
              <p><strong>Order ID:</strong> {order.order_id}</p>
              <p><strong>Date:</strong> {order.date}</p>
              <p className="text-lg font-semibold">Total: ₹{order.amount}</p>
            </div>

            <div className="flex gap-4 flex-wrap">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="border p-3 rounded-xl flex flex-col items-center w-44 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={item.image}
                    className="w-28 h-28 object-contain mb-2"
                  />
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-sm">Size: {item.selectedSize || "N/A"}</p>
                  <p className="text-sm">Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold text-pink-500">₹{item.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => downloadPDF(order)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-lg shadow-md transition-all"
              >
                Download Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
