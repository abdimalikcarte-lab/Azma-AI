
import express from "express";

import {
  registerUser,
  loginUser
} from "../controllers/authController.js";

const router = express.Router();

// POST: Register new user
router.post("/register", registerUser);

// POST: Login existing user
router.post("/login", loginUser);

export default router;
