"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const user_1 = require("./models/user");
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
}, function (accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile, cb);
    cb(null, profile);
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    //Concat user information and hash it as passwords
    const saltRounds = 10;
    const salt = bcrypt_1.default.genSalt(saltRounds);
    const hash = bcrypt_1.default.hashSync(profile.id + profile.photos[0].value + profile.emails[0].value + profile.displayName, salt);
    const user = {
        userName: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
        password: hash
    };
    try {
        const saveUser = async () => {
            const u = new user_1.User(user);
            await u.save();
            console.log(user);
            console.log('User saved');
        };
        saveUser();
    }
    catch (err) {
        console.log(err);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
