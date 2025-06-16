import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Connect with Friends",
      description:
        "Join our vibrant community and connect with friends from all around the world.",
      icon: "👥",
      color: "#F299A9", // Pink
    },
    {
      title: "Share Your Moments",
      description:
        "Share your experiences, photos, and stories with your community.",
      icon: "📸",
      color: "#4CAF50", // Green
    },
    {
      title: "Real-time Updates",
      description:
        "Stay connected with instant notifications and real-time updates.",
      icon: "⚡",
      color: "#2196F3", // Blue
    },
    {
      title: "Create Events",
      description:
        "Organize and join exciting events with your community members.",
      icon: "🎉",
      color: "#9C27B0", // Purple
    },
    {
      title: "Join Groups",
      description:
        "Find and join groups that match your interests and passions.",
      icon: "👥",
      color: "#FF9800", // Orange
    },
    {
      title: "Live Chat",
      description: "Engage in real-time conversations with community members.",
      icon: "💬",
      color: "#E91E63", // Deep Pink
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden flex flex-col items-center justify-center min-h-[60vh] pt-16 pb-0">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-transparent z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ca74d6]/20 via-transparent to-transparent z-0" />

        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[70vh] text-center relative z-10 pb-20">
          {/* Logo Section */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 1.5,
            }}
            className="mb-12"
          >
            <motion.img
              src="/yolo-logo.svg"
              alt="Yolo Logo"
              className="w-40 h-40"
              whileHover={{
                scale: 1.1,
                rotate: 5,
                filter: "brightness(1.2)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-6 relative"
          >
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-[#ca74d6] to-[#f59899] blur-xl opacity-50"></span>
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-[#ca74d6] to-[#f59899] drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                Welcome to Yolo
              </span>
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative w-full max-w-4xl mx-auto my-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="relative p-10 rounded-2xl backdrop-blur-md bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#ca74d6]/10 to-[#f59899]/10"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              />

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Card content with enhanced typography */}
              <div className="relative">
                <p className="text-xl md:text-2xl font-bold leading-relaxed text-white/90">
                  <span className="bg-gradient-to-r from-[#ca74d6] to-[#f59899] bg-clip-text text-transparent">
                    Join our vibrant community
                  </span>{" "}
                  and connect with like-minded individuals.{" "}
                  <span className="bg-gradient-to-r from-[#f59899] to-[#ca74d6] bg-clip-text text-transparent">
                    Share your experiences
                  </span>
                  , learn from others, and grow together.
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#ca74d6]/10 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#f59899]/10 to-transparent rounded-full blur-3xl" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(202, 116, 214, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
              className="relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 border border-white/10 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group"
            >
              {/* Button background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ca74d6]/10 to-[#f59899]/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Button text */}
              <span className="relative bg-gradient-to-r from-[#ca74d6] to-[#f59899] bg-clip-text text-transparent font-bold">
                Join the Community
              </span>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#ca74d6]/10 to-transparent rounded-full blur-xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#f59899]/10 to-transparent rounded-full blur-xl" />
            </motion.button>
          </motion.div>
        </div>

        {/* Stars SVG */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute top-0 left-0 w-full pointer-events-none z-0"
        >
          <img
            src="https://cdn.prod.website-files.com/5ffc199ed786423eb2569667/65eae990d904d2547ae7714f_hero%20stars.svg"
            alt="Decorative stars"
            className="w-full h-auto"
          />
        </motion.div>

        {/* Clouds SVG */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute -bottom-10 left-0 w-full pointer-events-none z-0"
        >
          <img
            src="https://cdn.prod.website-files.com/5ffc199ed786423eb2569667/65eae990608962debd5bd167_hero%20clouds%20svg.svg"
            alt="Decorative clouds"
            className="w-full h-auto"
          />
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat"></div>
            </div>

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-center mb-16"
              >
                Why Choose Yolo?
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 transition-all duration-300 hover:shadow-lg cursor-pointer border border-gray-700/50 hover:border-opacity-70"
                    style={{
                      "--hover-color": feature.color,
                      "--hover-border-color": feature.color,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ backgroundColor: feature.color }}
                    ></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <h3
                        className="text-2xl font-bold mb-6 text-gray-100 group-hover:text-opacity-100 transition-colors duration-300"
                        style={{ "--hover-text-color": feature.color }}
                      >
                        {feature.title}
                      </h3>
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{ backgroundColor: feature.color }}
                      >
                        <span className="text-4xl">{feature.icon}</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat"></div>
            </div>

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-center mb-16"
              >
                Frequently Asked Questions
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    question: "How do I get started with Yolo?",
                    answer:
                      "Simply sign up for an account, complete your profile, and start connecting with friends and communities that share your interests.",
                    icon: "🚀",
                    color: "#4CAF50", // Green
                  },
                  {
                    question: "Is Yolo free to use?",
                    answer:
                      "Yes! Yolo is completely free to use. We believe in providing a great social experience without any hidden costs.",
                    icon: "💰",
                    color: "#FF9800", // Orange
                  },
                  {
                    question: "How do I protect my privacy?",
                    answer:
                      "We take privacy seriously. You can control who sees your content, manage your connections, and adjust your privacy settings at any time.",
                    icon: "🔒",
                    color: "#2196F3", // Blue
                  },
                  {
                    question: "Can I create my own community?",
                    answer:
                      "Absolutely! You can create and manage your own community, invite members, and organize events to bring people together.",
                    icon: "👥",
                    color: "#9C27B0", // Purple
                  },
                  {
                    question: "How do I report inappropriate content?",
                    answer:
                      "You can report any content that violates our community guidelines using the report button. Our team reviews all reports promptly.",
                    icon: "🚫",
                    color: "#F44336", // Red
                  },
                  {
                    question: "What kind of content can I share?",
                    answer:
                      "You can share photos, videos, stories, and updates. Just make sure to follow our community guidelines and respect others.",
                    icon: "📸",
                    color: "#E91E63", // Deep Pink
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 transition-all duration-300 hover:shadow-lg cursor-pointer border border-gray-700/50 hover:border-opacity-70"
                    style={{
                      "--hover-color": faq.color,
                      "--hover-border-color": faq.color,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ backgroundColor: faq.color }}
                    ></div>
                    <div className="relative z-10 flex flex-col items-start text-left">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{ backgroundColor: faq.color }}
                      >
                        <span className="text-3xl">{faq.icon}</span>
                      </div>
                      <h3
                        className="text-xl font-bold mb-4 text-gray-100 group-hover:text-opacity-100 transition-colors duration-300"
                        style={{ "--hover-text-color": faq.color }}
                      >
                        {faq.question}
                      </h3>
                      <p className="text-gray-300 text-sm">{faq.answer}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat"></div>
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center md:text-left">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#ca74d6] to-[#f59899]"
                >
                  Ready to Start Your Journey?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-xl mb-8 text-gray-300"
                >
                  Join thousands of users who are already part of our vibrant
                  community. Share your stories, connect with friends, and
                  discover new opportunities.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/home")}
                    className="bg-gradient-to-r from-[#bb6cbf] to-[#de8a8d] text-white font-bold py-3 px-7 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-500/20 cursor-pointer"
                  >
                    Get Started Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/home")}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-7 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-gray-500/20 cursor-pointer"
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </div>

              {/* Right Content - Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="grid grid-cols-2 gap-6"
              >
                {[
                  { number: "10K+", label: "Active Users", color: "#F299A9" }, // Pink
                  { number: "5K+", label: "Communities", color: "#4CAF50" }, // Green
                  { number: "50K+", label: "Posts Shared", color: "#2196F3" }, // Blue
                  { number: "24/7", label: "Support", color: "#9C27B0" }, // Purple
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer border border-gray-700/50 hover:border-opacity-70"
                  >
                    <div
                      className="text-3xl font-bold mb-2"
                      style={{ color: stat.color }}
                    >
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
        <aside>
          <img
            src="/yolo-logo.svg"
            alt="Yolo Logo"
            width="50"
            height="50"
            className="mb-2"
          />
          <p>
            Yolo Community
            <br />
            Connecting people since 2024
          </p>
        </aside>
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Community</a>
          <a className="link link-hover">Events</a>
          <a className="link link-hover">Groups</a>
          <a className="link link-hover">Chat</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
      <footer className="footer sm:footer-horizontal bg-base-200 text-base-content border-base-300 border-t px-10 py-4">
        <aside className="grid-flow-col items-center">
          <img
            src="/yolo-logo.svg"
            alt="Yolo Logo"
            width="24"
            height="24"
            className="mr-2"
          />
          <p>
            Copyright © {new Date().getFullYear()} - All rights reserved by Yolo
            Community
          </p>
        </aside>
        <nav className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default LandingPage;
