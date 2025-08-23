import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertDiscountSchema, type InsertDiscount, type Discount } from "@/types/schema";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { discountsApi } from "@/lib/apiRepository";
import { useToast } from "@/hooks/use-toast";

interface AddDiscountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchId?: number;
  editDiscountId?: number;
}

export default function AddDiscountModal({ 
  open, 
  onOpenChange, 
  branchId = 3, 
  editDiscountId 
}: AddDiscountModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch discount data when editing
  const { data: discountData, isLoading: isDiscountLoading } = useQuery({
    queryKey: ['discount', editDiscountId],
    queryFn: async (): Promise<Discount> => {
      if (!editDiscountId) throw new Error('Discount ID is required');
      const response = await discountsApi.getDiscountById(editDiscountId);
      return response;
    },
    enabled: open && !!editDiscountId,
  });

  const isEditMode = !!editDiscountId;

  const form = useForm<InsertDiscount>({
    resolver: zodResolver(insertDiscountSchema),
    defaultValues: {
      name: "",
      discountType: "Flat",
      discountValue: 0,
      maxDiscountAmount: 0,
      startDate: "",
      endDate: "",
    },
  });

  // Reset form when opening/closing modal or when discount data changes
  useEffect(() => {
    if (isEditMode && discountData && !isDiscountLoading) {
      // Populate form with API data
      form.reset({
        name: discountData.name || "",
        discountType: discountData.discountType || "Flat",
        discountValue: discountData.discountValue || 0,
        maxDiscountAmount: discountData.maxDiscountAmount || 0,
        startDate: discountData.startDate ? discountData.startDate.split('T')[0] : "", // Format date for input
        endDate: discountData.endDate ? discountData.endDate.split('T')[0] : "", // Format date for input
      });
    } else if (!isEditMode) {
      // Reset form for new discount
      form.reset({
        name: "",
        discountType: "Flat",
        discountValue: 0,
        maxDiscountAmount: 0,
        startDate: "",
        endDate: "",
      });
    }
  }, [isEditMode, discountData, isDiscountLoading, form]);

  const createDiscountMutation = useMutation({
    mutationFn: async (data: InsertDiscount) => {
      if (isEditMode && editDiscountId) {
        // Update existing discount
        const discountData = {
          name: data.name,
          discountType: data.discountType,
          discountValue: data.discountValue,
          maxDiscountAmount: data.maxDiscountAmount,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          isActive: true,
        };
        const response = await discountsApi.updateDiscount(editDiscountId, discountData);
        return response;
      } else {
        // Create new discount
        const discountData = {
          name: data.name,
          discountType: data.discountType,
          discountValue: data.discountValue,
          maxDiscountAmount: data.maxDiscountAmount,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          isActive: true,
          branchId: branchId,
        };
        const response = await discountsApi.createDiscount(discountData);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      queryClient.invalidateQueries({ queryKey: ['discounts-branch-3'] });
      toast({
        title: "Success",
        description: isEditMode ? "Discount updated successfully" : "Discount created successfully",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save discount",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertDiscount) => {
    createDiscountMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Discount" : "Add New Discount"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
            data-testid="button-close-modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Discount Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter discount name"
                      className="w-full"
                      data-testid="input-discount-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Discount Type *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-discount-type">
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Flat">Flat</SelectItem>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Discount Value *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter discount value"
                      className="w-full"
                      data-testid="input-discount-value"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxDiscountAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Max Discount Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter max discount amount"
                      className="w-full"
                      data-testid="input-max-discount-amount"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Start Date *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="w-full"
                        data-testid="input-start-date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      End Date *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="w-full"
                        data-testid="input-end-date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={createDiscountMutation.isPending}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md"
                data-testid="button-save-discount"
              >
                {createDiscountMutation.isPending ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Discount" : "Create Discount")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}