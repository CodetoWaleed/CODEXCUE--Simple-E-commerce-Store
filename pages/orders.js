import React, { useEffect, useState } from "react";
import mongoose from "mongoose";
import Order from "@/models/Order";
import { useRouter } from "next/router";
import Link from "next/link";

const Orders = () => {
  const [orders, setorders] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    } else {
      findUserOrder();
    }
  }, []);

  let findUserOrder = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/getUserOrders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }), // body data type must match "Content-Type" header
      }
    );
    let res = await response.json();
    setorders(res.orders);
  };
  // console.log(orders);

  return (
    <div className="container mx-auto">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-20 my-10">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            My Orders
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              Here is a list of all the products that I ordered in the Past
            </p>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                See Details
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item) => {
              return (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  key={item._id}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    #{item.orderId}
                  </th>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4">${item.amount}</td>
                  <td className="px-6 py-4"><Link href={'/orderDetail?orderId=' + item.orderId}>Details</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
