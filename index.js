const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const authRouter = require("./routes/authRoute");

const app = express();
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);

app.use(passport.initialize());
app.use(passport.session());

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(() => {
  console.log("Connected to DB successfully");
});

app.use("/auth/google", authRouter);
app.get("/api/current_user", (req, res) => {
  res.send(req.user);
});
app.get("/api/logout", (req, res) => {
  req.logout();
  console.log("You are logout");
  res.send(req.user);
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
