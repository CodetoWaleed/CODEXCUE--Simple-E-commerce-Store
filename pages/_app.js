import "@/styles/globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "react-top-loading-bar";
import Router from "next/router";

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [subTotal, setsubTotal] = useState(0);
  const [user, setuser] = useState({ value: null });
  const [key, setkey] = useState(0);
  const [progress, setProgress] = useState(0);

  const router = useRouter();

  useEffect(() => {
    Router.events.on("routeChangeStart", () => setProgress(40));
    Router.events.on("routeChangeComplete", () => setProgress(100));

    let token = localStorage.getItem("token");
    if (token) {
      setuser({ value: token });
    }
    setkey(Math.random()); //??This is to render navbar component on page load

    // console.log("i am useEffct from app.js")
    // console.log("cart use effect = " + JSON.stringify(cart))
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart")));
      } else {
        console.log("No item present");
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }
  }, [router.query]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("orderID");
    setuser({ value: null });
    setkey(Math.random());
    router.push("/login");
    toast.success("your have been Logout!!!", {
      position: "top-left",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    clearCart();
  };
  const addToCart = (itemCode, qty, price, name, size, variant) => {
    if (Object.keys(cart).length == 0) {
      setkey(Math.random());
    }
    let newCart = cart;
    // console.log("newCart = "+JSON.parse(newCart))
    // console.log("cart = "+JSON.parse(cart))
    // console.log("items = " + itemCode, qty, price, name, size, variant)

    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty + qty;
    } else {
      newCart[itemCode] = { itemCode, qty: 1, price, name, size, variant };
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (itemCode, qty, price, name, size, variant) => {
    let newCart = JSON.parse(JSON.stringify(cart));
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty - qty;
      // console.log(JSON.stringify(newCart));
    }
    if (newCart[itemCode]["qty"] <= 0) {
      delete newCart[itemCode];
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
    // console.log("your have been Logout");
  };

  const saveCart = (myCart) => {
    // console.log("cart = "+ JSON.stringify(cart))

    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;
    let keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }
    setsubTotal(subt);
  };
  // console.log("cart app js= "+ JSON.stringify(cart))

  const buyNow = (itemCode, qty, price, name, size, variant) => {
    let newCart = {};
    newCart[itemCode] = { qty: 1, price, name, size, variant };
    setCart(newCart);
    saveCart(newCart);
    router.push("/checkout");
  };
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <LoadingBar
        color="#000"
        progress={progress}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />
      {key && (
        <Navbar
          user={user}
          logout={logout}
          key={key}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          subTotal={subTotal}
        />
      )}

      <Component
        buyNow={buyNow}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        {...pageProps}
      />
      <Footer />
    </>
  );
}
