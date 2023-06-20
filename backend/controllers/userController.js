import User from "./../models/user";

export const getAllUsers = async (query) => {
  return await User.find(query)
};

export const searchUser = async (query) => {
  return await User.find({ "fullName": { $regex: '.*' + query.name + '.*' } })
};

export const getOneUser = async (id) => {
  let user = await User.findById(id);
  let res = user.toObject();
  delete res.password;
  return res;
};

export const addUser = async (user) => {
  return await User.create(user);
};

export const updateUser = async (user) => {
  let res;
  const { email, status, fullName, role, designation, organizationName, organizationId, updatedAt } = user
  if (email) {
    const findUser = await User.findOne({ email });
    if (findUser) {
      // findUser.password = findUser.encryptPassword(password);
      findUser.status = status
      findUser.fullName = fullName
      findUser.role = role
      findUser.designation = designation
      findUser.organizationName = organizationName
      findUser.organizationId = organizationId
      findUser.updatedAt = updatedAt
      res = await User.findByIdAndUpdate(findUser._id, findUser);
    } else {
      res.status(404);
      res.json({ message: "the email provided was not found" });
    }
  } else {
    res = await User.findByIdAndUpdate(user._id, user);
  }
  return res;
};
export const registerUser = async (user) => {

  let res;
  const { email, password, status } = user;
  const findUser = await User.findOne({ email });

  if (!findUser) {
    res.status(404);
    res.json({ message: "the email provided was not found" });
  } else {
    findUser.password = findUser.encryptPassword(password);
    findUser.status = status
    res = await User.findByIdAndUpdate(findUser._id, findUser);
  }
  return res;
};

export const updateUserPw = async (user) => {
  let res;
  const { email, oldPassword, password, resetPassStatus } = user

  // check old password and updating the profile or the password
  let foundUser = await User.findOne({ email });

  if (oldPassword) {
    // check if the old password matches the one in the db
    if (!foundUser.validPassword(oldPassword)) {
      return { status: 400, message: "Incorrect password" };
    }
    // check old password matches new password the one in the db
    if (oldPassword === password) {
      return { status: 400, message: "Old password and New password is same" };
    }
    foundUser.password = foundUser.encryptPassword(password);
    foundUser.resetPassStatus = resetPassStatus
    res = await User.findByIdAndUpdate(foundUser._id, foundUser);
  }
  return res;
};

export const updateUserProfile = async (email, url) => {
  let res;
  if (url) {
    let foundUser = await User.findOne({ email });
    foundUser.profileImg = url
    res = await User.findByIdAndUpdate(foundUser._id, foundUser);
  }
  res.profileImg = url
  return res;
};

export const deleteUser = async (id) => {
  return await User.findOneAndRemove({ _id: id });
};
