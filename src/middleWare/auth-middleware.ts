import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../database/model/user-model";

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    password: string;
    role: UserRole;
  };
}

export class AuthMiddleware {
  static async isLoggedIn(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let token = req.headers["authorization"] as string;

      if (!token) {
        return res.status(400).json({ message: "Please provide a token" });
      }

      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trim();
      }

      const secretKey = process.env.SECRET_KEY;
      if (!secretKey) {
        return res.status(500).json({ message: "Secret key is not defined" });
      }

      // Verify JWT
      const decoded = jwt.verify(token, secretKey) as { id: string };

      // Fetch user from DB
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Attach user info to request
      req.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        role: user.role as UserRole,
      };

      next();
    } catch (error) {
      console.error("JWT Error:", error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
static restrictTo(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as UserRole ;

    if (!userRole) {
      return res.status(403).json({
        message: 'Access denied: no user role found',
      });
    }

    if (roles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      message: "You do not have permission to perform this action",
    });
  };
}

}
