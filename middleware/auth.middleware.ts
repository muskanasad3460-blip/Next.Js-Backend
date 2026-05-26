// import passport from "passport";
// import { Request, Response, NextFunction } from "express";

// export const protect = (req: Request, res: Response, next: NextFunction) => {
//   passport.authenticate(
//     "jwt-cookiecombo",
//     { session: false },
//     (err: any, user: any, info: any) => {
//       console.log({ user, err, info });
//       if (err || !user) {
//         return res.status(401).json({
//           message: "Unauthorized. User not found",
//         });
//       }

//       // attach user to request
//       req.user = user;

//       next();
//     }
//   )(req, res, next);
// };

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
