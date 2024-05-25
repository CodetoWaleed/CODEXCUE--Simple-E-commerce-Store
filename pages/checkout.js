import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs"; //checked, but not sure if this is the best way to add an image to a button or something.  I
import { ImCross } from "react-icons/im";
import { loadStripe } from "@stripe/stripe-js";
const Checkout = ({ cart, subTotal, removeFromCart, addToCart, clearCart }) => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = loadStripe(publishableKey);

  let orderID = Math.floor(Math.random() + Date.now());

  let userEmail = localStorage.getItem("userEmail");
  let token = localStorage.getItem("token");
  useEffect(() => {
    if (userEmail) {
      setemail(userEmail);
    }
    fetchData(token);
  }, []);

  const [disabled, setdisabled] = useState(true);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState("");
  const [pincode, setpincode] = useState("");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");

  useEffect(() => {
    setTimeout(() => {
      if (
        name.length > 3 &&
        email.length > 3 &&
        address.length > 3 &&
        phone.length > 3 &&
        pincode.length > 3
      ) {
        setdisabled(false);
      } else {
        setdisabled(true);
      }
    }, 100);
  }, [name, email, address, phone, pincode]);
  const handleChange = async (e) => {
    if (e.target.name == "name") {
      setname(e.target.value);
    } else if (e.target.name == "email") {
      setemail(e.target.value);
    } else if (e.target.name == "address") {
      setaddress(e.target.value);
    } else if (e.target.name == "phone") {
      setphone(e.target.value);
    } else if (e.target.name == "pincode") {
      setpincode(e.target.value);

      if (e.target.value.length == 5) {
        const pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
        const pinJson = await pins.json();
        if (Object.keys(pinJson).includes(e.target.value)) {
          setcity(pinJson[e.target.value][0]);
          setstate(pinJson[e.target.value][1]);
        } else {
          setcity("");
          setstate("");
        }
      } else {
        setcity("");
        setstate("");
      }
    }
  };
  const fetchData = async (token) => {
    const res = await fetch("http://localhost:3000/api/getUser", {
      method: "POST",
      body: JSON.stringify({ token: token }),
    });
    const user = await res.json();
    setname(user.name);
    setphone(user.phone);
    setpincode(user.pincode);
    setaddress(user.address);
    fetchPincode(user.pincode);

    console.log(user);
  };

  const fetchPincode = async (pincode) => {
    const pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
    const pinJson = await pins.json();
    if (Object.keys(pinJson).includes(pincode)) {
      setcity(pinJson[pincode][0]);
      setstate(pinJson[pincode][1]);
    } else {
      setcity("");
      setstate("");
    }
  };
  const handleCheckout = async () => {
    // let {name, color} = cart["Wear the Waleed Premium-M"]
    const res = await fetch("http://localhost:3000/api/create-stripe-session", {
      method: "POST",
      body: JSON.stringify({
        items: cart,
        email: email,
        name,
        address,
        city,
        state,
        phone,
        pincode,
        orderID,
        subTotal,
        cart,
      }),
    });
    const id = await res.json();
    localStorage.setItem("orderID", orderID);
    // client side stripe package!
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
    if (stripe && id.success) {
      // method which redirect user to stripe checkout page.
      stripe.redirectToCheckout({
        sessionId: id.id, // id come from our api response
      });
    } else {
      // console.log(id.error);
      if (res.clearCart) {
        clearCart();
      }
      toast.error(id.error, {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  return (
    <>
      <div className="container sm:m-auto px-2">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {/* Same as */}
        <ToastContainer />
        <h1 className="font-bold text-2xl my-8 text-center">CheckOut</h1>
        <h2 className="text-xl font-semibold md:mx-40">1. Delivery Details</h2>

        <div className="md:mx-40 flex my-4 justify-center">
          {/* for name and email Start*/}
          <div className="px-2 w-1/2">
            <div className=" mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                Name
              </label>
              <input
                onChange={handleChange}
                value={name}
                type="text"
                id="name"
                name="name"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>

          <div className="px-2 w-1/2">
            <div className=" mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              {userEmail ? (
                <input
                  onChange={handleChange}
                  value={userEmail}
                  readOnly={true}
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              ) : (
                <input
                  onChange={handleChange}
                  value={email}
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              )}
            </div>
          </div>
        </div>
        {/* for name and email end*/}

        {/* for address start*/}
        <div className="px-2 w-full">
          <div className="mb-4 md:mx-40">
            <label
              htmlFor="address"
              className="leading-7 text-sm text-gray-600"
            >
              Address
            </label>
            <textarea
              onChange={handleChange}
              value={address}
              name="address"
              cols="30"
              rows="2"
              id="address"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            ></textarea>
          </div>
        </div>
        {/* for address end*/}

        {/* for phone and city Start*/}
        <div className="md:mx-40 flex my-4 justify-center">
          <div className="px-2 w-1/2">
            <div className=" mb-4">
              <label
                htmlFor="phone"
                className="leading-7 text-sm text-gray-600"
              >
                Phone
              </label>
              <input
                onChange={handleChange}
                placeholder="Your 11 digit Phone Number"
                value={phone}
                type="text"
                id="phone"
                name="phone"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>

          <div className="px-2 w-1/2">
            <div className=" mb-4">
              <label
                htmlFor="pincode"
                className="leading-7 text-sm text-gray-600"
              >
                PinCode
              </label>
              <input
                onChange={handleChange}
                value={pincode}
                type="text"
                id="pincode"
                name="pincode"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
        </div>
        {/* for phone and city END */}

        {/* for State and  Pincode*/}
        <div className="md:mx-40 flex my-4 justify-center">
          <div className="px-2 w-1/2">
            <div className=" mb-4">
              <label
                htmlFor="state"
                className="leading-7 text-sm text-gray-600"
              >
                State
              </label>
              <input
                value={state}
                onChange={handleChange}
                type="text"
                id="state"
                name="state"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>

          <div className="px-2 w-1/2">
            <div className=" mb-4">
              <label htmlFor="city" className="leading-7 text-sm text-gray-600">
                City
              </label>
              <input
                value={city}
                onChange={handleChange}
                type="text"
                id="city"
                name="city"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
        </div>
        {/* for State and Pincode END */}

        <h2 className="text-xl font-semibold md:mx-40 mb-4">
          2. Review Cart Items
        </h2>

        {/* sidecart div to show cart items start */}
        <div className=" sideCart bg-white  border-gray-300 border-2 py-2 md:mx-40 max-sm:mx-1">
          <div className="flex justify-center items-start border-gray-300 border-b-2 py-2">
            <BsFillBagCheckFill className="m-1 text-xl" />
            <h2 className="font-bold text-xl text-center">Shopping Cart</h2>
          </div>

          <ol className="list-decimal font-semibold mx-10">
            {Object.keys(cart).length == 0 && (
              <p className="text-center font-semibold my-10">
                Your cart is currently empty.
              </p>
            )}
            {Object.keys(cart).map((k) => {
              return (
                <li key={k}>
                  <div className="item flex mt-10">
                    <div className="w-1/2 font-semibold">
                      {cart[k].name +
                        " " +
                        "(" +
                        cart[k].size +
                        "/" +
                        cart[k].variant}
                      )
                    </div>
                    <div className="flex justify-center items-center font-semibold text-lg ">
                      <AiOutlineMinusCircle
                        className="cursor-pointer"
                        onClick={() => {
                          removeFromCart(
                            k,
                            1,
                            cart[k].price,
                            cart[k].name,
                            cart[k].size,
                            cart[k].variant
                          );
                        }}
                      />
                      <span className="mx-2">{cart[k].qty}</span>
                      <AiOutlinePlusCircle
                        className="cursor-pointer"
                        onClick={() => {
                          addToCart(
                            k,
                            1,
                            cart[k].price,
                            cart[k].name,
                            cart[k].size,
                            cart[k].variant
                          );
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <span className="font-bold m-10 mt-10 ">SubTotal: ${subTotal}</span>
        </div>
        {/* sidecart div to show cart items end*/}
        <div className="md:mx-40">
          <Link href={"/checkout"}>
            <button
              disabled={disabled}
              className="flex mx-1 mt-5 text-white bg-black border-0 py-2 px-4 focus:outline-none hover:bg-slate-800 rounded text-lg tracking-widest disabled:bg-gray-700"
              onClick={handleCheckout}
            >
              <BsFillBagCheckFill className="m-1" />
              Pay ${subTotal}
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Checkout;
