"use strict";
// import passport from "passport";
// import { Request, Response, NextFunction } from "express";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.protect = protect;
