"use strict";
// for ignoring ts  @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const exp = require("constants");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const Customer = require("./models/customer");
const customer_1 = __importDefault(require("./models/customer"));
const cors = require("cors");
const app = express();
mongoose.set("strictQuery", false);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;
app.get("/", (req, res) => {
    res.send("Welcome !!");
});
app.get("/api/customers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // show all collection in the database
    // console.log(await mongoose.connection.db.listCollections().toArray());
    try {
        const result = yield customer_1.default.find();
        res.json({ customers: result });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.get("/api/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({
        requestParams: req.params,
        requestQuery: req.query,
    });
    try {
        const { id: customerId } = req.params;
        console.log(customerId);
        const customer = yield customer_1.default.findById(customerId);
        console.log(customer);
        if (!customer) {
            res.status(400).json({ error: "User not found." });
        }
        else {
            res.json({ customer });
        }
    }
    catch (e) {
        res.status(500).json({ error: "Something went wrong" });
    }
}));
app.put("/api/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const customer = yield customer_1.default.findOneAndReplace({ _id: customerId }, req.body, { new: true });
        // res.json({ customer: customer });
        // above and below is same this
        res.json({ customer });
    }
    catch (e) {
        res.status(500).json({ error: "something went wrong" });
    }
}));
app.patch("/api/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const customer = yield customer_1.default.findByIdAndUpdate({ _id: customerId }, req.body, { new: true });
        // res.json({ customer: customer });
        // above and below is same this
        res.json({ customer });
    }
    catch (e) {
        res.status(500).json({ error: "something went wrong" });
    }
}));
// update order directly
app.patch("/api/orders/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    req.body._id = orderId;
    try {
        const result = yield customer_1.default.findOneAndUpdate({ "order._id": orderId }, { $set: { "order.$": req.body } }, { new: true });
        console.log(result);
        if (result) {
            res.json(result);
        }
        else {
            res.status(400).json({ error: "Order not found" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: "Something went wrong" });
    }
}));
//get order by id
app.get("/api/orders/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield customer_1.default.findOne({ "order._id": req.params.id });
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ error: "Order not found" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: "Something went wrong" });
    }
}));
app.delete("/api/customers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const result = yield customer_1.default.deleteOne({ _id: customerId });
        res.json({ deletedCount: result.deletedCount });
    }
    catch (e) {
        res.status(500).json({ error: "Something went wrong" });
    }
}));
app.post("/api/customers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const customer = new customer_1.default(req.body);
    try {
        yield customer.save();
        res.status(201).json({ customer });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(CONNECTION);
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }
    catch (error) {
        console.log(error.message);
    }
});
start();
