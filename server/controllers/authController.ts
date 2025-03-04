import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../mailService";

dotenv.config();

export const signUp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const verificationToken = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    const verificationCode = Math.random()*1000000;

    newUser.verificationCode = String(verificationCode);
    newUser.verificationToken = verificationToken;
    await newUser.save();
    await sendVerificationEmail(newUser)

    res.status(201).json(verificationToken);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error", error });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token,code } = req.body;

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findByPk(decoded.userId);
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.isVerified = true;
    await user.save();

    const loginToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    res.json(loginToken);
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: "Invalid token" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(400)
        .json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    res.json( token );
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error", error });
  }
};
