const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const config = require("./../config");
const User = require("./../models/user");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: config.JWT_SECRET,
    },
    async (payLoad, done) => {
      try {
        const user = await User.findUserById(payLoad.sub);

        if (user == undefined) {
          return done(null, false);
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
    },
    async (username, password, done) => {
      try {
        const userByEmail = await User.findUserByEmail(username);
        const userByName = await User.findUserByUsername(username);
        let isMatch;
        console.log(userByName);
        console.log(userByEmail);

        if (userByEmail !== undefined) {
          isMatch = await User.isValidPassword(
            userByEmail.password_hash,
            password
          );
        } else if (userByName !== undefined) {
          isMatch = await User.isValidPassword(
            userByName.password_hash,
            password
          );
        } else {
          return done(null, false);
        }

        if (!isMatch) {
          return done(null, false);
        }
        
        done(null, userByName===undefined?userByEmail:userByName);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
