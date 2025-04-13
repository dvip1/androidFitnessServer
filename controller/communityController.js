import communityModel from '../models/communitySchema.js';
import userModel from '../models/userSchema.js';
const communityController = {};

/* potential addons (createCommunity)
 *** check if username already exists
 */
communityController.createCommunity = async (req, res) => {
    try {
        const { name, description, rules, is_private, leader } = req.body;
        const user = userModel.findOne({ uid: leader });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found from the given uid',
            });
        }

        const newCommunity = await communityModel.create({
            name,
            description,
            leader,
            rules,
            is_private,
        });

        newCommunity.members.push(user._id);
        await userModel.updateOne({ uid: leader }, { $push: { communities: newCommunity._id } });
        await newCommunity.save();

        res.status(200).json({
            success: true,
            message: newCommunity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'error creating new community',
            error: error.message,
        });
    }
};

communityController.getUserCommunity = async (req, res) => {
    try {
        const uid = req.query.uid;
        const userCommunities = await userModel.findOne({ uid: uid }, { communities: 1, _id: 0 });
        if (!userCommunities || !userCommunities.communities)
            return res.status(404).json({ message: 'No communities found for this user' });
        const communityDetails = await communityModel.find(
            { _id: { $in: userCommunities.communities } },
            { name: 1, _id: 1 }
        );
        const communitiesMap = communityDetails.reduce((acc, community) => {
            acc[community.name] = community._id;
            return acc;
        }, {});

        res.status(201).json({
            success: true,
            message: communitiesMap,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error Fetching communities`,
            error: error.message,
        });
    }
};

communityController.deleteCommunity = async (req, res) => {
    try {
        const communityId = req.query.id;
        const leader = req.query.uid;
        await communityModel.findByIdAndDelete({ _id: communityId });
        const user = await userModel.findOne({ uid: leader });
        user.updateOne({ _id: communityId }, { $pull: { communities: communityId } });
        res.status(200).json({
            success: true,
            message: 'yes',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error Fetching communities`,
            error: error.message,
        });
    }
};

export default communityController;
