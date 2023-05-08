const { UserRepository } = require("../database/repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = require("../config");

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async loginUser({ user }) {
    try {
      const loggedUser = await this.repository.LoginUser({
        email: user.email,
      });

      if (!loggedUser) return null;

      const match = await bcrypt.compare(user.password, loggedUser.password);
      if (!match) return null;

      const accessToken = jwt.sign({ user: loggedUser._id }, ACCESS_TOKEN_KEY, {
        expiresIn: "30min",
      });
      const refreshToken = jwt.sign(
        { user: loggedUser._id },
        REFRESH_TOKEN_KEY,
        {
          expiresIn: "1d",
        }
      );
      loggedUser.token = refreshToken;
      const user = await this.repository.UpdateUserToken({
        user: loggedUser,
      });
      return { user, refreshToken, accessToken };
      
    } catch (error) {
      console.log(error);
    }
  }

  async createUser({ user }) {
    try {
      const username =
        user.username ?? user.email.slice(0, user.email.indexOf("@"));
      const password = await bcrypt.hash(user.password, 10);
      const newUser = await this.repository.CreateNewUser({
        email: user.email,
        password,
        username,
      });

      return newUser;
    } catch (error) {
      console.error(error);
      // throw new APIError('Data Not found')
    }
  }

  async updateUserToken({ user }) {
    try {
      const updatedUser = this.repository.UpdateUserToken({ user });

      return updatedUser;
    } catch (error) {
      console.error(error);
      // throw new APIError('Data Not found')
    }
  }

  async logoutUser({ user }) {
    try {
      const loggedOffUser = this.repository.LogoutUser({ user });

      return loggedOffUser;
    } catch (error) {
      console.error(error);
      // throw new APIError('Data Not found')
    }
  }

  async findUserByToken(token) {
    try {
      const user = this.repository.FindUserByToken(token);

      return user;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = UserService;
