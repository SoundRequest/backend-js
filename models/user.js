const DB = require("./../helpers/db");
const bcrypt = require("bcryptjs");
const knex = require("./../helpers/db");

module.exports = {
  db: DB("user"),
  isValidPassword: (password, input) => {
    try {
      return bcrypt.compare(input, password);
    } catch (error) {
      throw new Error(error);
    }
  },
  createUser: async (body) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);
    const result = await DB("user")
      .insert({
        username: body.username,
        email: body.email,
        password_hash: passwordHash,
      })
      .catch((error) => {
        console.log(error)
        throw new Error(error);
      });
    return result[0];
  },
  findUserById: async (id) => {
    const result = await DB("user").where("id", id);
    return result[0];
  },
  findUserByEmail: async (email) => {
    const result = await DB("user").where("email", email);
    return result[0];
  },
  findUserByUsername: async (username) => {
    const result = await DB("user").where("username", username);
    return result[0];
  },
};
