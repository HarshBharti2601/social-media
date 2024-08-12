const express = require('express');
const ProtectUser = require('../middleware/ProtectRoute');
const { createPost, getPost, deletePost, likeUnlikePost, replyToPost, deleteReply,getFeedPost, getUserPost } = require('../controllers/PostController');

const router = express.Router();

router.get('/feed', ProtectUser, getFeedPost)
router.get('/:id', getPost)
router.get('/user/:username', getUserPost)
router.post('/create', ProtectUser, createPost)
router.delete('/:id', ProtectUser, deletePost)
router.put('/like/:id', ProtectUser, likeUnlikePost)
router.put('/reply/:id', ProtectUser, replyToPost)
router.delete('/:postId/replies/:replyId', ProtectUser, deleteReply)

module.exports = router;