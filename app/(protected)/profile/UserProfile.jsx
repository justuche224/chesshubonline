"use client";

import { useState, useRef, useTransition } from "react";
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
import { uploadImage } from "@/supabase/storage/client";
import { convertBlobUrlToFile } from "@/lib/utils";
import { toast } from "sonner";
import { uploadProfilePicture } from "@/actions/uploadProfilePicture";

const UserProfile = ({ user }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const imageInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const MAX_FILE_SIZE_MB = 2;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        return;
      }

      // Check file type (only images)
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleImageUpload = async () => {
    if (!imageUrl) return;

    startTransition(async () => {
      const imageFile = await convertBlobUrlToFile(imageUrl);

      const { imageUrl: uploadedUrl, error } = await uploadImage({
        file: imageFile,
        bucket: "chesshub",
      });

      if (error) {
        toast.error("Failed to upload image");
        console.error(error);
        return;
      }

      // Update user's profile picture
      try {
        const response = await uploadProfilePicture(uploadedUrl);

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success("Profile picture updated successfully");
        user.image = uploadedUrl;
        setImageUrl(null);
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
                src={imageUrl || user.image || "/images/user-placeholder.png"}
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
                    Upload a new profile picture.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    disabled={isPending}
                  />

                  <Button
                    variant="outline"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isPending}
                    className="w-full mb-4"
                  >
                    Select Image
                  </Button>

                  {imageUrl && (
                    <div className="mb-4 flex justify-center">
                      <Image
                        src={imageUrl}
                        width={300}
                        height={300}
                        alt="Selected image"
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <DrawerFooter>
                  <Button
                    onClick={handleImageUpload}
                    disabled={isPending || !imageUrl}
                  >
                    {isPending ? "Uploading..." : "Upload Image"}
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
