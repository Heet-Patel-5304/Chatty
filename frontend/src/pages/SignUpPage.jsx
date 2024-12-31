import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore"; 
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern"; 
import toast from "react-hot-toast"; 

const SignUpPage = () => {
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // Initializing state for form data
  const [formData, setFormData] = useState({ 
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore(); // Destructuring the signup function and isSigningUp loading state from the auth store

  // Form validation function
  const validateForm = () => {
    // Check if full name is empty
    if (!formData.fullName.trim()) return toast.error("Full name is required"); 
    // Check if email is empty
    if (!formData.email.trim()) return toast.error("Email is required"); 
    // Validate email format
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format"); 
    // Check if password is empty
    if (!formData.password) return toast.error("Password is required"); 
    // Check password length
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters"); 

    return true; // Return true if all fields are valid
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent submission behavior
    console.log("Form Data: ", formData); // Log the form data (for debugging)
    const success = validateForm(); // Validate the form

    // If validation passes, call the signup function with form data
    if (success === true) signup(formData); 
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side of the page */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo section */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" /> {/* Message icon */}
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" /> {/* User icon */}
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} // Update full name in state
                />
              </div>
            </div>

            {/* Email input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" /> {/* Mail icon */}
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Update email in state
                />
              </div>
            </div>

            {/* Password input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" /> {/* Lock icon */}
                </div>
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} // Update password in state
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)} // Toggle show/hide password
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" /> // Eye off icon
                  ) : (
                    <Eye className="size-5 text-base-content/40" /> // Eye icon
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" /> {/* Loader icon for loading state */}
                  Loading...
                </>
              ) : (
                "Create Account" // Default button text
              )}
            </button>
          </form>

          {/* Link to login page if user already has an account */}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side with background pattern */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;