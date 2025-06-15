import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/posts`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
};

const getAllPosts = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

const createPost = async (postData) => {
    const response = await axios.post(API_URL, postData, getAuthHeaders());
    return response.data;
};

const deletePost = async (postId, token) => {
    const response = await axios.delete(`${API_URL}/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const addComment = async (postId, content) => {
    const response = await axios.post(`${API_URL}/${postId}/comments`, { content }, getAuthHeaders());
    return response.data;
};

const postService = {
    getAllPosts,
    createPost,
    deletePost,
    addComment,
};

export default postService;
