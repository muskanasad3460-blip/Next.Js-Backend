import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import JwtCookieComboStrategy from "passport-jwt-cookiecombo";

import dotenv from "dotenv";

dotenv.config(); // 👈 IMPORTANT SAFETY

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is missing in .env file");
}

passport.use(
  new JwtCookieComboStrategy(
    {
      secretOrPublicKey: jwtSecret,
    },
    async (payload: any, done: any) => {
      console.log({ payload, done });
      return done(null, payload);
    }
  )
);

export default passport;

// import passport from "passport";
// import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
// import dotenv from "dotenv";
// import { Request } from "express";

// dotenv.config();

// const jwtSecret = process.env.JWT_SECRET;

// if (!jwtSecret) {
//   throw new Error("JWT_SECRET is missing in .env file");
// }

// passport.use(
//   new JwtStrategy(
//     {
//       // ✅ extract token from cookie
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (req: Request | null) => {
//           if (req && req.cookies) {
//             return req.cookies.token; // 👈 your cookie name
//           }
//           return null;
//         },
//       ]),
//       secretOrKey: jwtSecret,
//     },
//     async (payload, done) => {
//       try {
//         // ✅ Right now you're just passing payload
//         // 👉 Later you can fetch from DB here
//         return done(null, payload);
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );

// export default passport;
