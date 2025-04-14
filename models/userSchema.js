import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    streaks: {
      type: Number,
      default: 0,
    },
    karmas: {
      type: Number,
      default: 0,
    },
    posts: [mongoose.Schema.Types.ObjectId],
    likedPosts: [mongoose.Schema.Types.ObjectId],
    connections: [mongoose.Schema.Types.ObjectId],
    badges: [mongoose.Schema.Types.ObjectId],
    communities: [mongoose.Schema.Types.ObjectId],
    device_tokens: [String],
  },
  { timestamps: true }
);
export default mongoose.model('User', userSchema);
