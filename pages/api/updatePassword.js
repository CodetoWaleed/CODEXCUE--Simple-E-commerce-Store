import connectDb from "@/middlewares/mongoose";
import User from "@/models/User";
import jsonwebtoken from "jsonwebtoken";
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  if (req.method == "POST") {
    const {
      token: token,
      password,
      Npassword,
      CNpassword,
    } = JSON.parse(req.body);

    let user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    let userFound = await User.findOne({ email: user.email });

    var bytes = CryptoJS.AES.decrypt(
      userFound.password,
      process.env.AES_SECRET
    );
    var DecryptPassword = bytes.toString(CryptoJS.enc.Utf8);

    console.log(user);
    if (DecryptPassword == password && Npassword == CNpassword) {
      let userUpdate = await User.findOneAndUpdate(
        { email: user.email },
        {
          password: CryptoJS.AES.encrypt(
            CNpassword,
            process.env.AES_SECRET
          ).toString(),
        }
      );
      res.status(200).json({
        success: true,
      });
      return;
    } else {
      res.status(200).json({
        success: false,
      });
    }
  } else {
    res.status(400).json({ error: "Bad request" });
  }
};
export default connectDb(handler);
