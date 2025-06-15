import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import postService from '../services/post.service';

const CommentSection = ({ post, onCommentAdded }) => {
    const { user } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await postService.addComment(post._id, newComment);
            if (response.success && response.comment) {
                setNewComment('');
                onCommentAdded(response.comment);
                toast.success('Comment added successfully!');
            } else {
                throw new Error('Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error(error.response?.data?.message || 'Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-4 space-y-4">
            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D984BB]"
                    maxLength={500}
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="bg-[#D984BB] text-white px-4 py-2 rounded-lg hover:bg-[#D782D9] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting ? 'Posting...' : 'Post'}
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
                {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                        <div key={comment._id} className="bg-gray-700/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <img 
                                    src={comment.user?.profilePicture || "https://ui-avatars.com/api/?name=" + comment.user?.username} 
                                    alt={comment.user?.username || 'Unknown User'} 
                                    className="w-6 h-6 rounded-full"
                                />
                                <span className="font-semibold text-[#D984BB]">
                                    {comment.user?.username || 'Unknown User'}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-200">{comment.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center py-2">No comments yet</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection; 