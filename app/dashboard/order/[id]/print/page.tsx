"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {bahttext} from "bahttext";

export default function ReceiptPrintPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/order/${id}`)
      .then((res) => res.json())
      .then((json) => setOrder(json.data || json));
  }, [id]);

  if (!order) return <div className="p-10">กำลังโหลด...</div>;

  const subTotal = order.orders.reduce((sum: number, i: any) => sum + (i.price * i.amount), 0);

  // ฟังก์ชันช่วยจัดการข้อความ "บาทถ้วน" ให้สวยงาม
  const getThaiBahtText = (amount: number) => {
    const text = bahttext(amount);
    return text.endsWith("บาท") ? text + "ถ้วน" : text;
  };

  return (
    <div className="p-8 bg-white text-black min-h-[297mm] max-w-[210mm] mx-auto border shadow-md print:shadow-none print:border-none">
      {/* ส่วนหัว */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">ประดิษฐ์ธูปหอม</h1>
        <p className="text-sm">8 หมู่ที่ 10 ต.ฝายกวาง อ.เชียงคำ จ.พะเยา 56110</p>
        <p className="text-sm">โทร. 081-021-3931</p>
        <h2 className="text-lg font-bold mt-4 underline">ใบเสร็จรับเงิน (RECEIPT)</h2>
      </div>

      {/* ข้อมูลลูกค้าและเลขที่ */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p><strong>นามลูกค้า:</strong> {order.name_shop}</p>
        </div>
        <div className="text-right">
          <p><strong>เลขที่:</strong> {order.no}</p>
          <p><strong>วันที่:</strong> {new Date(order.order_date).toLocaleDateString('th-TH')}</p>
        </div>
      </div>

      {/* ตารางรายการสินค้า */}
      <table className="w-full border-collapse border border-black mb-6 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-2">ลำดับ</th>
            <th className="border border-black p-2">รายละเอียด</th>
            <th className="border border-black p-2">จำนวน</th>
            <th className="border border-black p-2">หน่วย</th>
            <th className="border border-black p-2">ราคา/หน่วย</th>
            <th className="border border-black p-2">จำนวนเงิน</th>
          </tr>
        </thead>
        <tbody>
          {order.orders.map((item: any, idx: number) => (
            <tr key={idx}>
              <td className="border border-black p-2 text-center">{idx + 1}</td>
              <td className="border border-black p-2">{item.name}</td>
              <td className="border border-black p-2 text-center">{item.amount}</td>
              <td className="border border-black p-2 text-center">ลัง</td>
              <td className="border border-black p-2 text-right">{item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              <td className="border border-black p-2 text-right">{(item.price * item.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* สรุปยอดและรายละเอียดการชำระเงิน */}
      <div className="flex gap-4">
        <div className="w-1/2">
            <div className="border p-2 min-h-[100px]">
                <p><strong>ตัวอักษร:</strong> ({getThaiBahtText(subTotal)})</p>
            </div>
            <div className="mt-4 text-sm">
                <p>☐ เงินสด ☐ เงินโอนเข้าบัญชี ☐ เช็คเลขที่.............. ธนาคาร..............</p>
            </div>
        </div>
        <div className="w-1/2">
          <table className="w-full border-collapse border border-black text-sm">
            <tr><td className="border p-2">รวมเงิน (TOTAL)</td><td className="border p-2 text-right">{subTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>
            <tr><td className="border p-2">หัก เงินมัดจำ</td><td className="border p-2 text-right">0.00</td></tr>
            <tr><td className="border p-2 font-bold">ยอดเงินสุทธิ (GRAND TOTAL)</td><td className="border p-2 text-right font-bold">{subTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>
          </table>
        </div>
      </div>

      {/* ลายเซ็น */}
      <div className="mt-12 flex justify-between text-sm text-center">
        <div className="w-1/3">ผู้รับสินค้า<br/><br/>(..........................)</div>
        <div className="w-1/3">ผู้ส่งสินค้า<br/><br/>(..........................)</div>
        <div className="w-1/3">ผู้มีอำนาจลงนาม<br/><br/>(..........................)</div>
      </div>

      {/* ปุ่มพิมพ์ (ซ่อนตอนพิมพ์จริง) */}
      <button onClick={() => window.print()} className="mt-8 bg-blue-600 text-white px-4 py-2 rounded print:hidden">
        สั่งพิมพ์ใบเสร็จ
      </button>

      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 15mm; }
        }
      `}</style>
    </div>
  );
}