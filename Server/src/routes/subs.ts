import express from "express";
import { checkAuth } from "../Middleware/checkAuth";
import article from "../Models/article";
import User from "../Models/user";
import { stripe } from "../utils/stripe";

const router = express.Router();
router.get("/prices", async (req, res) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_SECRET_KEY,
  });

  return res.json(prices);
});

router.post("/session", checkAuth, async (req, res) => {
  console.log(req.body, "body");
  const user = await User.findOne({ email: req.user });

  article.create({
    title: " how to get money onlineke Chef Gordan  32",
    imageUrml: "https://unsplash.com/photos/cFbpaGykllw",
    content:
      "t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    access: "Premium",
  });

  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/articles",
      cancel_url: "http://localhost:3000/articles-plans",
      customer: user?.customerStripeId,
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );
  return res.json(session);
});
export default router;
