const Post = require("../models/PostModel");
const User = require("../models/UserModel");
const cloudinary = require('cloudinary').v2;

//create the post
const createPost = async (req,res) => {
    try {
        const { postedBy,text } = req.body;
        let { img } = req.body;

        if(!postedBy || !text) {
            return res.status(400).json({error: 'PostedBy and Text fields are required'})
        }

        const user = await User.findById(postedBy);
        if(!user) return res.status(404).json({error: 'User not found'});

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({error: 'Unauthorized to create post'})
        }

        const maxLength = 500;
        if(text.length > maxLength){
            return res.status(400).json({error: `Text must be less than ${maxLength} characters`})
        }

        if(img) {
            const  uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({ postedBy, text, img});
        await newPost.save();

        res.status(200).json({message: 'Post created Successfully', newPost})
    } 
    catch (error) {
        res.status(500).json({error: error.message});
        console.log('Error in createPost', error.message)
    }
}

//get the specific post by id
const getPost = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({error: 'Post not Found'});
        }

        res.status(200).json(post)
    } 
    catch (error) {
        res.status(500).json({error: error.message});
        console.log('Error in getPost', error.message)
    }
}


const getUserPost = async (req,res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({username});

        if(!user){
            return res.status(404).json({error: 'User not Found'});
        }

        const post = await Post.find({postedBy: user._id}).sort({createdAt: -1})

        res.status(200).json(post)
    } 
    catch (error) {
        res.status(500).json({error: error.message});
        console.log('Error in getPost', error.message)
    }
}

//delete the specific post by id 
const deletePost = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({error: 'Post not Found'});
        }

        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(400).json({error: 'Unauthorized to delete post'});
        }

        if(post.img){
            const imgId = post.img.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message: 'Post Deleted successfull'})
    } 
    catch (error) {
        res.status(500).json({error: error.message});
        console.log('Error in deletePost', error.message)
    }
}

//liked or unliked the post
const likeUnlikePost = async (req,res) => {
    try {
        const { id:postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({error: 'Post not Found'});
        }

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            // Unlike the post
            await Post.updateOne({_id: postId}, {$pull: { likes: userId }})
            res.status(200).json({message: 'Post unliked successfully'});
        }
        else{
            // liked the post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({message: 'Post liked successfully'});
        }
    } 
    catch (error) {
        res.status(500).json({error: error.message});
        console.log('Error in likeUnlikePost', error.message)
    }
}

//reply to the post
const replyToPost = async (req,res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if(!text){
            return res.status(404).json({error: 'Text feild is required'});
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: 'Post not found'});
        }

        const reply = {userId, text, userProfilePic, username};

        post.replies.push(reply);
        await post.save();

        res.status(200).json({message: 'Reply added successfully', post});
    } 
    catch (error) {
        res.status(500).json({error: error.message})    
        console.log('Error in replyToPost', error.message)
    }
}

//delete the reply
const deleteReply = async (req,res) => {

    const { postId, replyId } = req.params;
    
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        
        
        const replyIndex = post.replies.findIndex(reply => reply._id.toString() === replyId);
        if(post.replies[replyIndex].userId.toString() !== req.user._id.toString()){
            return res.status(400).json({error: 'Unauthorized to delete reply'});
        }
        if (replyIndex === -1) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        post.replies.splice(replyIndex, 1);
        
        await post.save();

        return res.json({ message: 'Reply deleted successfully' });
    } 
    catch (error) {
        res.status(500).json({error: error.message});
        console.log('Error in deleteReply', error.message)
    }
}

//feedback of post
const getFeedPost = async (req,res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: 'User not found'})
        }

        const following = user.following;

        const feedPosts = await Post.find({postedBy: { $in: following }}).sort({createdAt: -1});

        res.status(200).json(feedPosts)
    } 
    catch (error) {
        res.status(500).json({error: error.message});
        console.log('Error in getFeedPost', error.message)    
    }
}

module.exports = { createPost,getPost,deletePost,likeUnlikePost,replyToPost,deleteReply,getFeedPost,getUserPost };