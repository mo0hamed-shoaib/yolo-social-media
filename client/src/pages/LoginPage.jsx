import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoginBgImage from '../assets/login-bg.png'; // Import the image
import PageTransition from '../components/PageTransition';
import { loginSchema } from '../validations/authSchema';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // Use login from AuthContext
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with:', formData);
      console.log('API URL:', `${import.meta.env.VITE_API_URL}/api/auth/login`);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData);
      console.log('Login response:', response.data);

      if (response.data.success) {
        // Use login function from AuthContext
        login(response.data.token, response.data.user);
        
        toast.success('Successfully logged in!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      const errorMessage = error.response?.data?.message || 'Login failed';
      const errorDetails = error.response?.data?.details || [];
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      if (errorDetails.length > 0) {
        toast.error(
          <div>
            <p className="font-bold mb-2">Please fix the following issues:</p>
            <ul className="list-disc list-inside">
              {errorDetails.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>,
          {
            position: "top-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
      }
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="flex w-full max-w-4xl bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {/* Left Section - Form */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center text-white">
            <div className="flex items-center mb-10">
              <img src="/yolo-logo.svg" alt="Yolo Logo" className="w-10 h-10 mr-2" />
              <span className="text-2xl font-bold text-[#F299A9]">Yolo</span>
            </div>
            <h2 className="text-4xl font-bold mb-8">WELCOME BACK</h2>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
                <div className="form-control mb-5">
                  <label className="label">
                    <span className="label-text text-lg text-white">Email</span>
                  </label>
                  <label className={`input input-bordered flex items-center gap-2 w-full bg-gray-700 border-gray-600 text-white focus-within:border-[#D984BB] ${errors.email ? 'border-red-500' : ''}`}>
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </g>
                    </svg>
                    <input 
                      type="email" 
                      {...register('email')}
                      placeholder="Enter your email" 
                      className="grow"
                      disabled={isLoading}
                    />
                    {isLoading && (
                      <div className="loading loading-spinner loading-sm"></div>
                    )}
                  </label>
                  {errors.email && (
                    <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
                  )}
                </div>
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text text-lg text-white">Password</span>
                  </label>
                  <PasswordInput 
                    name="password"
                    placeholder="Enter your password"
                    isLoading={isLoading}
                  />
                </div>
                <div className="flex justify-between items-center text-sm mb-8">
                  <div className="flex items-center">
                    <input type="checkbox" id="remember-me" className="checkbox mr-2 checked:bg-[#D984BB] checked:border-[#D984BB]" disabled={isLoading} />
                    <label htmlFor="remember-me">Remember me</label>
                  </div>
                  <a href="#" className="link link-hover text-[#D984BB]">Forgot Password</a>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn w-full text-black font-bold mb-4 bg-[#D984BB] hover:bg-[#D782D9] disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="loading loading-spinner loading-sm"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/register')}
                  className="btn btn-outline w-full font-bold border-[#D782D9] text-[#D782D9] hover:bg-[#D782D9] hover:text-black"
                  disabled={isLoading}
                >
                  Register
                </button>
              </form>
            </FormProvider>
            <div className="mt-auto pt-10 text-xs text-gray-400">
              Copyright @ 2025 Jimmy - ITI
            </div>
          </div>
          {/* Right Section - Image */}
          <div 
            className="hidden lg:block lg:w-1/2 bg-cover bg-center rounded-r-lg"
            style={{ backgroundImage: `url(${LoginBgImage})` }}
          >
            {/* Image is set as background-image in style prop */}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage; 