const express = require('express')
const {
    getPosts,
    getPost,
    getUserPosts,
    createPost,
    deletePost,
    updatePost
} = require('../controllers/postController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all post routes
router.use(requireAuth)

// GET all posts
router.get('/', getPosts)

// GET user posts
router.get('/Profile/:username', getUserPosts)

// GET a single post
router.get('/:id', getPost)

// POST a new post
router.post('/', createPost)

// DELETE a post
router.delete('/:id', deletePost)

// UPDATE a post
router.patch('/:id', updatePost)


module.exports = router