import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Check, Upload, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isLogin
        ? `${import.meta.env.VITE_API_URL}/api/auth/login`
        : `${import.meta.env.VITE_API_URL}/api/auth/register`;

      console.log("Form Data Before Sending:", formData);

      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      console.log("Sending Request to:", url);
      console.log("Request Body:", body);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful! Redirecting...");
        navigate("/dashboard");
      } else {
        setIsLogin(true);
        setFormData({ email: "", username: "", password: "" });
        toast.success("Account created successfully! Please log in.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      toast.error(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster position="bottom-right" />

      <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-900">CADzilla</h2>
      </nav>

      <div className="flex flex-col lg:flex-row flex-grow">
        <motion.div
          className="flex-1 flex flex-col justify-center p-8 lg:p-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-4">
            <h1 className="text-4xl lg:text-6xl font-bold text-indigo-900 mb-4">
              Explore 3D Models Effortlessly
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Upload, visualize, and interact with 3D models seamlessly. Join
              our growing community of designers and creators today!
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Upload className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-gray-700">
                Easy one-click uploads of all major 3D file formats
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Eye className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-gray-700">
                Interactive real-time 3D previews in your browser
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Check className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-gray-700">
                Advanced rendering options with lighting control
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="hidden lg:block">
              <Button
                onClick={() => setIsLogin(!isLogin)}
                variant="outline"
                className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
              >
                {isLogin ? "Create an Account" : "Back to Login"}
              </Button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex-1 flex items-center justify-center p-8 lg:p-16"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="text-indigo-500 text-2xl font-bold text-center">
                {isLogin ? "Welcome Back" : "Register Now"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-8 px-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <Input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Choose a username"
                      className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
                  disabled={loading}
                >
                  {loading
                    ? "Loading..."
                    : isLogin
                    ? "Sign In"
                    : "Create Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
