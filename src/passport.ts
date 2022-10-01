const GoogleStrategy = require('passport-google-oauth20').Strategy;
import bcrypt from 'bcrypt';
import passport from 'passport';
import { User } from './models/user';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:8080/auth/google/callback"
},
    function (accessToken: any, refreshToken: any, profile: any, cb: any) {
        console.log(accessToken, refreshToken, profile, cb);
        cb(null, profile)
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });

        //Concat user information and hash it as passwords
        const saltRounds = 10;
        const salt = bcrypt.genSalt(saltRounds);
        const hash = bcrypt.hashSync(profile.id + profile.photos[0].value + profile.emails[0].value + profile.displayName, salt as unknown as string);

        const user =
        {
            userName: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
            password: hash
        }
        try {
            const saveUser = async () => {
                const u = new User(user);
                await u.save();
                console.log(user);
                console.log('User saved');
            }
            saveUser();
        }
        catch (err) {
            console.log(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
})