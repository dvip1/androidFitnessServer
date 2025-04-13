import userModel from '../models/userSchema.js';

const userController = {};

userController.addUserInfo = async (req, res) => {
    try {
        console.log("-1");
        const email = req.body.email;
        const username = req.body.username;
        const uid = req.body.uid;
        console.log("here 0");
        if (!uid || !username || !email) res.status(400).json({ message: 'parameters missing' });
        console.log("here 1");
        const user = await userModel.create({
            username,
            email,
            uid,
        });
        if (user) res.status(201).json({ message: 'user created' });
        else res.status(400).json({ message: 'invalid user data received' });
    } catch (error) {
        res.status(500).json({ message:error});
    }
};
userController.isUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await userModel.findOne({ username: username });
        if (user) res.status(200).json({ message: 'Succesfull' });
        else res.status(404).json({ message: 'Not Found' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

userController.getUserProfile = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await userModel.findOne({ uid: uid }); // Use findOne with a query

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userObject = user.toObject();
        if (userObject.profileImage=="")
            userObject.profileImage ="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.lkVN1WDlcV2jQCq-9LT7-wHaIJ%26pid%3DApi&f=1&ipt=500583f13d57edba0a22be2875c2ed8eb774e14c3cce05544102472d59faab22&ipo=images";

        delete userObject._id;
        delete userObject.uid;

        res.status(200).json(userObject); //Send userObject instead of user
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export default userController;
