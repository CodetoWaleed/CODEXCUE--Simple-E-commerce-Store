import connectDb from "@/middlewares/mongoose";
import User from "@/models/User";
import jsonwebtoken from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method == "POST") {
    const { token } = JSON.parse(req.body);
    let user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    let userFound = await User.findOne({ email: user.email });
    const {name, email, address, pincode, phone} = userFound
    
    res.status(200).json({ success: "Here is your User",name, email, address, pincode, phone });
  } else {
    res.status(400).json({ error: "Bad request" });
  }
};
export default connectDb(handler);
