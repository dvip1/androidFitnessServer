import userModel from '../models/userSchema.js';

const userController = {};

userController.addUserInfo = async (req, res) => {
  try {
    const { email, username, uid, device_token } = req.body;

    if (!uid || !username || !email) {
      return res.status(400).json({ message: 'Parameters missing' });
    }

    // Check if user already exists
    let user = await userModel.findOne({ uid });

    if (!user) {
      user = await userModel.create({
        username,
        email,
        uid,
        device_tokens: device_token ? [device_token] : [],
      });

      return res.status(201).json({ message: 'User created' });
    } else {
      // User exists, optionally update device token
      if (device_token && !user.device_tokens.includes(device_token)) {
        user.device_tokens.push(device_token);
        await user.save();
      }

      return res.status(200).json({ message: 'User already exists. Device token updated.' });
    }
  } catch (error) {
    console.error('AddUserInfo Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

userController.addUserInfo = async (req, res) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const uid = req.body.uid;
    if (!uid || !username || !email) res.status(400).json({ message: 'parameters missing' });
    const user = await userModel.create({
      username,
      email,
      uid,
    });
    if (user) res.status(201).json({ message: 'user created' });
    else res.status(400).json({ message: 'invalid user data received' });
  } catch (error) {
    res.status(500).json({ message: error });
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
    if (userObject.profileImage == '')
      userObject.profileImage =
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.lkVN1WDlcV2jQCq-9LT7-wHaIJ%26pid%3DApi&f=1&ipt=500583f13d57edba0a22be2875c2ed8eb774e14c3cce05544102472d59faab22&ipo=images';

    delete userObject._id;
    delete userObject.uid;

    res.status(200).json(userObject); //Send userObject instead of user
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

userController.syncDeviceToken = async (req, res) => {
  try {
    const { uid, device_token } = req.body;

    if (!uid || !device_token) {
      return res.status(400).json({ message: 'Missing uid or device token' });
    }

    const user = await userModel.findOne({ uid });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.device_tokens.includes(device_token)) {
      user.device_tokens.push(device_token);
      await user.save();
    }

    res.status(200).json({ message: 'Device token synced' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export default userController;
