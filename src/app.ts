// for ignoring ts  @ts-nocheck

// const exp = require("constants");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const Customer = require("./models/customer");
import Customer from "./models/customer";
const cors = require("cors");

import { Request, Response } from "express";

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

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome !!");
});

app.get("/api/customers", async (req: Request, res: Response) => {
  // show all collection in the database
  // console.log(await mongoose.connection.db.listCollections().toArray());
  try {
    const result = await Customer.find();
    res.json({ customers: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/customers/:id", async (req: Request, res: Response) => {
  console.log({
    requestParams: req.params,
    requestQuery: req.query,
  });
  try {
    const { id: customerId } = req.params;
    console.log(customerId);
    const customer = await Customer.findById(customerId);
    console.log(customer);
    if (!customer) {
      res.status(400).json({ error: "User not found." });
    } else {
      res.json({ customer });
    }
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.put("/api/customers/:id", async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOneAndReplace(
      { _id: customerId },
      req.body,
      { new: true }
    );
    // res.json({ customer: customer });
    // above and below is same this
    res.json({ customer });
  } catch (e) {
    res.status(500).json({ error: "something went wrong" });
  }
});

app.patch("/api/customers/:id", async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findByIdAndUpdate(
      { _id: customerId },
      req.body,
      { new: true }
    );
    // res.json({ customer: customer });
    // above and below is same this
    res.json({ customer });
  } catch (e) {
    res.status(500).json({ error: "something went wrong" });
  }
});

// update order directly
app.patch("/api/orders/:id", async (req: Request, res: Response) => {
  const orderId = req.params.id;
  req.body._id = orderId;
  try {
    const result = await Customer.findOneAndUpdate(
      { "order._id": orderId },
      { $set: { "order.$": req.body } },
      { new: true }
    );
    console.log(result);
    if (result) {
      res.json(result);
    } else {
      res.status(400).json({ error: "Order not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//get order by id
app.get("/api/orders/:id", async (req: Request, res: Response) => {
  try {
    const result = await Customer.findOne({ "order._id": req.params.id });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/api/customers/:id", async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({ _id: customerId });
    res.json({ deletedCount: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/customers", async (req: Request, res: Response) => {
  console.log(req.body);
  const customer = new Customer(req.body);
  try {
    await customer.save();
    res.status(201).json({ customer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  } catch (error) {
    console.log(error.message);
  }
};

start();
