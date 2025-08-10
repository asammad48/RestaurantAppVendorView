import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from "@shared/schema";

const applyDiscountSchema = z.object({
  selectedItems: z.array(z.string()).min(1, "Please select at least one item"),
  discountPercentage: z.number().min(1, "Discount must be at least 1%").max(100, "Discount cannot exceed 100%"),
});

type ApplyDiscountFormData = z.infer<typeof applyDiscountSchema>;

interface ApplyDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyDiscountModal({ isOpen, onClose }: ApplyDiscountModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Query for menu items to select from
  const { data: menuItems = [], isLoading: isLoadingMenu } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    queryFn: () => fetch("/api/menu-items").then(res => res.json()),
  });

  const form = useForm<ApplyDiscountFormData>({
    resolver: zodResolver(applyDiscountSchema),
    defaultValues: {
      selectedItems: [],
      discountPercentage: 10,
    },
  });

  const applyDiscountMutation = useMutation({
    mutationFn: async (data: ApplyDiscountFormData) => {
      // This would typically call an API to apply discounts
      // For now, we'll just simulate the process
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({ title: "Discount applied successfully" });
      onClose();
      form.reset();
      setSelectedItems([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error applying discount",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleItemSelect = (itemId: string) => {
    const newSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    
    setSelectedItems(newSelectedItems);
    form.setValue("selectedItems", newSelectedItems);
  };

  const handleSelectAll = () => {
    const allItemIds = menuItems.map(item => item.id);
    const allSelected = allItemIds.length > 0 && allItemIds.every(id => selectedItems.includes(id));
    
    const newSelectedItems = allSelected ? [] : allItemIds;
    setSelectedItems(newSelectedItems);
    form.setValue("selectedItems", newSelectedItems);
  };

  const onSubmit = (data: ApplyDiscountFormData) => {
    const formData = {
      ...data,
      selectedItems,
    };
    applyDiscountMutation.mutate(formData);
  };

  const formatPrice = (priceInCents: number) => {
    return `Rs${(priceInCents / 100).toFixed(0)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" data-testid="modal-apply-discount">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">Apply Discount</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-8 px-3 text-xs"
                  data-testid="button-select-all"
                >
                  {menuItems.length > 0 && menuItems.every(item => selectedItems.includes(item.id)) ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="border rounded-lg max-h-64 overflow-y-auto" data-testid="items-selection-area">
                {isLoadingMenu ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading menu items...
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No menu items available
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedItems.includes(item.id)
                            ? "bg-green-50 border-green-200"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => handleItemSelect(item.id)}
                        data-testid={`item-option-${item.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.category}</div>
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            {formatPrice(item.price)}
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleItemSelect(item.id)}
                            className="ml-3 rounded border-gray-300"
                            data-testid={`checkbox-item-${item.id}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {form.formState.errors.selectedItems && (
                <p className="text-sm text-red-500">{form.formState.errors.selectedItems.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Discount Percentage</Label>
              <div className="relative">
                <Input
                  id="discountPercentage"
                  type="number"
                  min="1"
                  max="100"
                  {...form.register("discountPercentage", { valueAsNumber: true })}
                  className="pr-8"
                  data-testid="input-discount-percentage"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  %
                </div>
              </div>
              {form.formState.errors.discountPercentage && (
                <p className="text-sm text-red-500">{form.formState.errors.discountPercentage.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-2 rounded-lg"
              disabled={applyDiscountMutation.isPending || selectedItems.length === 0}
              data-testid="button-apply-discount"
            >
              {applyDiscountMutation.isPending ? "Applying..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}