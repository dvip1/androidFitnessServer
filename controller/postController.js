import postSchema from '../models/postSchema.js';

const postController = {};

postController.createPost = async (req, res) => {
    try {
        const { title, content, uid, community, tags, is_template, media } = req.body;

        if (!title || !community || is_template === undefined || !uid) {
            return res
                .status(400)
                .json({ message: 'Required parameters missing: title, community, is_template' });
        }

        const post = await postSchema.create({
            title,
            body: content,
            uid,
            community,
            tags,
            is_template,
            media,
        });

        if (post) {
            res.status(201).json({ message: 'Post created successfully', post });
        } else {
            res.status(400).json({ message: 'Failed to create post' });
        }
    } catch (error) {
        res.status(500).json({success:false, message: 'Internal server error', error });
    }
};

postController.getPost = async (req, res) => {
    try {
        const { community_id, type } = req.query;
        if (!community_id || !type) res.status(400).json({ message: 'parameters missing' });
        const data = await postSchema.find({ community: community_id }).lean().exec();

        if (data) res.status(201).json(data);
        else res.status(400).json({ message: 'invalid user data received' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export default postController;
