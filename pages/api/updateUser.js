import connectDb from "@/middlewares/mongoose";
import User from "@/models/User";
import jsonwebtoken from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method == "POST") {
    const { token, address, pincode, name, phone } = JSON.parse(req.body);
    let user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    console.log(user);
    let userUpdate = await User.findOneAndUpdate(
      { email: user.email },
      {
        "address": address,
        "pincode": pincode,
        "name": name,
        "phone": phone,
      }
    );

    res.status(200).json({
      success: true,
      userUpdate,
    });
  } else {
    res.status(400).json({ error: "Bad request" });
  }
};
export default connectDb(handler);
