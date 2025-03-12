import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Upload,
  File,
  Eye,
  Download,
  CloudUpload,
  History,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [showHistoryMessage, setShowHistoryMessage] = useState(false);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch files");

      const files = await res.json();
      setUploadedFiles(files);
    } catch (error) {
      toast.error("Failed to load uploaded files");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const uploadFile = async (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const validExtensions = ["stl", "obj"];

    if (!validExtensions.includes(fileExtension)) {
      toast.error(`Unsupported file format: ${fileExtension}. Use STL or OBJ.`);
      return;
    }

    const formData = new FormData();
    formData.append("model", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/files/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const uploadedFile = await res.json();

      setUploadedFiles((prev) => [
        {
          name: uploadedFile.originalName,
          url: uploadedFile.url,
          id: uploadedFile.id,
          uploadedAt: new Date(uploadedFile.uploadDate).toLocaleTimeString(),
        },
        ...prev,
      ]);

      toast.success(`Uploaded ${uploadedFile.originalName} successfully!`);
      setShowHistoryMessage(true);
    } catch (error) {
      toast.error("Upload failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col p-4 justify-start transition-spacing duration-300">
        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="mb-8 shadow-lg border border-indigo-50 rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Upload className="w-6 h-6" />
                Upload New Model
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div
                className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-indigo-200"
                } rounded-xl py-12 transition-all duration-200`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
              >
                <CloudUpload
                  className="w-12 h-12 text-gray-600"
                  strokeWidth={1.5}
                />
                <div className="text-center">
                  <p className="text-lg font-semibold">Drag & Drop Files</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: .stl, .obj
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept=".stl,.obj"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button className="px-6 py-3 rounded-lg shadow-sm transition-transform hover:scale-105 cursor-pointer">
                    <Upload className="w-5 h-5 mr-2" /> Browse Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {showHistoryMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg border border-indigo-50 rounded-2xl">
                <CardContent className="p-6 flex flex-col items-center">
                  <History className="w-12 h-12 text-indigo-600 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Uploaded files can be previewed and downloaded
                  </h2>
                  <p className="text-gray-600 text-center mt-2">
                    Visit the <b>History</b> section to manage your uploads.
                  </p>
                  <Button
                    variant="default"
                    className="mt-4"
                    onClick={() => (window.location.href = "/history")}
                  >
                    Go to History
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
