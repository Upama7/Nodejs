// const mongoose = require("mongoose");
import { HydratedDocument, Schema, model } from "mongoose";

interface Iorder {
  description: string;
  priceInRs?: number;
}

interface ICustomer {
  name: string;
  industry?: string;
  order?: Iorder[];
}

const customerSchema = new Schema<ICustomer>({
  name: {
    type: String,
    required: true,
  },
  industry: String,
  order: [
    {
      description: String,
      priceInRs: Number,
    },
  ],
});

// module.exports = mongoose.model("customer", customerSchema);
const Customer = model("customer", customerSchema);
const c: HydratedDocument<ICustomer> = new Customer({
  name: "test",
  indestry: "tesst",
});
// console.log(c.n());
export default Customer;
