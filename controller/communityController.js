import communityModel from '../models/communitySchema.js';
import userModel from '../models/userSchema.js';
const communityController = {};

communityController.createCommunity = async (req, res) => {
    try {
        const { name, description, rules, is_private,leader } = req.body;
        const newCommunity = await communityModel.create({
            name,
            description,
            leader,
            rules,
            is_private,
        });
        newCommunity.members.push(leader);
        newCommunity.save();
        await userModel.findByIdAndUpdate(
            { _id: leader },
            {
                $push: {
                    communities: newCommunity._id,
                },
            }
        );

        res.json(newCommunity._id);
    } catch (error) {
        console.log("Error occured" + error);
        res.status(500).json({ message: error });
    }
};

export default communityController;
