import React, { useState, useEffect, useRef } from "react";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import postService from "../services/post.service";
import { toast } from "react-toastify";
import CommentSection from "../components/CommentSection";
import reactLogo from "../assets/react.png";
import angularLogo from "../assets/angular.png";
import jsLogo from "../assets/js.png";
import figmaLogo from "../assets/figma.png";
import abdoImage from "../assets/abdo.jpg";
import ahmedImage from "../assets/ahmed.jpg";
import aliImage from "../assets/ali.jpg";
import eliasImage from "../assets/elias.jpg";
import abdoProfileImage from "../assets/abdo-pfp.jpg";
import ahmedProfileImage from "../assets/ahmed-pfp.jpg";
import aliProfileImage from "../assets/ali-pfp.jpg";
import eliasProfileImage from "../assets/elias-pfp.jpg";
import zagProfileImage from "../assets/zag-pfp.jpg";
import yahyaProfileImage from "../assets/square-pfp.jpg";
import bilalProfileImage from "../assets/bilal-pfp.jpg";
import { uploadImageToImgBB } from "../services/imgbb.service";

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes modalFadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .animate-fadeOut {
    animation: fadeOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .animate-slideIn {
    animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .animate-modalFadeIn {
    animation: modalFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .animate-modalFadeOut {
    animation: modalFadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .comments-container {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .comments-container.expanded {
    max-height: 1000px;
    opacity: 1;
    margin-top: 1rem;
  }
    
  /* Hide scrollbars for sidebars */
  .sidebar-no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .sidebar-no-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const HomePage = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalSelectedImage, setModalSelectedImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isFetchingPosts, setIsFetchingPosts] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [privacy, setPrivacy] = useState("public");
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [isCreateModalClosing, setIsCreateModalClosing] = useState(false);
  const [mainFileInputKey, setMainFileInputKey] = useState(0);
  const [modalFileInputKey, setModalFileInputKey] = useState(0);
  const fileInputRef = useRef(null);
  const mainFileInputRef = useRef(null);
  const modalRef = useRef(null);
  const createPostModalRef = useRef(null);
  const [shareLocation, setShareLocation] = useState(true);

  // Function to generate random interaction numbers
  const generateRandomInteractions = (postId) => {
    // Use postId as a seed for consistent numbers per post
    const seed = postId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min, max) => {
      const x = Math.sin(seed + min + max) * 10000;
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };

    return {
      likes: random(5, 150),
      shares: random(1, 50),
      views: random(100, 1000),
    };
  };

  // Store generated numbers in a ref to keep them consistent
  const interactionNumbers = useRef(new Map());

  // Function to get or generate interaction numbers for a post
  const getInteractionNumbers = (postId) => {
    if (!interactionNumbers.current.has(postId)) {
      interactionNumbers.current.set(
        postId,
        generateRandomInteractions(postId)
      );
    }
    return interactionNumbers.current.get(postId);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsFetchingPosts(true);
      try {
        const data = await postService.getAllPosts();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to fetch posts.");
      } finally {
        setIsFetchingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && showDeleteModal) {
        setShowDeleteModal(false);
        setPostToDelete(null);
      }
    };

    const handleOutsideClick = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        showDeleteModal
      ) {
        setShowDeleteModal(false);
        setPostToDelete(null);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showDeleteModal]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleModalImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Modal image change triggered:", file);
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      console.log("Setting modal selected image:", file);
      setModalSelectedImage(file);
    }
  };

  const handleImageClick = (isModal) => {
    console.log("handleImageClick called with isModal:", isModal);
    if (isModal) {
      console.log("Clicking modal file input");
      fileInputRef.current?.click();
    } else {
      console.log("Clicking main section file input");
      mainFileInputRef.current?.click();
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalClosing(true);
    setTimeout(() => {
      setShowCreatePostModal(false);
      setIsCreateModalClosing(false);
      setNewPostContent("");
      setModalSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setModalFileInputKey((prevKey) => prevKey + 1);
    }, 300);
  };

  const handleCreatePost = async (isModal = false) => {
    console.log("handleCreatePost called with isModal:", isModal);
    console.log("Current modalSelectedImage:", modalSelectedImage);
    console.log("Current selectedImage:", selectedImage);

    if (!newPostContent.trim() && !selectedImage && !modalSelectedImage) {
      toast.error("Please write something or add an image");
      return;
    }

    setIsPosting(true);
    try {
      let imageUrl = null;
      const imageToUpload = isModal ? modalSelectedImage : selectedImage;

      if (imageToUpload) {
        try {
          imageUrl = await uploadImageToImgBB(imageToUpload);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image. Please try again.");
          setIsPosting(false);
          return;
        }
      }

      const postData = {
        title: newPostContent.trim().slice(0, 50) || "New Post",
        content: newPostContent,
        images: imageUrl ? [imageUrl] : [],
      };

      const response = await postService.createPost(postData);
      if (response.success) {
        setPosts([response.post, ...posts]);
        setNewPostContent("");
        setSelectedImage(null);
        setModalSelectedImage(null);
        if (mainFileInputRef.current) {
          mainFileInputRef.current.value = "";
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (isModal) {
          handleCloseCreateModal();
        }
        toast.success("Post created successfully!");
      } else {
        toast.error(response.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    try {
      const response = await postService.deletePost(postToDelete);
      if (response.success) {
        setPosts(posts.filter((post) => post._id !== postToDelete));
        toast.success("Post deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete post.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete post.";
      toast.error(errorMessage);
      console.error("Error deleting post:", error);
    }
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const handleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await postService.likePost(postId, token);
      if (response.success) {
        setPosts(
          posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: post.likes ? [...post.likes, user._id] : [user._id],
                }
              : post
          )
        );
        toast.success("Post liked successfully!");
      } else {
        toast.error(response.message || "Failed to like post.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to like post.";
      toast.error(errorMessage);
      console.error("Error liking post:", error);
    }
  };

  const handleSharePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await postService.sharePost(postId, token);
      if (response.success) {
        setPosts(
          posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  shares: post.shares ? [...post.shares, user._id] : [user._id],
                }
              : post
          )
        );
        toast.success("Post shared successfully!");
      } else {
        toast.error(response.message || "Failed to share post.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to share post.";
      toast.error(errorMessage);
      console.error("Error sharing post:", error);
    }
  };

  const handleLocationClick = () => {
    setShareLocation(!shareLocation);
  };

  const handlePublicClick = () => {
    const privacyStates = ["public", "friends", "private"];
    const currentIndex = privacyStates.indexOf(privacy);
    const nextIndex = (currentIndex + 1) % privacyStates.length;
    const newPrivacy = privacyStates[nextIndex];
    setPrivacy(newPrivacy);
  };

  const handleViewCountClick = (postId) => {
    toast.info("View details coming soon!");
  };

  const handleCommentAdded = (newComment) => {
    setPosts(
      posts.map((post) =>
        post._id === newComment.post
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      )
    );
  };

  const handleCloseModal = () => {
    setIsCreateModalClosing(true);
    setTimeout(() => {
      setShowCreatePostModal(false);
      setIsCreateModalClosing(false);
      setModalSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setModalFileInputKey((prevKey) => prevKey + 1);
    }, 300);
  };

  const handleCloseDeleteModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setPostToDelete(null);
      setIsModalClosing(false);
    }, 300);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#191f2b]">
        {/* Navbar */}
        <div className="navbar bg-gradient-to-r from-[#1d2838] to-[#1e2939] border-b border-gray-700/50 shadow-lg backdrop-blur-sm sticky top-0 z-50">
          <div className="navbar-start">
            <div className="dropdown">
              <button
                type="button"
                tabIndex={0}
                role="button"
                className="btn btn-ghost text-gray-300 hover:bg-[#D984BB]/10 hover:text-white border-0 focus:outline-none lg:hidden transition-all duration-200"
                aria-label="Open menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </button>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-[#1e2939]/95 backdrop-blur-md rounded-xl w-52 border border-gray-700/50"
              >
                <li>
                  <button
                    type="button"
                    className="text-gray-300 hover:bg-[#D984BB]/10 hover:text-white w-full text-left transition-colors duration-200"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-300 hover:bg-[#D984BB]/10 hover:text-white w-full text-left transition-colors duration-200"
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-300 hover:bg-[#D984BB]/10 hover:text-white w-full text-left transition-colors duration-200"
                  >
                    Settings
                  </button>
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="text-gray-300 focus:outline-none cursor-pointer ml-2"
              aria-label="Go to home"
            >
              <img
                src="/yolo-logo.svg"
                alt="Yolo Logo"
                className="w-11 h-11 transition-all duration-200 hover:scale-105 hover:brightness-110"
              />
            </button>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <button
                  type="button"
                  className="text-gray-300 hover:bg-[#D984BB]/10 hover:text-white transition-colors duration-200 px-4"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-gray-300 hover:bg-[#D984BB]/10 hover:text-white transition-colors duration-200 px-4"
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-gray-300 hover:bg-[#D984BB]/10 hover:text-white transition-colors duration-200 px-4"
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            <div className="flex items-center gap-4">
              {/* Search Box */}
              <div className="hidden lg:block">
                <label className="input input-bordered flex items-center gap-2 bg-[#1e2939]/50 border border-transparent hover:border-[#D984BB]/30 focus-within:border-[#D984BB]/50 text-gray-300 w-64 transition-colors duration-200 rounded-lg focus-within:outline-none">
                  <svg
                    className="h-4 w-4 opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </g>
                  </svg>
                  <input
                    type="search"
                    className="grow bg-transparent placeholder-gray-400 focus:outline-none"
                    placeholder="Search..."
                  />
                  <kbd className="kbd kbd-sm bg-gray-800 text-gray-300 border-gray-700">
                    ctrl
                  </kbd>
                  <kbd className="kbd kbd-sm bg-gray-800 text-gray-300 border-gray-700">
                    k
                  </kbd>
                </label>
              </div>
              <div className="relative">
                <button
                  type="button"
                  className="btn btn-ghost btn-circle text-gray-300 hover:bg-[#D984BB]/10 hover:text-white border-0 focus:outline-none group transition-all duration-200"
                  aria-label="Notifications"
                >
                  <div className="indicator">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 transform transition-all duration-200 group-hover:scale-110 group-hover:rotate-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <span className="badge badge-xs badge-primary indicator-item animate-pulse"></span>
                  </div>
                </button>
              </div>
              <div className="dropdown dropdown-end">
                <button
                  type="button"
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar hover:bg-[#D984BB]/10 border-0 focus:outline-none transition-all duration-200"
                  aria-label="User menu"
                >
                  <div className="w-10 rounded-full ring ring-[#D984BB] ring-opacity-50 transition-all duration-200 hover:ring-opacity-100">
                    <img
                      alt="User avatar"
                      src={
                        user?.profilePicture ||
                        "https://ui-avatars.com/api/?name=" + user?.username
                      }
                      className="transition-all duration-200 hover:brightness-110"
                    />
                  </div>
                </button>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-[#1e2939]/95 backdrop-blur-md rounded-xl w-52 border border-gray-700/50"
                >
                  <li>
                    <button
                      type="button"
                      className="text-gray-300 hover:bg-[#D984BB]/10 hover:text-white w-full text-left transition-colors duration-200"
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="text-gray-300 hover:bg-[#D984BB]/10 hover:text-white w-full text-left transition-colors duration-200"
                    >
                      Settings
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 relative">
          {/* Left Sidebar - Fixed */}
          <aside className="hidden lg:block w-100 bg-gray-800 p-6 border-r border-gray-700 flex flex-col fixed left-0 top-0 h-screen overflow-y-auto sidebar-no-scrollbar pt-20">
            {/* User Profile Section */}
            <div className="relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 group">
                <div className="absolute inset-0 border-4 border-[#D984BB]/30 group-hover:border-[#D984BB]/50 rounded-full transition-all duration-300"></div>
                <img
                  src={
                    user?.profilePicture ||
                    "https://ui-avatars.com/api/?name=JD&background=F299A9&color=FFFFFF"
                  }
                  alt="User Avatar"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white group-hover:text-[#D984BB] transition-colors duration-200">
                  {user?.username || "John Doe"}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  @
                  {user?.username
                    ? user.username.toLowerCase().replace(/\s+/g, "_")
                    : "johndoe"}
                </p>
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div className="group cursor-pointer">
                    <p className="font-bold text-lg text-white group-hover:text-[#D984BB] transition-colors duration-200">
                      123
                    </p>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                      Followers
                    </p>
                  </div>
                  <div className="group cursor-pointer">
                    <p className="font-bold text-lg text-white group-hover:text-[#D984BB] transition-colors duration-200">
                      456
                    </p>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                      Following
                    </p>
                  </div>
                </div>
                <button className="mt-6 relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 backdrop-blur-sm rounded-xl px-6 py-3 transition-all duration-300 hover:scale-103 border border-gray-600/70 hover:border-[#D984BB]/70 group w-full cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D984BB]/0 via-[#D984BB]/10 to-[#D984BB]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-[#D984BB] group-hover:text-[#D782D9] transition-colors duration-200"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-[#D984BB] group-hover:text-[#D782D9] font-medium transition-colors duration-200">
                      My Profile
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mb-8 bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50">
              <ul className="space-y-3">
                {/* Navigation Item: News Feed */}
                <li>
                  <button
                    onClick={() => handleNavigationClick("News Feed")}
                    className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#D984BB]/20 hover:scale-[1.02] w-full text-left cursor-pointer border border-gray-600/70 hover:border-[#D984BB]/70"
                    aria-label="News Feed"
                  >
                    <div className="absolute inset-0 bg-[#D984BB] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center">
                      <span className="mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 text-[#D984BB] group-hover:scale-110 transition-transform duration-300"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                            clipRule="evenodd"
                          />
                          <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
                        </svg>
                      </span>
                      <span className="text-lg text-gray-100 group-hover:text-[#D984BB] transition-colors duration-300">
                        News Feed
                      </span>
                    </div>
                  </button>
                </li>

                {/* Navigation Item: Messages */}
                <li>
                  <button
                    onClick={() => handleNavigationClick("Messages")}
                    className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#F299A9]/20 hover:scale-[1.02] w-full text-left cursor-pointer border border-gray-600/70 hover:border-[#F299A9]/70"
                    aria-label="Messages"
                  >
                    <div className="absolute inset-0 bg-[#F299A9] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 text-[#F299A9] group-hover:scale-110 transition-transform duration-300"
                          >
                            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                          </svg>
                        </span>
                        <span className="text-lg text-gray-100 group-hover:text-[#F299A9] transition-colors duration-300">
                          Messages
                        </span>
                      </div>
                      <span className="bg-[#F299A9] text-sm font-bold px-3 py-0.5 rounded-full text-white">
                        6
                      </span>
                    </div>
                  </button>
                </li>

                {/* Navigation Item: Groups */}
                <li>
                  <button
                    onClick={() => handleNavigationClick("Groups")}
                    className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#A9D2F2]/20 hover:scale-[1.02] w-full text-left cursor-pointer border border-gray-600/70 hover:border-[#A9D2F2]/70"
                    aria-label="Groups"
                  >
                    <div className="absolute inset-0 bg-[#A9D2F2] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center">
                      <span className="mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 text-[#A9D2F2] group-hover:scale-110 transition-transform duration-300"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                            clipRule="evenodd"
                          />
                          <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                        </svg>
                      </span>
                      <span className="text-lg text-gray-100 group-hover:text-[#A9D2F2] transition-colors duration-300">
                        Groups
                      </span>
                    </div>
                  </button>
                </li>

                {/* Navigation Item: Friends */}
                <li>
                  <button
                    onClick={() => handleNavigationClick("Friends")}
                    className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#D984BB]/20 hover:scale-[1.02] w-full text-left cursor-pointer border border-gray-600/70 hover:border-[#D984BB]/70"
                    aria-label="Friends"
                  >
                    <div className="absolute inset-0 bg-[#D984BB] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 text-[#D984BB] group-hover:scale-110 transition-transform duration-300"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0A.75.75 0 0 1 21 21h-3.75a.75.75 0 0 0 0-1.5H21a.75.75 0 0 1 0 1.5h-3.75a.75.75 0 0 0 0 1.5Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <span className="text-lg text-gray-100 group-hover:text-[#D984BB] transition-colors duration-300">
                          Friends
                        </span>
                      </div>
                      <span className="bg-[#D984BB] text-sm font-bold px-3 py-0.5 rounded-full text-white">
                        3
                      </span>
                    </div>
                  </button>
                </li>

                {/* Navigation Item: Videos */}
                <li>
                  <button
                    onClick={() => handleNavigationClick("Videos")}
                    className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#F299A9]/20 hover:scale-[1.02] w-full text-left cursor-pointer border border-gray-600/70 hover:border-[#F299A9]/70"
                    aria-label="Videos"
                  >
                    <div className="absolute inset-0 bg-[#F299A9] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center">
                      <span className="mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 text-[#F299A9] group-hover:scale-110 transition-transform duration-300"
                        >
                          <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
                        </svg>
                      </span>
                      <span className="text-lg text-gray-100 group-hover:text-[#F299A9] transition-colors duration-300">
                        Videos
                      </span>
                    </div>
                  </button>
                </li>

                {/* Navigation Item: Settings */}
                <li>
                  <button
                    onClick={() => handleNavigationClick("Settings")}
                    className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#A9D2F2]/20 hover:scale-[1.02] w-full text-left cursor-pointer border border-gray-600/70 hover:border-[#A9D2F2]/70"
                    aria-label="Settings"
                  >
                    <div className="absolute inset-0 bg-[#A9D2F2] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center">
                      <span className="mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 text-[#A9D2F2] group-hover:scale-110 transition-transform duration-300"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-lg text-gray-100 group-hover:text-[#A9D2F2] transition-colors duration-300">
                        Settings
                      </span>
                    </div>
                  </button>
                </li>

                {/* Navigation Item: Logout Button */}
                <li>
                  <button
                    onClick={logout}
                    className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:scale-[1.02] w-full text-left cursor-pointer border border-gray-600/70 hover:border-[#fb2c36]/70"
                  >
                    <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center">
                      <span className="mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 text-red-400 group-hover:scale-110 transition-transform duration-300"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72a.75.75 0 1 0-1.06-1.06L10.94 12Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-lg text-red-400 group-hover:text-red-300 transition-colors duration-300">
                        Logout
                      </span>
                    </div>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Popular Hashtags Section */}
            <div className="mb-8 bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Popular Hashtags
                </h3>
                <span className="text-xs text-gray-400">Trending topics</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href="#" className="group">
                  <span className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full border border-gray-600 hover:bg-[#D984BB] hover:text-white hover:border-[#D984BB] transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-[#D984BB]/20 hover:scale-105">
                    <span className="text-[#D984BB] group-hover:text-white">
                      #
                    </span>
                    <span>WebDevelopment</span>
                  </span>
                </a>
                <a href="#" className="group">
                  <span className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full border border-gray-600 hover:bg-[#F299A9] hover:text-white hover:border-[#F299A9] transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-[#F299A9]/20 hover:scale-105">
                    <span className="text-[#F299A9] group-hover:text-white">
                      #
                    </span>
                    <span>ReactJS</span>
                  </span>
                </a>
                <a href="#" className="group">
                  <span className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full border border-gray-600 hover:bg-[#A9D2F2] hover:text-white hover:border-[#A9D2F2] transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-[#A9D2F2]/20 hover:scale-105">
                    <span className="text-[#A9D2F2] group-hover:text-white">
                      #
                    </span>
                    <span>JavaScript</span>
                  </span>
                </a>
                <a href="#" className="group">
                  <span className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full border border-gray-600 hover:bg-[#D984BB] hover:text-white hover:border-[#D984BB] transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-[#D984BB]/20 hover:scale-105">
                    <span className="text-[#D984BB] group-hover:text-white">
                      #
                    </span>
                    <span>Programming</span>
                  </span>
                </a>
                <a href="#" className="group">
                  <span className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full border border-gray-600 hover:bg-[#F299A9] hover:text-white hover:border-[#F299A9] transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-[#F299A9]/20 hover:scale-105">
                    <span className="text-[#F299A9] group-hover:text-white">
                      #
                    </span>
                    <span>WebDesign</span>
                  </span>
                </a>
                <a href="#" className="group">
                  <span className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full border border-gray-600 hover:bg-[#A9D2F2] hover:text-white hover:border-[#A9D2F2] transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-[#A9D2F2]/20 hover:scale-105">
                    <span className="text-[#A9D2F2] group-hover:text-white">
                      #
                    </span>
                    <span>TechNews</span>
                  </span>
                </a>
                <a href="#" className="group">
                  <span className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full border border-gray-600 hover:bg-[#D984BB] hover:text-white hover:border-[#D984BB] transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-[#D984BB]/20 hover:scale-105">
                    <span className="text-[#D984BB] group-hover:text-white">
                      #
                    </span>
                    <span>AI</span>
                  </span>
                </a>
                <a href="#" className="group">
                  <span className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full border border-gray-600 hover:bg-[#F299A9] hover:text-white hover:border-[#F299A9] transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-[#F299A9]/20 hover:scale-105">
                    <span className="text-[#F299A9] group-hover:text-white">
                      #
                    </span>
                    <span>DevOps</span>
                  </span>
                </a>
                <a href="#" className="group">
                  <span className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full border border-gray-600 hover:bg-[#A9D2F2] hover:text-white hover:border-[#A9D2F2] transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-[#A9D2F2]/20 hover:scale-105">
                    <span className="text-[#A9D2F2] group-hover:text-white">
                      #
                    </span>
                    <span>CloudComputing</span>
                  </span>
                </a>
                <a href="#" className="group">
                  <span className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full border border-gray-600 hover:bg-[#D984BB] hover:text-white hover:border-[#D984BB] transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-[#D984BB]/20 hover:scale-105">
                    <span className="text-[#D984BB] group-hover:text-white">
                      #
                    </span>
                    <span>Cybersecurity</span>
                  </span>
                </a>
                <a href="#" className="group">
                  <span className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full border border-gray-600 hover:bg-[#F299A9] hover:text-white hover:border-[#F299A9] transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-[#F299A9]/20 hover:scale-105">
                    <span className="text-[#F299A9] group-hover:text-white">
                      #
                    </span>
                    <span>MobileDev</span>
                  </span>
                </a>
                <a href="#" className="group">
                  <span className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 text-sm px-3 py-1.5 rounded-full border border-gray-600 hover:bg-[#A9D2F2] hover:text-white hover:border-[#A9D2F2] transition-all duration-300 flex items-center gap-1 hover:shadow-lg hover:shadow-[#A9D2F2]/20 hover:scale-105">
                    <span className="text-[#A9D2F2] group-hover:text-white">
                      #
                    </span>
                    <span>DataScience</span>
                  </span>
                </a>
              </div>
            </div>

            {/* Communities Section */}
            <div className="mb-8 relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Communities
                </h3>
                <span className="text-xs text-gray-400">
                  Join discussions now!
                </span>
              </div>
              <div className="space-y-4">
                <a href="#" className="block group">
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:scale-103 border border-gray-600/70 hover:border-[#61DAFB]/70">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#61DAFB]/0 via-[#61DAFB]/10 to-[#61DAFB]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 border border-[#61DAFB]/0 group-hover:border-[#61DAFB]/30 rounded-xl transition-colors duration-300"></div>
                    <div className="relative flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[#61DAFB]/20 group-hover:ring-[#61DAFB]/40 transition-all duration-300">
                          <img
                            src={reactLogo}
                            alt="React Devs"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-gray-800"></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <h4 className="text-white font-medium text-base truncate group-hover:text-[#61DAFB] transition-colors duration-200">
                            React Devs
                          </h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-gray-400 text-sm">12.5k members</p>
                          <span className="text-gray-500">•</span>
                          <p className="text-gray-400 text-sm">1.2k posts</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-2 py-0.5 text-xs font-medium bg-[#61DAFB]/10 text-[#61DAFB] rounded-full">
                          Trending
                        </span>
                        <button className="p-2 rounded-lg bg-[#61DAFB]/10 text-[#61DAFB] hover:bg-[#61DAFB]/20 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                            <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </a>

                <a href="#" className="block group">
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:scale-103 border border-gray-600/70 hover:border-[#DD0031]/70">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#DD0031]/0 via-[#DD0031]/10 to-[#DD0031]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 border border-[#DD0031]/0 group-hover:border-[#DD0031]/30 rounded-xl transition-colors duration-300"></div>
                    <div className="relative flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[#DD0031]/20 group-hover:ring-[#DD0031]/40 transition-all duration-300">
                          <img
                            src={angularLogo}
                            alt="Angular"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-gray-800"></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <h4 className="text-white font-medium text-base truncate group-hover:text-[#DD0031] transition-colors duration-200">
                            Angular
                          </h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-gray-400 text-sm">8.2k members</p>
                          <span className="text-gray-500">•</span>
                          <p className="text-gray-400 text-sm">856 posts</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-2 py-0.5 text-xs font-medium bg-[#DD0031]/10 text-[#DD0031] rounded-full">
                          Active
                        </span>
                        <button className="p-2 rounded-lg bg-[#DD0031]/10 text-[#DD0031] hover:bg-[#DD0031]/20 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                            <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </a>

                <a href="#" className="block group">
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:scale-103 border border-gray-600/70 hover:border-[#F7DF1E]/70">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F7DF1E]/0 via-[#F7DF1E]/10 to-[#F7DF1E]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 border border-[#F7DF1E]/0 group-hover:border-[#F7DF1E]/30 rounded-xl transition-colors duration-300"></div>
                    <div className="relative flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[#F7DF1E]/20 group-hover:ring-[#F7DF1E]/40 transition-all duration-300">
                          <img
                            src={jsLogo}
                            alt="JavaScript"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-gray-800"></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <h4 className="text-white font-medium text-base truncate group-hover:text-[#F7DF1E] transition-colors duration-200">
                            JavaScript
                          </h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-gray-400 text-sm">15.7k members</p>
                          <span className="text-gray-500">•</span>
                          <p className="text-gray-400 text-sm">2.3k posts</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-2 py-0.5 text-xs font-medium bg-[#F7DF1E]/10 text-[#F7DF1E] rounded-full">
                          Popular
                        </span>
                        <button className="p-2 rounded-lg bg-[#F7DF1E]/10 text-[#F7DF1E] hover:bg-[#F7DF1E]/20 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                            <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </a>

                <a href="#" className="block group">
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:scale-103 border border-gray-600/70 hover:border-[#F24E1E]/70">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F24E1E]/0 via-[#F24E1E]/10 to-[#F24E1E]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 border border-[#F24E1E]/0 group-hover:border-[#F24E1E]/30 rounded-xl transition-colors duration-300"></div>
                    <div className="relative flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[#F24E1E]/20 group-hover:ring-[#F24E1E]/40 transition-all duration-300">
                          <img
                            src={figmaLogo}
                            alt="UI/UX Design"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-gray-800"></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <h4 className="text-white font-medium text-base truncate group-hover:text-[#F24E1E] transition-colors duration-200">
                            UI/UX Design
                          </h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-gray-400 text-sm">8.2k members</p>
                          <span className="text-gray-500">•</span>
                          <p className="text-gray-400 text-sm">645 posts</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-2 py-0.5 text-xs font-medium bg-[#F24E1E]/10 text-[#F24E1E] rounded-full">
                          New
                        </span>
                        <button className="p-2 rounded-lg bg-[#F24E1E]/10 text-[#F24E1E] hover:bg-[#F24E1E]/20 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                            <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              <div className="mt-6 flex justify-center">
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-700/20 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Explore more topics</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content - Scrollable */}
          <main className="flex-1 w-full p-6 bg-[#191f2b] overflow-y-auto lg:ml-[25rem] 2xl:mr-[35rem] pt-12">
            <div className="max-w-4xl mx-auto">
              {/* Top Navigation for Feeds */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Feeds</h2>
                <div className="hidden md:flex space-x-2">
                  <button
                    type="button"
                    className="bg-[#D984BB] hover:bg-[#D782D9] text-white font-semibold py-1.5 px-4 rounded-full transition duration-200 flex items-center gap-2 cursor-pointer text-sm"
                    aria-label="Show recent posts"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Recent
                  </button>
                  <button
                    type="button"
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-1.5 px-4 rounded-full transition duration-200 flex items-center gap-2 cursor-pointer text-sm"
                    aria-label="Show trending posts"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.22 6.268a.75.75 0 0 1 .968-.432l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.941a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.483a11.2 11.2 0 0 0-5.45 5.174.75.75 0 0 1-1.199.19L9 12.31l-6.22 6.22a.75.75 0 1 1-1.06-1.06l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.605a12.694 12.694 0 0 1 5.68-4.973l1.086-.484-4.251-1.631a.75.75 0 0 1-.432-.97Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Trending
                  </button>
                </div>
                <div className="md:hidden">
                  <button
                    type="button"
                    className="bg-gray-800 p-2 rounded-lg text-white hover:bg-gray-700 transition duration-200 cursor-pointer"
                    aria-label="Open feed menu"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Share Something Section */}
              <div className="bg-[#1e2939] rounded-lg shadow-lg p-4 sm:p-6 mb-8">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <img
                    src={
                      user?.profilePicture ||
                      "https://ui-avatars.com/api/?name=" + user?.username
                    }
                    alt="Your profile"
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <textarea
                      className="w-full bg-gray-700 text-white rounded-lg p-3 sm:p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#D984BB] text-sm sm:text-base"
                      placeholder="What's on your mind?"
                      rows="3"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    ></textarea>
                    {selectedImage && (
                      <div className="mt-3 sm:mt-4 relative">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          className="max-h-48 sm:max-h-96 w-full object-contain rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            if (mainFileInputRef.current) {
                              mainFileInputRef.current.value = "";
                            }
                          }}
                          className="absolute top-2 right-2 bg-gray-800/80 text-white p-1 rounded-full hover:bg-gray-700/80 transition-colors duration-200"
                          aria-label="Remove image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 gap-3 sm:gap-4">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <button
                          type="button"
                          onClick={() => handleImageClick(false)}
                          className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200 flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-full hover:bg-emerald-400/10 cursor-pointer group"
                          aria-label="Add image to post"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-xs sm:text-sm font-medium">
                            Image
                          </span>
                        </button>
                        <input
                          type="file"
                          key={mainFileInputKey} // Add key here
                          ref={mainFileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleLocationClick()}
                          className={`transition-colors duration-200 flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-full cursor-pointer group ${
                            shareLocation
                              ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                              : "text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          }`}
                          aria-label={
                            shareLocation
                              ? "Location shared"
                              : "Location not shared"
                          }
                        >
                          {shareLocation ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                          )}
                          <span className="text-xs sm:text-sm font-medium">
                            {shareLocation ? "Share Location" : "No Location"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePublicClick}
                          className={`transition-colors duration-200 flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-full cursor-pointer group ${
                            privacy === "public"
                              ? "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-400/10"
                              : privacy === "friends"
                              ? "text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                              : "text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          }`}
                          aria-label={`Change privacy to ${
                            privacy === "public"
                              ? "friends"
                              : privacy === "friends"
                              ? "private"
                              : "public"
                          }`}
                        >
                          {privacy === "public" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                              />
                            </svg>
                          ) : privacy === "friends" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                              />
                            </svg>
                          )}
                          <span className="text-xs sm:text-sm font-medium">
                            {privacy === "public"
                              ? "Public"
                              : privacy === "friends"
                              ? "Friends"
                              : "Only You"}
                          </span>
                        </button>
                      </div>
                      <div className="flex justify-end w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handleCreatePost(false)}
                          disabled={isPosting}
                          className="bg-[#D984BB] hover:bg-[#D782D9] text-white font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm whitespace-nowrap group"
                          aria-label="Create post"
                        >
                          {isPosting ? (
                            <>
                              <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                              <span>Posting...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                              >
                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                              </svg>
                              <span>Post</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamically rendered Post Cards */}
              <div className="space-y-8">
                {isFetchingPosts ? (
                  <div className="flex justify-center items-center h-48">
                    <span className="loading loading-spinner loading-lg text-[#D984BB]"></span>
                    <p className="text-gray-400 ml-3">Fetching posts...</p>
                  </div>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-[#1e2939] rounded-2xl shadow-xl overflow-hidden mb-6 transform transition-all duration-300 hover:shadow-2xl"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={
                                  post.author?.profilePicture ||
                                  "https://i.ibb.co/8nhPf8Q0/default-pfp.png"
                                }
                                alt={post.author?.username || "Unknown"}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#D984BB] ring-offset-2 ring-offset-[#1e2939]"
                              />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg">
                                {post.author?.username || "Unknown"}
                              </h3>
                              <span className="text-gray-400 text-sm">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                          {post.content}
                        </p>
                        {post.images && post.images.length > 0 && (
                          <div className="my-6 overflow-hidden rounded-2xl shadow-lg">
                            <img
                              src={post.images[0]}
                              alt="Post"
                              className="w-full h-auto rounded-2xl object-cover max-h-[500px] transform transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex flex-wrap items-center justify-between text-gray-400 text-sm pt-4">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <button
                              onClick={() => handleLikePost(post._id)}
                              className="flex items-center gap-2 text-pink-400 hover:text-pink-300 hover:bg-pink-400/10 transition-all duration-200 px-4 py-2 rounded-full cursor-pointer group"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                              <span className="font-semibold">
                                {getInteractionNumbers(post._id).likes}
                              </span>
                              <span className="text-sm font-medium">Likes</span>
                            </button>
                            <button
                              onClick={() => handleSharePost(post._id)}
                              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 transition-all duration-200 px-4 py-2 rounded-full cursor-pointer group"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                              </svg>
                              <span className="font-semibold">
                                {getInteractionNumbers(post._id).shares}
                              </span>
                              <span className="text-sm font-medium">
                                Shares
                              </span>
                            </button>
                            <button
                              onClick={() => handleViewCountClick(post._id)}
                              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 transition-all duration-200 px-4 py-2 rounded-full cursor-pointer group"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              <span className="font-semibold">
                                {getInteractionNumbers(post._id).views}
                              </span>
                              <span className="text-sm font-medium">Views</span>
                            </button>
                          </div>
                          {/* Debug logs for delete button visibility */}
                          {console.log("Debug Delete Button:", {
                            postId: post._id,
                            postAuthorId: post.author?._id,
                            currentUserId: user?._id,
                            isAuthorMatch: post.author?._id === user?._id,
                            hasAuthor: !!post.author,
                            isLoggedIn: !!user,
                          })}
                          {post.author?._id === user?._id && (
                            <button
                              onClick={() => {
                                setPostToDelete(post._id);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200 px-4 py-2 rounded-full cursor-pointer flex items-center gap-2 group mt-2 sm:mt-0"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              <span className="text-sm font-medium">
                                Delete
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Add CommentSection component */}
                      <div className="px-6 pb-6 border-t border-gray-700">
                        <CommentSection
                          post={post}
                          onCommentAdded={(comment) =>
                            handleCommentAdded(comment)
                          }
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">
                      No posts yet. Be the first to share something!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Right Sidebar - Fixed */}
          <aside className="hidden 2xl:block w-[35rem] bg-gray-800 p-6 border-l border-gray-700 fixed right-0 top-0 h-screen overflow-y-auto sidebar-no-scrollbar pt-20">
            {/* Stories Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Stories</h3>
              <div className="relative">
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md z-10"
                  onClick={() =>
                    document
                      .querySelector(".stories-container")
                      .scrollBy({ left: -250, behavior: "smooth" })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div
                  className="flex gap-4 overflow-x-auto pb-2 scrollbar-none stories-container items-center px-12"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    height: "180px",
                  }}
                >
                  {/* Create Story Card */}
                  <div className="relative min-w-[120px] h-40 rounded-xl overflow-hidden border-4 border-gray-400 bg-gray-900 shadow-md cursor-pointer group transition-transform duration-200 hover:scale-105">
                    <img
                      src={
                        user?.profilePicture ||
                        "https://ui-avatars.com/api/?name=" + user?.username
                      }
                      alt="Your profile"
                      className="w-full h-full object-cover group-hover:brightness-90 transition duration-200"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-10 h-10 rounded-full bg-[#D984BB] flex items-center justify-center border-2 border-white shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold bg-black/40 rounded px-2 py-1 truncate text-center">
                      Create Story
                    </div>
                  </div>
                  {/* Example Story 1 */}
                  <div className="relative min-w-[120px] h-40 rounded-xl overflow-hidden border-4 border-yellow-400 bg-gray-900 shadow-md cursor-pointer group transition-transform duration-200 hover:scale-105">
                    <img
                      src={abdoImage}
                      alt="Story"
                      className="w-full h-full object-cover group-hover:brightness-90 transition duration-200"
                    />
                    <div className="absolute top-2 left-2 flex items-center">
                      <img
                        src={abdoProfileImage}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                      />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold bg-black/40 rounded px-2 py-1 truncate text-center">
                      Abdo Sayed
                    </div>
                  </div>
                  {/* Example Story 2 */}
                  <div className="relative min-w-[120px] h-40 rounded-xl overflow-hidden border-4 border-pink-400 bg-gray-900 shadow-md cursor-pointer group transition-transform duration-200 hover:scale-105">
                    <img
                      src={ahmedImage}
                      alt="Story"
                      className="w-full h-full object-cover group-hover:brightness-90 transition duration-200"
                    />
                    <div className="absolute top-2 left-2 flex items-center">
                      <img
                        src={ahmedProfileImage}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                      />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold bg-black/40 rounded px-2 py-1 truncate text-center">
                      Ahmed Amr
                    </div>
                  </div>
                  {/* Example Story 3 */}
                  <div className="relative min-w-[120px] h-40 rounded-xl overflow-hidden border-4 border-blue-400 bg-gray-900 shadow-md cursor-pointer group transition-transform duration-200 hover:scale-105">
                    <img
                      src={aliImage}
                      alt="Story"
                      className="w-full h-full object-cover group-hover:brightness-90 transition duration-200"
                    />
                    <div className="absolute top-2 left-2 flex items-center">
                      <img
                        src={aliProfileImage}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                      />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold bg-black/40 rounded px-2 py-1 truncate text-center">
                      Ali Ibrahim
                    </div>
                  </div>
                  {/* Example Story 4 */}
                  <div className="relative min-w-[120px] h-40 rounded-xl overflow-hidden border-4 border-green-400 bg-gray-900 shadow-md cursor-pointer group transition-transform duration-200 hover:scale-105">
                    <img
                      src={eliasImage}
                      alt="Story"
                      className="w-full h-full object-cover group-hover:brightness-90 transition duration-200"
                    />
                    <div className="absolute top-2 left-2 flex items-center">
                      <img
                        src={eliasProfileImage}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                      />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold bg-black/40 rounded px-2 py-1 truncate text-center">
                      Elias Shoaib
                    </div>
                  </div>
                </div>
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md z-10"
                  onClick={() =>
                    document
                      .querySelector(".stories-container")
                      .scrollBy({ left: 250, behavior: "smooth" })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Suggestions Section */}
            <div className="mb-8 bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100">
                  Suggestions for You
                </h3>
                <span className="text-xs text-gray-400">
                  Based on your interests
                </span>
              </div>
              <div className="space-y-4">
                {/* Example Suggestion 1 */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#D984BB]/20 hover:scale-[1.02] border border-gray-600/70 hover:border-[#D984BB]/70">
                  <div className="absolute inset-0 bg-[#D984BB] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative cursor-pointer">
                        <img
                          src={zagProfileImage}
                          alt="User"
                          className="w-12 h-12 rounded-full mr-3 ring-2 ring-[#D984BB] ring-offset-2 ring-offset-gray-800 transition-transform duration-300 group-hover:scale-110"
                        />
                        <span className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-100 group-hover:text-[#D984BB] transition-colors duration-300 cursor-pointer">
                          Ahmed Zaghloul
                        </p>
                        <p className="text-gray-400 text-sm">@ahmed_zaghloul</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            2.5k followers
                          </span>
                          <span className="text-gray-600">•</span>
                          <span className="text-xs text-gray-400">
                            156 posts
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-[#D984BB] hover:bg-[#D782D9] text-white text-sm font-bold py-1.5 px-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#D984BB]/20 cursor-pointer">
                      Follow
                    </button>
                  </div>
                </div>

                {/* Example Suggestion 2 */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#F299A9]/20 hover:scale-[1.02] border border-gray-600/70 hover:border-[#F299A9]/70">
                  <div className="absolute inset-0 bg-[rgb(242,153,169)] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative cursor-pointer">
                        <img
                          src={yahyaProfileImage}
                          alt="User"
                          className="w-12 h-12 rounded-full mr-3 ring-2 ring-[#F299A9] ring-offset-2 ring-offset-gray-800 transition-transform duration-300 group-hover:scale-110"
                        />
                        <span className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-100 group-hover:text-[#F299A9] transition-colors duration-300 cursor-pointer">
                          Yahya Hassan
                        </p>
                        <p className="text-gray-400 text-sm">@squarehead</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            1.8k followers
                          </span>
                          <span className="text-gray-600">•</span>
                          <span className="text-xs text-gray-400">
                            89 posts
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-[#F299A9] hover:bg-[#F282D9] text-white text-sm font-bold py-1.5 px-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#F299A9]/20 cursor-pointer">
                      Follow
                    </button>
                  </div>
                </div>

                {/* Example Suggestion 3 */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#A9D2F2]/20 hover:scale-[1.02] border border-gray-600/70 hover:border-[#A9D2F2]/70">
                  <div className="absolute inset-0 bg-[#A9D2F2] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative cursor-pointer">
                        <img
                          src={bilalProfileImage}
                          alt="User"
                          className="w-12 h-12 rounded-full mr-3 ring-2 ring-[#A9D2F2] ring-offset-2 ring-offset-gray-800 transition-transform duration-300 group-hover:scale-110"
                        />
                        <span className="absolute bottom-0 right-3 w-3 h-3 bg-gray-500 rounded-full border-2 border-gray-800"></span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-100 group-hover:text-[#A9D2F2] transition-colors duration-300 cursor-pointer">
                          Bilal Saad
                        </p>
                        <p className="text-gray-400 text-sm">@bilalsaad92</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            3.2k followers
                          </span>
                          <span className="text-gray-600">•</span>
                          <span className="text-xs text-gray-400">
                            245 posts
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-[#A9D2F2] hover:bg-[#A9C2F2] text-white text-sm font-bold py-1.5 px-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#A9D2F2]/20 cursor-pointer">
                      Follow
                    </button>
                  </div>
                </div>

                <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-700/20 flex items-center justify-center gap-2 cursor-pointer">
                  <span>See all suggestions</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="mb-8 bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100">
                  Recommended Topics
                </h3>
                <span className="text-xs text-gray-400">
                  Based on your activity
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* UI/UX Card */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#D984BB]/20 hover:scale-[1.02] cursor-pointer border border-gray-600/70 hover:border-[#D984BB]/70">
                  <div className="absolute inset-0 bg-[#D984BB] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 bg-[#D984BB] rounded-full flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <span className="text-3xl">🎨</span>
                      </div>
                      <span className="text-xs bg-[#D984BB]/20 text-[#D984BB] px-2 py-1 rounded-full">
                        Trending
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-100 group-hover:text-[#D984BB] transition-colors duration-300">
                      UI/UX
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Design & Creativity
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        2.5k followers
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-xs text-gray-400">1.2k posts</span>
                    </div>
                  </div>
                </div>

                {/* Music Card */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#F299A9]/20 hover:scale-[1.02] cursor-pointer border border-gray-600/70 hover:border-[#F299A9]/70">
                  <div className="absolute inset-0 bg-[#F299A9] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 bg-[#F299A9] rounded-full flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <span className="text-3xl">🎵</span>
                      </div>
                      <span className="text-xs bg-[#F299A9]/20 text-[#F299A9] px-2 py-1 rounded-full">
                        Popular
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-100 group-hover:text-[#F299A9] transition-colors duration-300">
                      Music
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Art & Entertainment
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        5.8k followers
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-xs text-gray-400">3.4k posts</span>
                    </div>
                  </div>
                </div>

                {/* Cooking Card */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#A9D2F2]/20 hover:scale-[1.02] cursor-pointer border border-gray-600/70 hover:border-[#A9D2F2]/70">
                  <div className="absolute inset-0 bg-[#A9D2F2] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 bg-[#A9D2F2] rounded-full flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <span className="text-3xl">🍳</span>
                      </div>
                      <span className="text-xs bg-[#A9D2F2]/20 text-[#A9D2F2] px-2 py-1 rounded-full">
                        New
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-100 group-hover:text-[#A9D2F2] transition-colors duration-300">
                      Cooking
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Food & Recipes</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        1.9k followers
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-xs text-gray-400">856 posts</span>
                    </div>
                  </div>
                </div>

                {/* Hiking Card */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#97D2BF]/20 hover:scale-[1.02] cursor-pointer border border-gray-600/70 hover:border-[#97D2BF]/70">
                  <div className="absolute inset-0 bg-[#97D2BF] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 bg-[#97D2BF] rounded-full flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <span className="text-3xl">⛰️</span>
                      </div>
                      <span className="text-xs bg-[#97D2BF]/20 text-[#97D2BF] px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-100 group-hover:text-[#97D2BF] transition-colors duration-300">
                      Hiking
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Outdoor & Adventure
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        3.2k followers
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-xs text-gray-400">1.5k posts</span>
                    </div>
                  </div>
                </div>

                {/* Photography Card */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#E6A4B4]/20 hover:scale-[1.02] cursor-pointer border border-gray-600/70 hover:border-[#E6A4B4]/70">
                  <div className="absolute inset-0 bg-[#E6A4B4] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 bg-[#E6A4B4] rounded-full flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <span className="text-3xl">📸</span>
                      </div>
                      <span className="text-xs bg-[#E6A4B4]/20 text-[#E6A4B4] px-2 py-1 rounded-full">
                        Hot
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-100 group-hover:text-[#E6A4B4] transition-colors duration-300">
                      Photography
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Visual Arts</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        4.7k followers
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-xs text-gray-400">2.8k posts</span>
                    </div>
                  </div>
                </div>

                {/* Technology Card */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#9B6B9E]/20 hover:scale-[1.02] cursor-pointer border border-gray-600/70 hover:border-[#9B6B9E]/70">
                  <div className="absolute inset-0 bg-[#9B6B9E] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 bg-[#9B6B9E] rounded-full flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <span className="text-3xl">💻</span>
                      </div>
                      <span className="text-xs bg-[#9B6B9E]/20 text-[#9B6B9E] px-2 py-1 rounded-full">
                        Rising
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-100 group-hover:text-[#9B6B9E] transition-colors duration-300">
                      Technology
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Innovation & Tech
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        6.3k followers
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-xs text-gray-400">4.1k posts</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-700/20 flex items-center justify-center gap-2 cursor-pointer">
                <span>Explore more topics</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </aside>
        </div>

        {/* Delete Confirmation Modal */}
        {(showDeleteModal || isModalClosing) && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 ${
              isModalClosing ? "animate-modalFadeOut" : "animate-modalFadeIn"
            }`}
          >
            <div
              ref={modalRef}
              className={`bg-gray-800 rounded-lg shadow-lg p-8 max-w-sm w-full text-center ${
                isModalClosing ? "animate-modalFadeOut" : "animate-modalFadeIn"
              }`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
            >
              <h3
                id="delete-modal-title"
                className="text-xl font-bold mb-4 text-white"
              >
                Delete Post?
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg bg-gray-600 text-gray-200 hover:bg-gray-700 transition cursor-pointer"
                  onClick={handleCloseDeleteModal}
                  aria-label="Cancel delete post"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition font-bold cursor-pointer"
                  onClick={handleDeletePost}
                  aria-label="Confirm delete post"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => setShowCreatePostModal(true)}
          className="fixed bottom-8 right-8 bg-[#D984BB] hover:bg-[#D782D9] text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-40"
          aria-label="Create new post"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        {/* Create Post Modal */}
        {showCreatePostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
              onClick={handleCloseModal}
            ></div>
            <div
              className={`relative bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 ${
                isCreateModalClosing
                  ? "scale-95 opacity-0"
                  : "scale-100 opacity-100"
              }`}
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Create New Post
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer group"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <img
                    src={
                      user?.profilePicture ||
                      "https://ui-avatars.com/api/?name=" + user?.username
                    }
                    alt="Your profile"
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <textarea
                      className="w-full bg-gray-700 text-white rounded-lg p-3 sm:p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#D984BB] text-sm sm:text-base"
                      placeholder="What's on your mind?"
                      rows="3"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    ></textarea>
                    {modalSelectedImage && (
                      <div className="mt-3 sm:mt-4 relative">
                        <img
                          src={URL.createObjectURL(modalSelectedImage)}
                          alt="Selected"
                          className="max-h-48 sm:max-h-96 w-full object-contain rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setModalSelectedImage(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="absolute top-2 right-2 bg-gray-800/80 text-white p-1 rounded-full hover:bg-gray-700/80 transition-colors duration-200"
                          aria-label="Remove image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 gap-3 sm:gap-4">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <button
                          type="button"
                          onClick={() => handleImageClick(true)}
                          className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200 flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-full hover:bg-emerald-400/10 cursor-pointer group"
                          aria-label="Add image to post"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-xs sm:text-sm font-medium">
                            Image
                          </span>
                        </button>
                        <input
                          type="file"
                          key={modalFileInputKey}
                          ref={fileInputRef}
                          onChange={handleModalImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleLocationClick()}
                          className={`transition-colors duration-200 flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-full cursor-pointer group ${
                            shareLocation
                              ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                              : "text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          }`}
                          aria-label={
                            shareLocation
                              ? "Location shared"
                              : "Location not shared"
                          }
                        >
                          {shareLocation ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                          )}
                          <span className="text-xs sm:text-sm font-medium">
                            {shareLocation ? "Share Location" : "No Location"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePublicClick}
                          className={`transition-colors duration-200 flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-full cursor-pointer group ${
                            privacy === "public"
                              ? "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-400/10"
                              : privacy === "friends"
                              ? "text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                              : "text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          }`}
                          aria-label={`Change privacy to ${
                            privacy === "public"
                              ? "friends"
                              : privacy === "friends"
                              ? "private"
                              : "public"
                          }`}
                        >
                          {privacy === "public" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                              />
                            </svg>
                          ) : privacy === "friends" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                              />
                            </svg>
                          )}
                          <span className="text-xs sm:text-sm font-medium">
                            {privacy === "public"
                              ? "Public"
                              : privacy === "friends"
                              ? "Friends"
                              : "Only You"}
                          </span>
                        </button>
                      </div>
                      <div className="flex justify-end w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handleCreatePost(true)}
                          disabled={isPosting}
                          className="bg-[#D984BB] hover:bg-[#D782D9] text-white font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm whitespace-nowrap group"
                          aria-label="Create post"
                        >
                          {isPosting ? (
                            <>
                              <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                              <span>Posting...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"
                              >
                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                              </svg>
                              <span>Post</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default HomePage;
