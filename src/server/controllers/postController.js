const Post = require('../models/postModel')
const mongoose = require('mongoose')

// get all posts
const getPosts = async(req, res) => {
    const posts = await Post.find({}).sort({createdAt: -1})

    res.status(200).json(posts)
}


// get user posts
const getUserPosts = async(req, res) => {
    const { username } = req.params

    const posts = await Post.find({ username }).sort({createdAt: -1})
    
    if (!posts) {
        return res.status(400).json({error: 'User has no posts'})
    }

    res.status(200).json(posts)
}


// get a single post
const getPost = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such post"})
    }

    const posts = await Post.find({_id: id})
    
    if (!posts) {
        return res.status(400).json({error: 'No such post exists'})
    }

    res.status(200).json(posts)
}


// create a new post
const createPost = async(req, res) => {
    const { title, image, caption, likes } = req.body

    let emptyFields = []
    
    if (!image) {
        emptyFields.push('image')
    }

    if (!caption) {
        emptyFields.push('caption')
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({error: `Fill in the required fileds: ${emptyFields}`, emptyFields})
    }

    // add to db
    try {
        const userID = req.user._id
        const username = req.user.username
        const email = req.user.email
        const post = await Post.create({ title, image, caption, likes, userID, username, email })
        res.status(200).json(post)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


// delete a post
const deletePost = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such post"})
    }

    const post = await Post.findOneAndDelete({_id: id})
    
    if (!post) {
        return res.status(400).json({error: 'No such post exists'})
    }

    res.status(200).json(post)
}


// update a post
const updatePost = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such post"})
    }

    const post = await Post.findOneAndUpdate({_id: id}, {
        ...req.body
    })
    
    if (!post) {
        return res.status(400).json({error: 'No such post exists'})
    }

    res.status(200).json(post)
}

module.exports = {
    getPosts,
    getUserPosts,
    getPost,
    createPost, 
    deletePost, 
    updatePost
}