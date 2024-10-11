// Login.jsx
import React, { useState } from "react";
import { supabase } from "./supabase";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card"; // Adjust the import path as necessary
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Icons for show/hide password

const Login = ({ setRole, setIsAuthenticated, setUserId }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"
  const [errors, setErrors] = useState({ username: "", password: "" }); // Separate error states
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submission/loading
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({ username: "", password: "" }); // Reset errors

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (error || !data || data.password !== password) {
        setErrors({ username: "Invalid username or password.", password: "" });
        setIsSubmitting(false);
        return;
      }

      // Set the user's role, ID, and authentication status
      setRole(data.role);
      setUserId(data.id);
      setIsAuthenticated(true);

      // Persist role and userId in localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id);
      }

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setErrors({ username: "An unexpected error occurred.", password: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 t px-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg bg-white">
        <CardHeader className="text-center">
          {/* Optional: Add a logo or app name here */}
          <CardTitle className="text-3xl font-bold text-black">White Bill</CardTitle>
          <p className="mt-2 text-gray-600">Welcome! Please login to your account.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Field */}
            <div>
              <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm `}
                aria-invalid={errors.username ? "true" : "false"}
                aria-describedby="username-error"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500" id="username-error">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm `}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500" id="password-error">
                  {errors.password}
                </p>
              )}
            </div>


            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium "
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>

      </Card>
    </div>
  );
};

export default Login;
