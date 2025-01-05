import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Community name cannot be empty'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description cannot be empty'],
        trim: true
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    members:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    is_private: Boolean,
    rules: String
}, { timestamps: true })

communitySchema.index({ members: 1 });

export default mongoose.model('Community', communitySchema);
