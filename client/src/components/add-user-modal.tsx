import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const userFormSchema = insertUserSchema.extend({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.string().min(1, "Role is required"),
  assignedBranch: z.string().min(1, "Assigned branch is required"),
  address: z.string().optional(),
  image: z.string().optional(),
  // These are required for user creation but will be generated
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser?: any;
}

const USER_ROLES = [
  { value: "manager", label: "Manager" },
  { value: "waiter", label: "Waiter" },
  { value: "chef", label: "Chef" },
];

const BRANCHES = [
  { value: "branch-1", label: "Main Branch" },
  { value: "branch-2", label: "Downtown Branch" },
  { value: "branch-3", label: "Mall Branch" },
];

export default function AddUserModal({ isOpen, onClose, editingUser }: AddUserModalProps) {
  const [imageFile, setImageFile] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!editingUser;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: isEditing
      ? {
          name: editingUser.name || "",
          phoneNumber: editingUser.phoneNumber || "",
          role: editingUser.role || "",
          assignedBranch: editingUser.assignedBranch || "",
          address: editingUser.address || "",
          image: editingUser.image || "",
          username: editingUser.username || "",
          email: editingUser.email || "",
          password: "existing-password",
        }
      : {
          name: "",
          phoneNumber: "",
          role: "",
          assignedBranch: "",
          address: "",
          image: "",
          username: "",
          email: "",
          password: "",
        },
  });

  const roleValue = watch("role");
  const branchValue = watch("assignedBranch");

  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      // Auto-generate username and email from name if not provided
      if (!data.username) {
        data.username = data.name.toLowerCase().replace(/\s+/g, '.');
      }
      if (!data.email) {
        data.email = `${data.username}@restaurant.com`;
      }
      if (!isEditing && !data.password) {
        data.password = "defaultPassword123";
      }

      const endpoint = isEditing ? `/api/users/${editingUser.id}` : "/api/users";
      const method = isEditing ? "PATCH" : "POST";
      
      return apiRequest(method, endpoint, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `User has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      reset();
      setImageFile("");
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} user.`,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setImageFile(base64);
          setValue("image", base64);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = (data: UserFormData) => {
    createUserMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto" data-testid="add-user-modal">
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 bg-white relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          data-testid="button-close-modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-center" data-testid="modal-title">
            {isEditing ? "Edit User" : "Add User"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                className="mt-1"
                data-testid="input-name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="mt-1"
                data-testid="input-email"
                disabled={isEditing}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                {...register("username")}
                className="mt-1"
                data-testid="input-username"
                disabled={isEditing}
              />
              {errors.username && (
                <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                className="mt-1"
                data-testid="input-phone"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <Select value={roleValue} onValueChange={(value) => setValue("role", value)}>
                <SelectTrigger className="mt-1" data-testid="select-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value} data-testid={`option-role-${role.value}`}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="assignedBranch" className="text-sm font-medium">
                Assigned Branch
              </Label>
              <Select value={branchValue} onValueChange={(value) => setValue("assignedBranch", value)}>
                <SelectTrigger className="mt-1" data-testid="select-branch">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {BRANCHES.map((branch) => (
                    <SelectItem key={branch.value} value={branch.value} data-testid={`option-branch-${branch.value}`}>
                      {branch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignedBranch && (
                <p className="text-sm text-red-600 mt-1">{errors.assignedBranch.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-sm font-medium">
              Address
            </Label>
            <Textarea
              id="address"
              {...register("address")}
              className="mt-1 min-h-[80px]"
              data-testid="textarea-address"
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="image" className="text-sm font-medium">
              Image
            </Label>
            <div className="mt-1 flex items-center space-x-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                data-testid="input-image"
              />
              <Label
                htmlFor="image"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md cursor-pointer text-sm text-gray-500 hover:border-gray-400"
                data-testid="label-choose-file"
              >
                {imageFile || editingUser?.image ? "Image selected" : "Choose File"}
              </Label>
              <Button
                type="button"
                variant="outline"
                className="bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500"
                onClick={() => document.getElementById("image")?.click()}
                data-testid="button-browse"
              >
                Browse
              </Button>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-24 bg-emerald-500 hover:bg-emerald-600 text-white"
              data-testid="button-add-user"
            >
              {isSubmitting ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update" : "Add")}
            </Button>
          </div>
        </form>
        </Card>
      </div>
    </div>
  );
}