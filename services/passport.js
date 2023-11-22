const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");

const User = require("../models/userModel");

// Get the user and pull out the id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Get the id and pull out the user
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
dotenv.config({
  path: "./config.env",
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        done(null, existingUser);

        // await User.create({ googleId: profile.id });
      } else {
        console.log("User already exist");
        const user = await new User({ googleId: profile.id }).save();

        done(null, user);
      }
    }
  )
);
