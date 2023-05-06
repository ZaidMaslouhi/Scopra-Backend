const { UserRepository } = require("../database/repository");
const bcrypt = require("bcrypt");

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

      return match ? loggedUser : null;
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

  async updateUser({ user }) {
    try {
      const updatedUser = this.repository.UpdateUser({ user });

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
}

module.exports = UserService;
