const { default: mongoose } = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const { UserModel } = require("../models");

class UserRepository {
  async LoginUser({ email }) {
    try {
      const user = await UserModel.findOne({ email }).exec();

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async FindUserByToken(token) {
    try {
      const user = await UserModel.findOne({ token }).exec();

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async CreateNewUser({ email, password, username }) {
    try {
      const newUser = UserModel.create({
        email,
        password,
        username,
      });

      return newUser;
    } catch (error) {
      console.error(error);
      //   throw new APIError(
      //     "API Error",
      //     STATUS_CODES.INTERNAL_ERROR,
      //     "Unable to Find Product"
      //   );
    }
  }

  async UpdateUserToken({ user }) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        { _id: user.id },
        { token: user.token }
      ).exec();

      return updatedUser;
    } catch (error) {
      console.error(error);
    }
  }

  async LogoutUser({ user }) {
    try {
      let loggedOffUser = await UserModel.findById(user.id);

      return loggedOffUser;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = UserRepository;
