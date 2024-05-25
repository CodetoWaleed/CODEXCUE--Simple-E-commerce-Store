import connectDb from "@/middlewares/mongoose";
import Order from "@/models/Order";

const handler = async (req, res) => {
  if (req.method == "POST") {
    console.log(req.body);
    const { orderID } = req.body;
    // console.log("orderID find order" + orderID)

    let order = await Order.findOne({ orderId: orderID });

    res
      .status(200)
      .json({ success: "Here is your order", order: order });
  } else {
    res.status(400).json({ error: "Bad request" });
  }
};
export default connectDb(handler);
