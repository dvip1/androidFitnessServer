import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: String,
        uid: {
            required: true,
            type:String 
        },
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community',
            requried: true,
            index: true,
        },
        media: [String],
        tags: [{ type: String, index: true }],
        upvotes: [mongoose.Schema.Types.ObjectId],
        downvotes: [mongoose.Schema.Types.ObjectId],
        total_upvotes: {
            type: Number,
            default: 0,
        },
        total_downvotes: {
            type: Number,
            default: 0,
        },
        awards: [String],
        is_template: Boolean,
    },
    { timestamps: true }
);

export default mongoose.model('Post', postSchema);
