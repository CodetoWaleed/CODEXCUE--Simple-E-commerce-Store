import React, { useEffect, useParams, useState } from "react";
import mongoose from "mongoose";
import Order from "@/models/Order";
import { useRouter } from "next/router";

const OrderDetail = () => {
  const router = useRouter();
  let orderID = router.query.orderId;
  const [orderbyID, setorderbyID] = useState({});
  const [orderProducts, setorderProducts] = useState({});

  let date = new Date(orderbyID.createdAt);

  useEffect(() => {
    findOrder(orderID);
  }, []);

  let findOrder = async (orderID) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/findOrder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderID }), // body data type must match "Content-Type" header
      }
    );
    let res = await response.json();

    setorderProducts(res.order.products);
    setorderbyID(res.order);
    console.log(res);
    console.log(orderbyID.status);
  };

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              Waleed's Wear
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
              Order ID: #{orderbyID.orderId}
            </h1>
            <p>
              Your Order has been Successfully Placed and your Payment Status is{" "}
              <span className="font-bold text-slate-800">
                {orderbyID.status} on{" "}
                {date.toLocaleString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  weekday: "long",
                })}
              </span>
              , Whereas your Delivery status is <span className="font-bold"> {orderbyID.deliveryStatus}</span>
            </p>
            
            <div className="flex mb-4">
              <a className="flex-grow  border-b-2 border-gray-500 py-2 text-lg px-1 text-center">
                Item Description
              </a>
              <a className="flex-grow border-b-2 border-gray-500 py-2 text-lg px-1 text-center">
                Quantity
              </a>
              <a className="flex-grow border-b-2 border-gray-500 py-2 text-lg px-1 text-center">
                Item Total
              </a>
            </div>
            {Object.keys(orderProducts).map((item) => {
              return (
                <div
                  key={item}
                  className="flex border-t border-gray-200 py-2"
                >
                  <span className="text-gray-500 text-cente w-40">
                    {orderProducts[item].name +
                      " (" +
                      orderProducts[item].size +
                      " / " +
                      orderProducts[item].variant +
                      ")"}
                  </span>
                  <span className="m-auto text-gray-900">
                    {orderProducts[item].qty}
                  </span>
                  <span className="m-auto text-gray-900">
                  {orderProducts[item].qty} x ${orderProducts[item].price} = ${orderProducts[item].qty * orderProducts[item].price}
                  </span>
                  
                </div>
              );
            })}

            <div className="flex my-4">
              <span className="title-font font-medium text-2xl text-gray-900">
                Sub Total : ${orderbyID.amount}
              </span>
              <button className="flex ml-auto text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-slate-900 rounded">
                Track Order
              </button>
            </div>
          </div>
          <img
            alt="ecommerce"
            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            src="https://img.freepik.com/premium-vector/thank-you-your-order-card-online-buyers-illustration-vector-design_633888-268.jpg?w=2000"
          />
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
