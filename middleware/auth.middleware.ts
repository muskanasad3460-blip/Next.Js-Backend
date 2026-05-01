import passport from "passport";
import { Request, Response, NextFunction } from "express";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt-cookiecombo",
    { session: false },
    (err: any, user: any, info: any) => {
      console.log({ user, err, info });
      if (err || !user) {
        return res.status(401).json({
          message: "Unauthorized. User not found",
        });
      }

      // attach user to request
      req.user = user;

      next();
    }
  )(req, res, next);
};
