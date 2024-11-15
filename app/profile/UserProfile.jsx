"use client";

import { useState } from "react";
import { Camera, Mail, Calendar, User, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { uploadProfilePicture } from "@/actions/uploadProfilePicture"; // Import the server action
import { toast } from "sonner";

const UserProfile = ({ user }) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleImageUpload = (imageUrl) => {
    setUploadedImageUrl(imageUrl);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await uploadProfilePicture(uploadedImageUrl);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success("Profile picture updated successfully");
      // Optionally, you can update the UI immediately
      user.image = uploadedImageUrl;
      setUploadedImageUrl(""); // Reset the uploaded image URL
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="bg-sidebar shadow-lg">
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold">
                {user.firstname} {user.lastname}
              </CardTitle>
              <p className="text-gray-500">@{user.username}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  user.role === "USER"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Profile Image Section */}
          <div className="relative w-32 h-32 mx-auto mt-4 mb-6">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                width={128}
                height={128}
                src={
                  uploadedImageUrl ||
                  user.image ||
                  "/images/user-placeholder.png"
                }
                alt={`${user.firstname}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            <Drawer>
              <DrawerTrigger>
                <div className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="w-5 h-5 text-gray-600" />
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Update Profile Picture</DrawerTitle>
                  <DrawerDescription>
                    Upload a new profile picture. Click submit once you&apos;ve
                    selected an image.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        handleImageUpload(res[0].url);
                      }
                    }}
                    onUploadError={(error) => {
                      toast.error(`Upload Error! ${error.message}`);
                    }}
                  />
                </div>
                <DrawerFooter>
                  <Button
                    onClick={handleSubmit}
                    disabled={!uploadedImageUrl || isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Submit"}
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{user.gender}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                  {user.emailVerified && (
                    <span className="text-xs text-green-600">Verified</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Game Statistics */}
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Games Played</p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">
                        {user.gamesAsWhitePlayer.length}
                      </span>
                      <span className="text-gray-500"> as White</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">
                        {user.gamesAsBlackPlayer.length}
                      </span>
                      <span className="text-gray-500"> as Black</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">
                        {user.gamesWithAi.length}
                      </span>
                      <span className="text-gray-500"> vs AI</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
