const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    orderId : {type : String , required : true},
    stripe_session_ID  : {type: String , default : ""},
    products: {type: Object, required: true},
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "Pending", required: true },
    deliveryStatus: { type: String, default: "Unshipped", required: true },
  },
  { timestamps: true }
);
mongoose.models = {}
export default mongoose.model("Order", OrderSchema);
// export default mongoose.models.Order || mongoose.model("Order",OrderSchema)








