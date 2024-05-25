import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Forgot = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const router = useRouter();
  let emailToken = router.query.token;
  useEffect(() => {
    console.log("token" + router.query.token);
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);

  const handleChange = async (e) => {
    if (e.target.name == "email") {
      setemail(e.target.value);
    } else if (e.target.name == "password") {
      setpassword(e.target.value);
    } else if (e.target.name == "cpassword") {
      setcpassword(e.target.value);
    }
  };
  const sendResetEmail = async () => {
    let data = { email: email, sendEmail: true };
    const res = await fetch("http://localhost:3000/api/sendResetEmail", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const emailSent = await res.json();
    if (emailSent.success) {
      console.log(emailSent);
      toast.success(emailSent.message, {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      sendEmail = false;
      console.log("errror");
      toast.error(emailSent.message, {
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

  const updatePassword = async () => {
    const res = await fetch("http://localhost:3000/api/sendResetEmail", {
      method: "POST",
      body: JSON.stringify({ cpassword, emailToken }),
    });
    const passwordUpdate = await res.json();
    setpassword("");
    setcpassword("");

    if (passwordUpdate.success) {
      toast.success("Password Successfully Updated!!!", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(passwordUpdate.message, {
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
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 max-h-screen">
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
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          alt="logo image"
          src="/Waleed-Wear.png"
          height={250}
          width={250}
          className="mx-9"
          priority="high"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset your Password here!
        </h2>
      </div>
      {router.query.token && (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                value={password}
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 px-2"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="cpassword"
              className="block text-sm font-medium leading-6 text-gray-900 my-2"
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                value={cpassword}
                id="cpassword"
                name="cpassword"
                type="password"
                required
                className="block w-full rounded-md my-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 px-2"
              />
            </div>
          </div>

          <div>
            <button
              onClick={updatePassword}
              type="submit"
              className="flex w-full justify-center rounded-md bg-black my-4 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white hover:text-black hover:border-2 hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Change Password...
            </button>
            {password != cpassword && (
              <span className="text-red-600">Password not Matching!!</span>
            )}
            {password && password == cpassword && (
              <span className="text-green-600">Password Matched!!</span>
            )}
          </div>
        </div>
      )}
      {!router.query.token && (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                value={email}
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 px-2"
              />
            </div>
          </div>

          <div>
            <button
              onClick={sendResetEmail}
              type="submit"
              className="flex w-full justify-center rounded-md bg-black px-3 my-4 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white hover:text-black hover:border-2 hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Continue...
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forgot;
