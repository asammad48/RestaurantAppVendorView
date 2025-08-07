import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertBranchSchema, type InsertBranch } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddBranchModalProps {
  open: boolean;
  onClose: () => void;
  entityId: string;
}

export default function AddBranchModal({ open, onClose, entityId }: AddBranchModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<InsertBranch>({
    resolver: zodResolver(insertBranchSchema),
    defaultValues: {
      name: "",
      restaurantType: "",
      contactNo: "",
      address: "",
      restaurantLogo: "",
      instagram: "",
      whatsapp: "",
      facebook: "",
      googleMap: "",
      restaurantId: entityId,
      status: "active",
    },
  });

  const createBranchMutation = useMutation({
    mutationFn: async (data: InsertBranch) => {
      return await apiRequest("POST", "/api/branches", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/branches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/branches", entityId] });
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] });
      toast({
        title: "Success",
        description: "Branch added successfully",
      });
      form.reset();
      setSelectedFile(null);
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add branch",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBranch) => {
    createBranchMutation.mutate(data);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // For demo purposes, we'll just set a placeholder URL
      form.setValue("restaurantLogo", `logo_${file.name}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-xl font-semibold">Add Branch</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 p-0 h-6 w-6"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter branch name"
                      className="w-full"
                      data-testid="input-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="restaurantType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">
                      Restaurant Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-restaurant-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fast-food">Fast Food</SelectItem>
                        <SelectItem value="casual-dining">Casual Dining</SelectItem>
                        <SelectItem value="fine-dining">Fine Dining</SelectItem>
                        <SelectItem value="cafe">Cafe</SelectItem>
                        <SelectItem value="buffet">Buffet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">
                      Contact No
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter contact number"
                        className="w-full"
                        data-testid="input-contact"
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
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter branch address"
                      className="w-full"
                      data-testid="input-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white">Restaurant Logo</Label>
              <div className="flex mt-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="logo-upload"
                  data-testid="input-logo-file"
                />
                <div className="flex w-full">
                  <Input
                    value={selectedFile ? selectedFile.name : "Choose File"}
                    readOnly
                    className="flex-1 bg-gray-50"
                    placeholder="Choose File"
                    data-testid="input-logo-display"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4"
                    data-testid="button-browse-logo"
                  >
                    Browse
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">
                Attach Social Media
              </Label>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Instagram"
                          className="w-full"
                          data-testid="input-instagram"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Whatsapp"
                          className="w-full"
                          data-testid="input-whatsapp"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Facebook"
                          className="w-full"
                          data-testid="input-facebook"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="googleMap"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Google Map"
                          className="w-full"
                          data-testid="input-google-map"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={createBranchMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md"
                data-testid="button-next"
              >
                {createBranchMutation.isPending ? "Adding..." : "Next"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}