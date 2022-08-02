import { Msg } from "./../../node_modules/mongodb/src/cmap/commands";
import express from "express";
import { body, validationResult } from "express-validator";
import User from "../Models/user";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { checkAuth } from "../Middleware/checkAuth";
import { stripe } from "../utils/stripe";

const router = express.Router();

router.post(
  "/signup",
  body("email").isEmail().withMessage("The email is invalid"),
  body("password").isLength({ min: 5 }).withMessage("the password is invalid"),
  async (req: any, res: any) => {
    const { email, password } = req.body;
    const validationErros = validationResult(req);
    // validate email
    if (!validationErros.isEmpty()) {
      const errors = validationErros.array().map((error) => {
        return {
          msg: error.msg,
        };
      });
      return res.json({ errors, data: null });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        errors: [
          {
            msg: "Email already in used",
          },
        ],
        data: null,
      });
    }

    //   hasing password
    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await stripe.customers.create(
      {
        email,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );

    const newUser = await User.create({
      email,
      password: hashedPassword,
      customerStripeId: customer.id,
    });

    //   create a token
    const token = await JWT.sign(
      { email: newUser.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: 360000,
      }
    );
    res.json({
      errors: [],
      data: {
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          stripeCustomerId: customer.id,
        },
      },
    });
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      errors: {
        msg: "Invalids credentials , ",
      },
      data: null,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({
      errors: [
        {
          msg: "Invalid password",
        },
      ],
      data: null,
    });
  }
  const token = await JWT.sign(
    { email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 3600000,
    }
  );

  return res.json({
    errors: [],
    data: {
      token,
      user,
    },
  });
});

router.get("/me", checkAuth, async (req, res) => {
  const user = await User.findOne({ email: req.user });

  return res.json({
    errors: [],
    data: {
      user: {
        id: user?._id,
        email: user?.email,
        customerStripeId: user?.customerStripeId,
      },
    },
  });
});
export default router;
