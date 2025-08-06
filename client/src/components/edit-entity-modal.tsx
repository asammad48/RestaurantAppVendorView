import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X } from "lucide-react";
import { insertEntitySchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Entity } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const formSchema = insertEntitySchema.extend({
  profilePicture: z.string().min(1, "Profile picture is required"),
  certificateUrl: z.string().url("Please enter a valid certificate URL").optional().or(z.literal("")),
  certificatePicture: z.string().min(1, "Certificate picture is required").optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

interface EditEntityModalProps {
  entity: Entity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditEntityModal({ entity, open, onOpenChange }: EditEntityModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("");
  const [certificatePicturePreview, setCertificatePicturePreview] = useState<string>("");
  const profileFileRef = useRef<HTMLInputElement>(null);
  const certificateFileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      certificateUrl: "",
      certificatePicture: "",
      profilePicture: "",
      entityType: "restaurant",
      status: "active",
    },
  });

  // Update form values when entity changes
  useEffect(() => {
    if (entity) {
      form.reset({
        name: entity.name,
        phone: entity.phone,
        address: entity.address,
        certificateUrl: entity.certificateUrl || "",
        certificatePicture: entity.certificatePicture || "",
        profilePicture: entity.profilePicture,
        entityType: entity.entityType as "hotel" | "restaurant",
        status: entity.status as "active" | "inactive",
      });
      setProfilePicturePreview(entity.profilePicture);
      setCertificatePicturePreview(entity.certificatePicture || "");
    }
  }, [entity, form]);

  const handleFileUpload = (file: File, type: 'profile' | 'certificate') => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file only",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      if (type === 'profile') {
        setProfilePicturePreview(base64String);
        form.setValue('profilePicture', base64String);
      } else {
        setCertificatePicturePreview(base64String);
        form.setValue('certificatePicture', base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (type: 'profile' | 'certificate') => {
    if (type === 'profile') {
      setProfilePicturePreview("");
      form.setValue('profilePicture', "");
      if (profileFileRef.current) {
        profileFileRef.current.value = "";
      }
    } else {
      setCertificatePicturePreview("");
      form.setValue('certificatePicture', "");
      if (certificateFileRef.current) {
        certificateFileRef.current.value = "";
      }
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: Partial<FormData>) => apiRequest("PUT", `/api/entities/${entity.id}`, {
      ...data,
      certificateUrl: data.certificateUrl || null,
      certificatePicture: data.certificatePicture || null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entities"] });
      toast({
        title: "Success",
        description: "Entity updated successfully",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update entity",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Exclude name and entityType from updates as they are read-only
      const { name, entityType, ...updateData } = data;
      await updateMutation.mutateAsync(updateData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Entity</DialogTitle>
          <DialogDescription>
            Update entity information. Name and entity type cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity Name (Read-only)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled
                        className="bg-gray-100 dark:bg-gray-800"
                        data-testid="input-edit-entity-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+1234567890" 
                        {...field} 
                        data-testid="input-edit-entity-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter full address" 
                      {...field}
                      rows={3}
                      data-testid="input-edit-entity-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Type (Read-only)</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      disabled
                      className="flex gap-6"
                      data-testid="radio-edit-entity-type"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="restaurant" id="edit-restaurant" disabled />
                        <Label htmlFor="edit-restaurant" className="opacity-50">Restaurant</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hotel" id="edit-hotel" disabled />
                        <Label htmlFor="edit-hotel" className="opacity-50">Hotel</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Profile Picture *</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {profilePicturePreview ? (
                        <div className="relative">
                          <img
                            src={profilePicturePreview}
                            alt="Profile preview"
                            className="w-full h-40 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemoveFile('profile')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                          onClick={() => profileFileRef.current?.click()}
                        >
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload profile picture
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                      <input
                        ref={profileFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'profile');
                        }}
                        data-testid="input-edit-profile-picture"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="certificateUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/certificate.pdf" 
                        {...field} 
                        data-testid="input-edit-certificate-url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificatePicture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Picture (Optional)</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {certificatePicturePreview ? (
                          <div className="relative">
                            <img
                              src={certificatePicturePreview}
                              alt="Certificate preview"
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => handleRemoveFile('certificate')}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={() => certificateFileRef.current?.click()}
                          >
                            <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                              Click to upload certificate picture
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        )}
                        <input
                          ref={certificateFileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'certificate');
                          }}
                          data-testid="input-edit-certificate-picture"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                data-testid="button-submit-edit"
              >
                {isLoading ? "Updating..." : "Update Entity"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}