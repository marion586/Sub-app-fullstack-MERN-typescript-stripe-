import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // req request from client
  //res response , just ability to response to client
  //next mean , everthing is fine  i gonna invoque this next function which mean go to the route handler or the next iddleware inside this middlware
  let token = req.header("authorization");
  if (!token) {
    return res.status(403).json({
      errors: [
        {
          msg: "unauthorized",
        },
      ],
    });
  }

  token = token.split(" ")[1];
  try {
    const user = (await JWT.verify(
      token,
      process.env.JWT_SECRET as string //it' s completely string
    )) as { email: string }; //we get back something called email as a string

    //take the request and set a propperty inside request
    //req.user =  user.email it fine with js but not with ts
    console.log(user);
    req.user = user.email;
    next();
  } catch (error) {
    return res.status(403).json({
      errors: [
        {
          msg: "unauthorized",
        },
      ],
    });
  }
};
