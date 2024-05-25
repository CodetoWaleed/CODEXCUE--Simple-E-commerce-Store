import mongoose from "mongoose";
import connectDb from "@/middlewares/mongoose";
import Product from "@/models/Product";

const handler = async (req, res) => {
  if (req.method == "POST") {
    for (let i = 0; i < req.body.length; i++) {
      let getProductById = await Product.findByIdAndUpdate(req.body[i]._id, req.body[i]);
    }
    res.status(200).json({success : "Successfully Updated!!!"})
  } else {
    res.status(400).json({ error: "This method is not allowed!" });
  }
}
export default connectDb(handler)