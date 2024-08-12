const bcrypt = require('bcryptjs')
const User = require("../models/UserModel");
const generateTokenAndSetCookie = require('../utils/helpers/generateTokenAndSetCookie');
const cloudinary = require('../utils/cloudinary');
const mongoose = require('mongoose');

//UserProfile
const getUserProfile = async (req, res) => {
    const { query } = req.params;
    try {
        let user;

        //query is userId
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({_id: query}).select('-password').select('-updatedAt');
        }
        //query is username
        else{
            user = await User.findOne({username: query}).select('-password').select('-updatedAt');
        }

        if (!user) return res.status(400).json({ error: "User not found" });

        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.mesage })
        console.log('Error in UserProfile', error.message)
    }
}

//signUp User
const signupUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        });

        await newUser.save();

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
            })
        }
        else {
            res.status(400).json({ error: "Invalid user data" })
        }
    }
    catch (error) {
        res.status(500).json({ error: error.mesage })
        console.log('Error in signupUser', error.message)
    }
}

//login User
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "Please try to login with valid credentials" });
        }

        const PasswordCompare = await bcrypt.compare(password, user?.password)

        if (!PasswordCompare) {
            return res.status(400).json({ error: "Please try to login with valid credentials" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
        })

    }
    catch (error) {
        res.status(500).json({ error: error.mesage })
        console.log('Error in loginUser', error.message)
    }
}
//logout User
const logoutUser = async (req, res) => {
    try {

        res.cookie('jwt', '', { maxAge: 1 });
        res.status(200).json({ message: 'User Logout Successfully' })
    }
    catch (error) {
        res.status(500).json({ error: error.mesage })
        console.log('Error in logoutUser', error.message)
    }
}

//Follow and Unfollow the user
const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
        }

        if (!userToModify || !currentUser) return res.status(400).json({ error: 'User not found' });

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            //Unfollow user remove user from following and from followers
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            res.status(201).json({ message: 'User unfollowed successfully' })
        }
        else {
            //Follow user
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            res.status(201).json({ message: 'User followed successfully' })
        }
    }
    catch (error) {
        res.status(500).json({ error: error.mesage })
        console.log('Error in followUnfollowUser', error.message)
    }
}

//update user
const updateUser = async (req, res) => {
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ error: 'user not find' })

        if (req.params.id !== userId.toString()) return res.status(400).json({ error: 'You cannot update others users profile' })

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)
            user.password = hashedPassword;
        }

        if (profilePic) {
            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();

        user.password = null;

        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.mesage })
        console.log('Error in updateUser', error.message)
    }
}


module.exports = { signupUser, loginUser, logoutUser, followUnFollowUser, updateUser, getUserProfile };