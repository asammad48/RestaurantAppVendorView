import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { InsertCategory } from "@/types/schema";

const addCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  restaurantId: z.string().optional(),
});

type AddCategoryFormData = z.infer<typeof addCategorySchema>;

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId?: string;
  editCategory?: any; // Category type for edit mode
}

export default function AddCategoryModal({ isOpen, onClose, restaurantId, editCategory }: AddCategoryModalProps) {
  const isEditMode = !!editCategory;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AddCategoryFormData>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: editCategory?.name || "",
      restaurantId: restaurantId || "",
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category added successfully" });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error adding category",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddCategoryFormData) => {
    const categoryData: InsertCategory = {
      name: data.name,
      restaurantId: data.restaurantId || null,
      status: "active",
    };
    createCategoryMutation.mutate(categoryData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-add-category">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">{isEditMode ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter category name"
                data-testid="input-category-name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-2 rounded-lg"
              disabled={createCategoryMutation.isPending}
              data-testid="button-add-category"
            >
              {createCategoryMutation.isPending 
                ? (isEditMode ? "Updating..." : "Adding...") 
                : (isEditMode ? "Update Category" : "Add Category")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}