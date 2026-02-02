import { Request, Response } from "express"
import { User } from "../../database/model/user-model"
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken"

class AuthController{
   static async registerUser(req: Request, res: Response) {
    try {
        const { username, email, password } = req.body;

        // 1️ Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email, and password are required"
            });
        }

        // 2️ Check existing user
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({
                message: "Email already in use"
            });
        }

        // 3️ Hash password
        const hashPassword = await bcrypt.hash(password, 12);

        // 4️ Create user
        const user = await User.create({
            username,
            email,
            password: hashPassword
        });

        // 5 Success response
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error :any) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
               
        error: error.message,
        stack: error.stack,
        });
    }
}

  static async loginUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

       
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

       
        const userData = await User.findOne({ where: { email } });
        if (!userData) {
            return res.status(401).json({
                message: "Email is not registered"
            });
        }

      
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }

  
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            throw new Error("SECRET_KEY is not defined in .env");
        }

        const token = jwt.sign(
            { id: userData.id },      
            secretKey,                
            { expiresIn: "30d" }      
        );

   
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: userData.id,
                username: userData.username,
                email: userData.email
            }
        });

    } catch (error :any) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
          
        error: error.message,
        stack: error.stack,
        });
    }
}

}


export default AuthController