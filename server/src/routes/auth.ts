import { Router } from "express";
import type {Response} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.ts";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d"; 
const CLIENT_URL = process.env.CLIENT_URL!;


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'bruinblog.demo@gmail.com',
        pass: 'uhztgaoroicskxxe'
    }
})

function signJwt(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function setJwtCookie(res: Response) {
  return (token: string) => {
    res.cookie("_jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  };
}

const router = Router();

router.post("/register", async (req, res) => {
    console.log("[auth] POST /register body:", req.body);
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return res.status(400).json({ error: "Email & password required" });
    }
    const exists = await User.findOne({ email });
    console.log(exists);
    if (exists?.verified == true) {
      return res.status(409).json({ error: "Account already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const user = await User.create({
      email,
      passwordHash,
      verified: false,
      verificationToken,
      verificationTokenExpires,
    });
    const verifyUrl = `${CLIENT_URL}/verify/${verificationToken}`;
      try{
        transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Verify your BruinBlog account",
        html: `
          <p>Hi ${email},</p>
          <p>Thanks for registering! Click the link below to verify your email address:</p>
          <p><a href="${verifyUrl}">${verifyUrl}</a></p>
          <p>This link expires in 24 hours.</p>
          <hr/>
          <p>If you didn't sign up, you can ignore this email.</p>
        `
      });}
      catch(error){
        console.log("Error sending verification email ", error);
      }

    return res.status(201).json({ id: user._id, email: user.email, verified: user.verified });
  } catch (err) {
    console.log(err);
  }
});

router.get("/verify/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user || !user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
      return res.status(400).send("Verification link invalid or expired");
    }
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    const jwtToken = signJwt(user.id);
    setJwtCookie(res)(jwtToken);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return res.status(400).json({ error: "Email & password required" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.verified) return res.status(403).json({ error: "Account not verified" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signJwt(user.id);
    setJwtCookie(res)(token);
    res.json({ email: user.email });
  } catch (err) {
    next(err);
  }
});

router.get("/me", async (req, res) => {
    const token = req.cookies["_jwt"];
    if (!token) return res.status(401).json({ error: "unauthenticated" });
    try {
      const { sub } = jwt.verify(token, JWT_SECRET) as { sub: string };
      const user = await User.findById(sub).select("email");
      if (!user) throw new Error("User not found");
      return res.json({ email: user.email });
    } catch {
      return res.status(401).json({ error: "token_invalid" });
    }
  });

router.post("/logout", (req, res) => {
  res.clearCookie("_jwt");
  res.status(204).end();
});

export default router;
