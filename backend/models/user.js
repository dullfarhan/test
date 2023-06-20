import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const userSchema = Schema({
  fullName: {
    type: String,
    require: false
  },
  email: {
    type: String,
    require: false,
  },
  password: {
    type: String,
    require: false,
  },
  role: {
    type: Object,
    require: false,
  },
  status: {
    type: String,
    default: "pending",
    require: false,
  },
  resetPassStatus: {
    type: String,
    require: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false
  },
  designation: {
    type: String,
    require: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  profileImg: {
    type: String,
    required: false
  },
  organizationName: {
    type: String,
    required: false
  },
  organizationId: {
    type: mongoose.Schema.ObjectId,
    ref: "organization",
    required: false
  }
});

// encrypt the password before storing
userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};

userSchema.methods.validPassword = function (candidatePassword) {
  if (this.password != null) {
    return bcrypt.compareSync(candidatePassword, this.password);
  } else {
    return false;
  }
};

export default mongoose.model("user", userSchema);
