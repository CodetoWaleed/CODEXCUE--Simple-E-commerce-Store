import { React, useState, useEffect } from "react";
import { isBrowser } from "next/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const myAccount = ({ userEmail }) => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState("");
  const [pincode, setpincode] = useState("");
  const [password, setpassword] = useState("");
  const [Npassword, setNpassword] = useState("");
  const [CNpassword, setCNpassword] = useState("");
  const [token, settoken] = useState("");

  useEffect(() => {
    let userEmailUser = localStorage.getItem("userEmail");
    let token = localStorage.getItem("token");
    settoken(token);
    setemail(userEmailUser);
    fetchData(token);
  }, []);

  const handleChange = async (e) => {
    if (e.target.name == "name") {
      setname(e.target.value);
    } else if (e.target.name == "address") {
      setaddress(e.target.value);
    } else if (e.target.name == "phone") {
      setphone(e.target.value);
    } else if (e.target.name == "pincode") {
      setpincode(e.target.value);
    } else if (e.target.name == "password") {
      setpassword(e.target.value);
    } else if (e.target.name == "Npassword") {
      setNpassword(e.target.value);
    } else if (e.target.name == "CNpassword") {
      setCNpassword(e.target.value);
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

    console.log(user);
  };

  const updateUserDetails = async () => {
    const res = await fetch("http://localhost:3000/api/updateUser", {
      method: "POST",
      body: JSON.stringify({ token: token, name, phone, address, pincode }),
    });
    const user = await res.json();
    if (user.success) {
      toast.success("User Successfully Updated!!!", {
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
    const res = await fetch("http://localhost:3000/api/updatePassword", {
      method: "POST",
      body: JSON.stringify({ token: token, password, Npassword, CNpassword }),
    });
    const passwordUpdate = await res.json();
    setNpassword("")
    setpassword("")
    setCNpassword("")

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
      toast.error("Error Updating!!!", {
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
        <div className="container my-20">
          <h1 className="font-bold text-3xl  text-center mb-10">
            Update your Account Details
          </h1>

          <div className="md:mx-40 flex my-4 justify-center">
            {/* for name and email Start*/}
            <div className="px-2 w-1/2">
              <div className=" mb-4">
                <label
                  htmlFor="name"
                  className="leading-7 text-sm text-gray-600"
                >
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
                  Email (This can't be changed)
                </label>
                {email ? (
                  <input
                    value={email}
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

          {/* for phone and PinCode Start*/}
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
          {/* for phone and PinCode END */}

          <button
            className="flex mx-auto mt-5 text-white bg-black border-0 py-2 px-4 focus:outline-none hover:bg-slate-800 rounded text-lg tracking-widest disabled:bg-gray-700"
            onClick={updateUserDetails}
          >
            Update your Details
          </button>
        </div>
      </div>

      {/* for password and confirmpassword Start*/}
      <h1 className="font-bold text-3xl  text-center">
        Update your Password here
      </h1>
      <div className="md:mx-40 flex my-4 justify-center">
        <div className="px-2 w-1/2">
          <div className=" mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
              Password
            </label>
            <input
              onChange={handleChange}
              value={password}
              type="text"
              id="password"
              name="password"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>

        <div className="px-2 w-1/2">
          <div className=" mb-4">
            <label
              htmlFor="Npassword"
              className="leading-7 text-sm text-gray-600"
            >
              New Password
            </label>
            <input
              onChange={handleChange}
              value={Npassword}
              type="text"
              id="Npassword"
              name="Npassword"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className=" mb-4">
            <label
              htmlFor="CNpassword"
              className="leading-7 text-sm text-gray-600"
            >
              Confirm New Password
            </label>
            <input
              onChange={handleChange}
              value={CNpassword}
              type="text"
              id="CNpassword"
              name="CNpassword"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
      </div>

      <button
        className="flex mx-auto mt-5 text-white bg-black border-0 py-2 px-4 focus:outline-none hover:bg-slate-800 rounded text-lg tracking-widest disabled:bg-gray-700"
        onClick={updatePassword}
      >
        Update Password
      </button>
      {/* for password and confirmpassword END */}
    </>
  );
};

// export const getServerSideProps = async () => {
//   const userEmail = isBrowser ? localStorage.getItem("userEmail") : "default";

//   return {
//     props: { userEmail: userEmail }, // will be passed to the page component as props
//   };
// };

export default myAccount;
