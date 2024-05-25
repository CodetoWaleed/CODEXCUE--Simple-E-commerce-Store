// <---------------------------------->
// api/payment/session.js
import Stripe from "stripe";
import absoluteUrl from "next-absolute-url";
import { map } from "next";
import Order from "@/models/Order";
import connectDb from "@/middlewares/mongoose";
import Product from "@/models/Product";
import pincodes from "./pincode.json";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const {
      email,
      items,
      name,
      address,
      phone,
      pincode,
      city,
      state,
      orderID,
      subTotal,
      cart,
    } = JSON.parse(req.body);

    // let transformedItem;

    // Object.keys(items).map((item) => {
    //   transformedItem = {
    //     price_data: {
    //       currency: "usd",
    //       // product: items[item].itemCode, // Specify the product ID
    //       product_data: {
    //         name: items[item].name,
    //       },
    //       unit_amount: items[item].price * 100,
    //       // unit_amount: items[item].price,
    //     },
    //     // description: items[item].itemCode,
    //     quantity: items[item].qty,
    //   };
    // });
    // console.log(transformedItem);

    // check if the Pincode is serviceable

    if (!Object.keys(pincodes).includes(pincode)) {
      res.status(200).json({
        success: false,
        error:
          "The Pincode you entered is not Servicable, Please try another one!!!",
        clearCart: false,
      });
      return;
    }

    //check if the cart is tempered

    let product,
      check_subTotal = 0;
    let check_cart = cart;
    if (subTotal <= 0) {
      res.status(200).json({
        success: false,
        error: "Cart Empty, Please Build your cart Again!!!",
        clearCart: true,
      });
      return;
    }
    for (let item in check_cart) {
      check_subTotal += check_cart[item].price * check_cart[item].qty;
      product = await Product.findOne({ slug: item });
      //check if the cart items are out of stock
      if (product.availableQty < check_cart[item].qty) {
        res.status(200).json({
          success: false,
          error:
            "Some items in your cart went out of Stock, Please try Again!!!",
          clearCart: true,
        });
        return;
      }
      if (product.price != check_cart[item].price) {
        console.log("check product price");
        res.status(200).json({
          success: false,
          error:
            "Price of some items in your Cart have changed, Please try Again!!!",
          clearCart: true,
        });
        return;
      }
      if (check_subTotal != subTotal) {
        // console.log(subTotal);

        // console.log("check subtotal");

        res.status(200).json({
          success: false,
          error:
            "Price of some items in your Cart have changed, Please try Again!!!",
          clearCart: true,
        });
        return;
      }
    }

    //check if the details are valid
    if (phone.length !== 11 || !Number.isInteger(Number(phone))) {
      res.status(200).json({
        success: false,
        error: "Please Enter your 11 digit phone number!!",
        clearCart: false,
      });
      console.log(phone.length);
      return;
    }

    if (pincode.length !== 5 || !Number.isInteger(Number(pincode))) {
      res.status(200).json({
        success: false,
        error: "Please Enter your 5 digit Pincode!!",
        clearCart: false,
      });
      return;
    }

    const { origin } = absoluteUrl(req);
    // redirect user after payment done to your website id and you can check by having CHECKOUT_SESSION_ID
    let success_uri = `${origin}/order/?session_id={CHECKOUT_SESSION_ID}`;
    // console.log(success_uri)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    });

    const { id } = await stripe.checkout.sessions.create({
      success_url: success_uri,
      cancel_url: `${origin}/checkout`,
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      // line_items: [transformedItem],
      line_items: Object.keys(items).map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: items[item].name,
            },
            unit_amount: items[item].price * 100,
          },
          quantity: items[item].qty,
        };
      }),
    });

    res.status(200).json({ id: id, success: true });

    //initiate an order corresponding to this order_ID

    let order = new Order({
      email: email,
      name: name,
      orderId: orderID,
      products: cart,
      address: address,
      pincode: pincode,
      city: city,
      state: state,
      phone: phone,
      amount: subTotal,
      stripe_session_ID: id,
    });
    await order.save();
    //initiate an order corresponding to this order_ID END
  }
};
export default connectDb(handler);
