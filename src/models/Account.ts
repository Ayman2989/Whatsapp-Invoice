import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["User", "Admin", "SA"], default: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    parentAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    childrenAccounts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Account ||
  mongoose.model("Account", AccountSchema);
