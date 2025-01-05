import postSchema from '../models/postSchema.js';

const postController = {};

postController.createPost = async (req, res) => {
    try {
        const { title, content, user_id, community, tags, is_template } = req.body;

        if (!title || !community || is_template === undefined || !user_id) {
            console.log(title, content, user_id, community, tags, is_template);
            return res
                .status(400)
                .json({ message: 'Required parameters missing: title, community, is_template' });
        }

        const post = await postSchema.create({
            title,
            body: content,
            user_id,
            community,
            tags,
            is_template,
        });

        if (post) {
            res.status(201).json({ message: 'Post created successfully', post });
        } else {
            res.status(400).json({ message: 'Failed to create post' });
        }
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
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
