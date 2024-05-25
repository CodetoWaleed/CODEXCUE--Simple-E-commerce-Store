import connectDb from "@/middlewares/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";

const handler = async (req, res) => {
  if (req.method == "POST") {
    // console.log(req.body);
    const { orderID } = req.body;

    let order = await Order.findOneAndUpdate(
      { orderId: orderID },
      {
        status: "Paid",
        // stripe_session_ID: session_id,
      }
    );
    let products = order.products;
    // console.log(products)
    // return
    for (let slug in products) {
      
      await Product.findOneAndUpdate(
        { slug: slug },
        { $inc: { "availableQty": -products[slug].qty } }
      );
    }

    res
      .status(200)
      .json({ success: "Order has been Updated!!!", order: order });
  } else {
    res.status(400).json({ error: "Bad request" });
  }
};
export default connectDb(handler);
