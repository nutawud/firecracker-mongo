"use client";
import Image from "next/image";

export default function WholesaleTable() {
  let data = [
    {
      "id": "P-250",
      "name": "250 นัด",
      "price_sell": "40",
      "price_received": "33",
      "amount_crate": 60,
      "image": "/images/product/1.jpg"
    },
    {
      "id": "P-500",
      "name": "500 นัด",
      "price_sell": "60",
      "price_received": "47",
      "amount_crate": 40,
      "image": "/images/product/2.jpg"
    },
    {
      "id": "P-1000",
      "name": "1,000 นัด A",
      "price_sell": "85",
      "price_received": "80",
      "amount_crate": 16,
      "image": "/images/product/3.jpg"
    },
    {
      "id": "P-2000",
      "name": "2,000 นัด",
      "price_sell": "160",
      "price_received": "150",
      "amount_crate": 10,
      "image": "/images/product/4.jpg"
    },
    {
      "id": "P-3000",
      "name": "3,000 นัด",
      "price_sell": "220",
      "price_received": "210",
      "amount_crate": 10,
      "image": "/images/product/5.jpg"
    },
    {
      "id": "P-5000",
      "name": "5,000 นัด A",
      "price_sell": "350",
      "price_received": "290",
      "amount_crate": 5,
      "image": "/images/product/6.jpg"
    },
    {
      "id": "P-10000",
      "name": "10,000 นัด A",
      "price_sell": "470",
      "price_received": "450",
      "amount_crate": 4,
      "image": "/images/product/7.jpg"
    },
    {
      "id": "P-20000",
      "name": "20,000 นัด",
      "price_sell": "790",
      "price_received": "780",
      "amount_crate": 4,
      "image": "/images/product/8.jpg"
    },
    {
      "id": "P-100000",
      "name": "แสนเสียง",
      "price_sell": "880",
      "price_received": "850",
      "amount_crate": 4,
      "image": "/images/product/9.jpg"
    }
  ]

  return (
    <div>
      <div className="md:hidden space-y-4">
        {data.map(order => (
          <div
            key={order.id}
            className="rounded-xl bg-white p-4 shadow"
          >
            <Image
              src={order.image}
              alt={order.id}
              width="200"
              height="200"
              className={`mx-auto object-cover pb-3`}
            />
            <div className="text-md text-blue-600">#{order.name}</div>
            <p>1 ลังมี {order.amount_crate} กล่อง</p>
            <div className="flex justify-between text-md">
                <p className="text-gray-500">
                  ราคาที่ได้: {order.price_received}
                </p>
                <p className="text-gray-500">
                  ราคาส่ง: {order.price_sell}
                </p>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 ">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-50 px-3 py-2 text-center text-xs md:text-sm font-medium text-gray-700">รูป</th>
              <th className="w-50 px-3 py-2 text-center text-xs md:text-sm font-medium text-gray-700">No</th>
              <th className="px-3 py-2 text-center text-xs md:text-sm font-medium text-gray-700">ชื่อ</th>
              <th className="px-3 py-2 text-center text-xs md:text-sm font-medium text-gray-700">จำนวน/ลัง</th>
              <th className="px-3 py-2 text-center text-xs md:text-sm font-medium text-gray-700">ราคาที่ได้</th>
              <th className="px-3 py-2 text-center text-xs md:text-sm font-medium text-gray-700">ราคาที่ส่ง</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                {/* <td className="px-3 py-2 text-sm">{order.id}</td> */}
                <td className="py-3 px-3">
                  <Image
                    src={order.image}
                    alt={order.id}
                    width="200"
                    height="200"
                    className={`mx-auto object-cover `}
                  />
                </td>
                <td className="px-3 py-2 text-center">{order.id}</td>
                <td className="px-3 py-2 text-center">{order.name}</td>
                <td className="px-3 py-2 text-center">{order.amount_crate}</td>
                <td className="px-3 py-2 text-center">{order.price_received}</td>
                <td className="px-3 py-2 text-center">{order.price_sell}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}