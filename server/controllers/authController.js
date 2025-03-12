const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log(username, email, password);

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(username, email, password);

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Registration failed" });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: email }],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, message: "Login successful" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Login failed" });
  }
};
