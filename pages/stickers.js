import Link from "next/link";
import React from "react";
import mongoose from "mongoose";
import Product from "@/models/Product";
import connectDb from "@/middlewares/mongoose";

const Stickers = ({ products }) => {
  // console.log(products);
  return (
    <div>
      <section className="text-gray-600 body-font sm:ml:0">
        <div className="container py-24  mx-auto px-5 ">
          <div className="flex flex-wrap -m-4 justify-center">
            {Object.keys(products).length == 0 ? <p>Sorry! All the Stickers are out of Stock, Stay Tuned and more Stock Coming Soon</p> : ""}
            {Object.keys(products).map((item) => {
              return (
                <div
                  className="lg:w-1/4 md:w-1/2 p-4 md:mx-2 w-full shadow-lg "
                  key={products[item]._id}
                >
                  <Link
                    passHref={true}
                    href={`/products/${products[item].slug}`}
                  >
                    <img
                      alt="ecommerce"
                      className="m-auto h-[40vh] md:h-[40vh] block"
                      src={products[item].img}
                    />
                    <div className="mt-4 text-center md:text-left">
                      <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                        {products[item].category}
                      </h3>
                      <h2 className="text-gray-900 title-font text-lg font-medium">
                        {products[item].title}
                      </h2>
                      <p className="mt-1">${products[item].price}</p>
                      <div className="mt-1">
                        {products[item].size.includes("S") && (
                          <span className="border border-gray-600 px-1 mx-1">
                            S
                          </span>
                        )}
                        {products[item].size.includes("M") && (
                          <span className="border border-gray-600 px-1 mx-1">
                            M
                          </span>
                        )}
                        {products[item].size.includes("L") && (
                          <span className="border border-gray-600 px-1 mx-1">
                            L
                          </span>
                        )}
                        {products[item].size.includes("XL") && (
                          <span className="border border-gray-600 px-1 mx-1">
                            XL
                          </span>
                        )}
                        {products[item].size.includes("XXL") && (
                          <span className="border border-gray-600 px-1 mx-1">
                            XXL
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        {products[item].color.includes("red") && (
                          <button class="border-2 border-gray-300 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none"></button>
                        )}
                        {products[item].color.includes("green") && (
                          <button class="border-2 border-gray-300 ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none"></button>
                        )}
                        {products[item].color.includes("black") && (
                          <button class="border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>
                        )}
                        {products[item].color.includes("blue") && (
                          <button class="border-2 border-gray-300 ml-1 bg-blue-700 rounded-full w-6 h-6 focus:outline-none"></button>
                        )}
                        {products[item].color.includes("purple") && (
                          <button class="border-2 border-gray-300 ml-1 bg-purple-700 rounded-full w-6 h-6 focus:outline-none"></button>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
export const getServerSideProps = async () => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  let products = await Product.find({ category: "stickers" });

  let stickers = {};
  for (let item of products) {
    if (item.title in stickers) {
      if (
        !stickers[item.title].color.includes(item.color) &&
        item.availableQty > 0
      ) {
        stickers[item.title].color.push(item.color);
      }
      if (
        !stickers[item.title].size.includes(item.size) &&
        item.availableQty > 0
      ) {
        stickers[item.title].size.push(item.size);
      }
    } else {
      stickers[item.title] = JSON.parse(JSON.stringify(item));
      if (item.availableQty > 0) {
        stickers[item.title].color = [item.color];
        stickers[item.title].size = [item.size];
      }
    }
  }

  return {
    props: { products: JSON.parse(JSON.stringify(stickers)) }, // will be passed to the page component as props
  };
};

export default Stickers;
