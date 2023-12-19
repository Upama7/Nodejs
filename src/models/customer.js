"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
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
const Customer = (0, mongoose_1.model)("customer", customerSchema);
const c = new Customer({
    name: "test",
    indestry: "tesst",
});
// console.log(c.n());
exports.default = Customer;
