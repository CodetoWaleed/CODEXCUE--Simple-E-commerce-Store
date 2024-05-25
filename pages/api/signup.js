import connectDb from "@/middlewares/mongoose";
import User from "@/models/User";
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  if (req.method == "POST") {
    console.log(req.body);
    const { name, email } = req.body;
    var decPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.AES_SECRET
    ).toString();

    let user = new User({
      name,
      email,
      password: decPassword,
    });
    await user.save();
    res.status(200).json({ success: "User has been created!!!", user: user });
  } else {
    res.status(400).json({ error: "Bad request" });
  }
};
export default connectDb(handler);
