import postService from '../services/post.service.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { title, content, images: bodyImages } = req.body;
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        let finalImages = [];

        // Handle uploaded files first (from multer)
        if (req.files && req.files.length > 0) {
            finalImages = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);
        } else if (bodyImages && Array.isArray(bodyImages) && bodyImages.length > 0) {
            // If no files uploaded, check for images in request body (e.g., from Postman)
            finalImages = bodyImages.map(imgUrl => {
                if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
                    return imgUrl; // Already a full URL
                } else if (imgUrl.startsWith('/uploads/')) {
                    return `${baseUrl}${imgUrl}`; // Relative path to uploads, make absolute
                } else {
                    // Assume it's a filename in the uploads directory
                    return `${baseUrl}/uploads/${imgUrl}`;
                }
            });
        }

        const post = await postService.createPost({
            title,
            content,
            images: finalImages,
        }, req.user.id);

        console.log("Server - Created Post Data Sent to Client:", JSON.stringify(post, null, 2));

        res.status(201).json({
            success: true,
            post
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create post"
        });
    }
};

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Public
export const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await postService.getAllPosts(page, limit, req);

        console.log("Server - All Posts Data Sent to Client:", JSON.stringify(result.posts, null, 2));

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error("Error fetching all posts:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id, req);

        console.log("Server - Single Post Data Sent to Client:", JSON.stringify(post, null, 2));

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error("Error fetching single post:", error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
    try {
        const post = await postService.updatePost(
            req.params.id,
            req.body,
            req.user._id
        );
        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(error.message.includes('Not authorized') ? 403 : 400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        await postService.deletePost(req.params.id, req.user._id);
        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(error.message.includes('Not authorized') ? 403 : 404).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentData = {
            user: req.user._id,
            content: req.body.content
        };

        const newComment = await postService.addComment(postId, commentData);

        if (!newComment) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.status(201).json({
            success: true,
            comment: newComment
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(error.message.includes('not found') ? 404 : 500).json({
            success: false,
            message: error.message || 'Failed to add comment'
        });
    }
};

// @desc    Remove a comment from a post
// @route   DELETE /api/posts/:id/comment/:commentId
// @access  Private
export const removeComment = async (req, res) => {
    try {
        await postService.removeComment(
            req.params.id,
            req.params.commentId,
            req.user._id
        );
        res.json({
            success: true,
            message: 'Comment removed successfully'
        });
    } catch (error) {
        res.status(error.message.includes('Not authorized') ? 403 : 404).json({
            success: false,
            message: error.message
        });
    }
}; 