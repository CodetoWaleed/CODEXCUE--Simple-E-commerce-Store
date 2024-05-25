import connectDb from "@/middlewares/mongoose";
import Order from "@/models/Order";
import jsonwebtoken from "jsonwebtoken"

const handler = async (req, res) => {
  if (req.method == "POST") {
    const  token  = req.body.token;
    const data = jsonwebtoken.verify( token, process.env.JWT_SECRET );
    let orders = await Order.find({ email: data.email });

    res.status(200).json({ orders: orders });
  } else {
    res.status(400).json({ error: "Bad request" });
  }
};
export default connectDb(handler);
