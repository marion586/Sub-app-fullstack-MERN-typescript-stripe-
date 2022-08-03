import express from "express";
import { body, validationResult } from "express-validator";
import User from "../Models/user";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { checkAuth } from "../Middleware/checkAuth";
import { stripe } from "../utils/stripe";
import article from "../Models/article";

const router = express.Router();

router.get("/", checkAuth, async (req, res) => {
  const user = await User.findOne({ email: req.user });

  const subscriptions = await stripe.subscriptions.list(
    {
      customer: user?.customerStripeId,
      status: "all",
      expand: ["data.default_payment_method"],
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );
  if (!subscriptions.data.length) return res.json([]);

  //@ts-ignore
  const plan = subscriptions.data[0].plan.nickname;
  if (plan === "Basic") {
    const articles = await article.find({ access: "Basic" });
    return res.json(articles);
  } else if (plan === "Standard") {
    const articles = await article.find({
      access: { $in: ["Basic", "Standard"] },
    });
    return res.json(articles);
  } else {
    const articles = await article.find({});
    return res.json(articles);
  }
  res.json(plan);
});

export default router;
