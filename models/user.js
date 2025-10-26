import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: { type: String, required: true, minLength: 6 },
    favouriteMovies: [{ type: String }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    ongoingMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    completedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
