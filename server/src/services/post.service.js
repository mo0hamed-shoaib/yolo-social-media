import Post from '../models/post.model.js';
import { getFullProfilePictureUrl, DEFAULT_PFP } from '../services/auth.service.js';

// Helper to format post data for client, ensuring absolute image URLs and proper author data
const formatPostForClient = (post, req) => {
    if (!post) return null;

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Deep copy the post object to avoid modifying the original Mongoose document directly
    const formattedPost = post.toObject ? post.toObject() : { ...post };

    // Handle images: convert relative paths to absolute URLs and migrate old 'image' field
    if (!formattedPost.images || formattedPost.images.length === 0) {
        if (formattedPost.image) { // Check for the old singular 'image' field
            if (formattedPost.image.startsWith('http://') || formattedPost.image.startsWith('https://')) {
                formattedPost.images = [formattedPost.image]; // Already absolute URL
            } else if (formattedPost.image.startsWith('/uploads/')) {
                formattedPost.images = [`${baseUrl}${formattedPost.image}`];
            } else {
                // Assume it's a filename in the uploads directory
                formattedPost.images = [`${baseUrl}/uploads/${formattedPost.image}`];
            }
        } else {
            formattedPost.images = []; // Ensure it's an empty array if no images and no old image field
        }
    } else {
        // Ensure all existing images are absolute URLs
        formattedPost.images = formattedPost.images.map(imgUrl => {
            if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
                return imgUrl;
            } else if (imgUrl.startsWith('/uploads/')) {
                return `${baseUrl}${imgUrl}`;
            } else {
                // Assume it's a filename in the uploads directory
                return `${baseUrl}/uploads/${imgUrl}`;
            }
        });
    }

    // Ensure author profilePicture is also an absolute URL
    if (formattedPost.author) {
        formattedPost.author.profilePicture = getFullProfilePictureUrl(formattedPost.author.profilePicture, req);
    }

    return formattedPost;
};

const createPost = async (postData, userId) => {
    const post = await Post.create({
        ...postData,
        images: postData.images || [],
        author: userId
    });
    await post.populate('author', 'username email profilePicture');
    return post;
};

const getAllPosts = async (page = 1, limit = 10, req) => {
    const skip = (page - 1) * limit;
    const posts = await Post.find()
        .populate('author', 'username email profilePicture')
        .populate('comments.user', 'username profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Post.countDocuments();

    // Format posts before sending to client
    const formattedPosts = posts.map(post => formatPostForClient(post, req));

    return {
        posts: formattedPosts,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

const getPostById = async (postId, req) => {
    const post = await Post.findById(postId)
        .populate('author', 'username email profilePicture')
        .populate('comments.user', 'username profilePicture');

    if (!post) {
        throw new Error('Post not found');
    }

    // Format post before sending to client
    const formattedPost = formatPostForClient(post, req);

    return formattedPost;
};

const updatePost = async (postId, updateData, userId) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error('Post not found');
    }

    if (post.author.toString() !== userId.toString()) {
        throw new Error('Not authorized to update this post');
    }

    Object.assign(post, updateData);
    await post.save();

    return post;
};

const deletePost = async (postId, userId) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error('Post not found');
    }

    if (post.author.toString() !== userId.toString()) {
        throw new Error('Not authorized to delete this post');
    }

    await post.deleteOne();
    return true;
};

const addComment = async (postId, commentData) => {
    try {
        const post = await Post.findById(postId);

        if (!post) {
            throw new Error('Post not found');
        }

        // Create the comment with the post ID
        const newComment = {
            user: commentData.user,
            content: commentData.content,
            post: postId
        };

        // Add the comment to the post
        post.comments.push(newComment);
        await post.save();

        // Populate the user field of the new comment
        await post.populate('comments.user', 'username profilePicture');

        // Get the newly added comment
        const addedComment = post.comments[post.comments.length - 1];

        if (!addedComment) {
            throw new Error('Failed to add comment');
        }

        return addedComment;
    } catch (error) {
        console.error('Error in addComment service:', error);
        throw error;
    }
};

const removeComment = async (postId, commentId, userId) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error('Post not found');
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
        throw new Error('Comment not found');
    }

    if (comment.user.toString() !== userId.toString()) {
        throw new Error('Not authorized to remove this comment');
    }

    comment.deleteOne();
    await post.save();

    return true;
};

export default {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    addComment,
    removeComment
}; 