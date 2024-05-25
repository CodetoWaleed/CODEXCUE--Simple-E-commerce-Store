import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AiOutlineShoppingCart,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
} from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { BsFillBagCheckFill } from "react-icons/bs"; //checked, but not sure if this is the best way to add an image to a button or something.  I
import { ImCross } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

AiOutlineShoppingCart;
const Navbar = ({
  user,
  key,
  cart,
  subTotal,
  clearCart,
  removeFromCart,
  addToCart,
  logout,
}) => {
  // console.log("cart"+cart, subTotal, clearCart, removeFromCart, addToCart);
  // console.log("cart navbar = " + cart);
  const [sideCart, setsideCartt] = useState(false);
  const router = useRouter();

  const toggleCart = () => {
    console.log("heloo");
    setsideCartt(!sideCart);
    // if (ref.current.classList.contains("translate-x-full")) {
    //   ref.current.classList.remove("translate-x-full");
    //   ref.current.classList.add("translate-x-0");
    // } else if (!ref.current.classList.contains("translate-x-full")) {
    //   ref.current.classList.remove("translate-x-0");
    //   ref.current.classList.add("translate-x-full");
    // }
  };
  useEffect(() => {
    Object.keys(cart).length !== 0 && setsideCartt(true);
    let exempted = [
      "/checkout",
      "/order",
      "/orders",
      "/orderDetail",
      "/account",
      "/",
    ];
    console.log(router.pathname);
    if (exempted.includes(router.pathname)) {
      setsideCartt(false);
    }
  }, []);

  const ref = useRef();
  const [dropDown, setdropDown] = useState(false);

  return (
    <div
      className={`flex justify-between navbar-main sticky flex-col items-center md:flex-row md:justify-start py-2 shadow-2xl top-0 z-10 bg-white ${
        !sideCart && "overflow-hidden"
      }`}
    >
      <div className="logo mx-5">
        <Link href={"/"}>
          <Image
            alt="logo image"
            src="/Waleed-Wear.png"
            height={250}
            width={250}
            className="mx-9"
            priority="high"
          />
        </Link>
      </div>
      <div className="nav">
        <ul className="flex items-center space-x-5 font-bold md:text-md">
          <Link
            href={"/tshirts"}
            className="p-2 hover:text-gray-800 hover:mb-0.5"
          >
            <li>T-Shirts</li>
          </Link>
          <Link href={"/mugs"} className="p-2 hover:text-gray-800 hover:mb-0.5">
            <li>Mugs</li>
          </Link>
          <Link
            href={"/hoodies"}
            className="p-2 hover:text-gray-800 hover:mb-0.5"
          >
            <li>Hoodies</li>
          </Link>
          <Link
            href={"/stickers"}
            className="p-2 hover:text-gray-800 hover:mb-0.5"
          >
            <li>Stickers</li>
          </Link>
        </ul>
      </div>

      {dropDown && (
        <div
          className="bg-black flex absolute right-0 md:top-30 max-sm:top-20 mx-5"
          onMouseOver={() => {
            setdropDown(true);
          }}
          onMouseLeave={() => {
            setdropDown(false);
          }}
        >
          <ul className=" right-12 w-40 py-2 md:mt-2 max-sm:mt-8 rounded-lg shadow-2xl bg-gray-800 text-white fixed">
            <Link href={"/account"}>
              <li className="flex w-full items-center px-3 py-2 text-sm hover:bg-gray-700">
                My Account
              </li>
            </Link>
            <Link href={"/orders"}>
              <li className="flex w-full items-center px-3 py-2 text-sm hover:bg-gray-700">
                My Orders
              </li>
            </Link>
            <li
              onClick={logout}
              className="flex w-full items-center px-3 py-2 text-sm hover:bg-gray-700 cursor-pointer"
            >
              Logout
            </li>
          </ul>
        </div>
      )}

      <div className="cart absolute right-0 mx-5 top-10 md:mx-5 flex max-sm:mt-11 max-sm:ml-12">
        {user.value && (
          <Link href={"/login"}>
            <MdAccountCircle
              className="text-3xl cursor-pointer mx-4"
              onMouseOver={() => {
                setdropDown(true);
              }}
              onMouseLeave={() => {
                setdropDown(false);
              }}
            />
          </Link>
        )}
        {!user.value && (
          <Link
            href={"/login"}
            className="rounded-md bg-black px-3 py-2 mx-2 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-black hover:border hover:border-black"
          >
            <button className="">Login</button>
          </Link>
        )}
        <AiOutlineShoppingCart
          className="text-3xl cursor-pointer"
          onClick={toggleCart}
        />
      </div>

      <div
        key={key}
        className={`md:w-96 sm:w-50 h-[100vh] overflow-y-scroll sideCart absolute top-0  bg-white  border-gray-300 border-2 py-10 px-8 transition-all  ${
          sideCart ? "right-0" : "-right-96"
        } `}
      >
        <div className="flex justify-center items-start border-slate-500 border-b-2 py-2">
          <BsFillBagCheckFill className="m-1 text-xl" />
          <h2 className="font-bold text-xl text-center">Shopping Cart</h2>
        </div>
        <span
          className="absolute top-2 right-2 cursor-pointer text-xl"
          onClick={toggleCart}
        >
          <ImCross className="my-4 mx-2" />
        </span>
        <ol className="list-decimal font-semibold ">
          {Object.keys(cart).length == 0 && (
            <p className="text-center font-semibold my-10">
              Your cart is currently empty.
            </p>
          )}
          {Object.keys(cart).map((k) => {
            return (
              <li key={k}>
                <div className="item flex my-2 mt-5">
                  <div className="w-2/3 font-semibold">
                    {cart[k].name +
                      " " +
                      "(" +
                      cart[k].size +
                      "/" +
                      cart[k].variant}
                    )
                  </div>
                  <div className="flex w-1/3 justify-center items-center font-semibold text-lg ">
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
        <div className="font-semibold block mt-5 left-0">
          SubTotal: ${subTotal}
        </div>

        <div className="flex">
          <Link href={"/checkout"}>
            <button
              disabled={Object.keys(cart).length === 0}
              className="flex mx-1 mt-16 text-white bg-black disabled:bg-slate-700 border-0 py-2 px-4 focus:outline-none hover:bg-slate-800 rounded text-lg tracking-wider"
            >
              <BsFillBagCheckFill className="m-1" />
              Checkout
            </button>
          </Link>

          <button
            onClick={clearCart}
            disabled={Object.keys(cart).length === 0}
            className="flex mx-1 mt-16 text-white bg-black border-0 disabled:bg-slate-700 py-2 px-4 focus:outline-none hover:bg-slate-800 rounded text-lg"
          >
            <BsFillBagCheckFill className="m-1" />
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
