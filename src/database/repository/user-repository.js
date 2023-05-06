const { default: mongoose } = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const { UserModel } = require("../models");

class UserRepository {
  async LoginUser({ email, password }) {
    try {
      const user = await UserModel.findOne({ email }).exec();

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

  async UpdateUser({ user }) {
    try {
      let userInfo = await UserModel.findById(user.id);
      userInfo = { ...user };

      const updatedUser = await UserModel.updateOne(
        { _id: user.id },
        {
          ...userInfo,
        }
      );

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
