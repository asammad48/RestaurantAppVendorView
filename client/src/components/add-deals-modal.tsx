import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { insertDealSchema, type InsertDeal, type SimpleMenuItem, type DealMenuItem } from "@/types/schema";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { menuItemApi, dealsApi } from "@/lib/apiRepository";
import { useToast } from "@/hooks/use-toast";

interface AddDealsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId?: string;
  branchId?: number;
  editDeal?: any;
}

interface DealItem {
  menuItemId: number;
  menuItemName: string;
  quantity: number;
}

export default function AddDealsModal({ open, onOpenChange, restaurantId, branchId = 3, editDeal }: AddDealsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedItems, setSelectedItems] = useState<DealItem[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: menuItems = [], isLoading: menuItemsLoading } = useQuery({
    queryKey: ['menu-items-simple', branchId],
    queryFn: async (): Promise<SimpleMenuItem[]> => {
      const response = await menuItemApi.getSimpleMenuItemsByBranch(branchId);
      if (response.error) {
        throw new Error(response.error);
      }
      return (response.data as SimpleMenuItem[]) || [];
    },
    enabled: open && !!branchId,
  });

  const form = useForm<InsertDeal>({
    resolver: zodResolver(insertDealSchema),
    defaultValues: {
      branchId: branchId,
      name: editDeal?.name || "",
      description: editDeal?.description || "",
      price: editDeal?.price || 0,
      packagePicture: editDeal?.packagePicture || "",
      expiryDate: editDeal?.expiryDate || "",
      menuItems: editDeal?.menuItems || [],
    },
  });

  const createDealMutation = useMutation({
    mutationFn: async (data: InsertDeal) => {
      console.log('Mutation function called with:', data);
      try {
        const response = await dealsApi.createDeal(data);
        console.log('API response:', response);
        if (response.error) {
          console.error('API error:', response.error);
          throw new Error(response.error);
        }
        return response.data;
      } catch (error) {
        console.error('Mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: "Success",
        description: editDeal ? "Deal updated successfully" : "Deal created successfully",
      });
      form.reset();
      setSelectedFile(null);
      setSelectedItems([]);
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save deal",
        variant: "destructive",
      });
    },
  });

  const handleItemToggle = (item: SimpleMenuItem) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.menuItemId === item.menuItemId);
      let newItems;
      if (exists) {
        newItems = prev.filter(i => i.menuItemId !== item.menuItemId);
      } else {
        newItems = [...prev, { menuItemId: item.menuItemId, menuItemName: item.menuItemName, quantity: 1 }];
      }
      
      // Update form's menuItems field
      const formMenuItems = newItems.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity }));
      form.setValue('menuItems', formMenuItems);
      
      return newItems;
    });
  };

  const handleQuantityChange = (menuItemId: number, quantity: number) => {
    setSelectedItems(prev => {
      const newItems = prev.map(item => 
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      );
      
      // Update form's menuItems field
      const formMenuItems = newItems.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity }));
      form.setValue('menuItems', formMenuItems);
      
      return newItems;
    });
  };

  const onSubmit = (data: InsertDeal) => {
    console.log('Form submitted with data:', data);
    console.log('Selected items:', selectedItems);
    console.log('Form errors:', form.formState.errors);

    const dealData = {
      ...data,
      // menuItems is already in the form data from handleItemToggle/handleQuantityChange
      // Convert price to cents if needed (API expects price in cents)
      price: Math.round(data.price * 100),
      packagePicture: selectedFile ? "base64/image" : "",
      expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : undefined,
    };

    console.log('Sending deal data to API:', dealData);
    createDealMutation.mutate(dealData);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("packagePicture", `deal_${file.name}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-6 bg-white rounded-lg max-h-[85vh] overflow-y-auto">
        <DialogTitle className="text-xl font-semibold text-gray-900 mb-6">
          {editDeal ? 'Edit Deal' : 'Add Deal'}
        </DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Deal Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter deal name"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter deal description"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Select Items for Deal
              </Label>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-4 space-y-3">
                {menuItemsLoading ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Loading menu items...</p>
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No menu items available</p>
                  </div>
                ) : (
                  menuItems.map((item) => (
                    <div key={item.menuItemId} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedItems.some(i => i.menuItemId === item.menuItemId)}
                          onCheckedChange={() => handleItemToggle(item)}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.menuItemName}</p>
                          <p className="text-sm text-gray-500">Menu Item ID: {item.menuItemId}</p>
                          {selectedItems.some(i => i.menuItemId === item.menuItemId) && (
                            <p className="text-sm text-blue-600 font-medium">
                              Quantity: {selectedItems.find(i => i.menuItemId === item.menuItemId)?.quantity || 1}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {selectedItems.some(i => i.menuItemId === item.menuItemId) && (
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">Qty:</Label>
                          <Input
                            type="number"
                            min="1"
                            value={selectedItems.find(i => i.menuItemId === item.menuItemId)?.quantity || 1}
                            onChange={(e) => handleQuantityChange(item.menuItemId, parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Deal Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value ? field.value.toString() : ""}
                        placeholder="0.00"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Expiry Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                        onChange={(e) => field.onChange(e.target.value || "")}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <div>
              <Label className="text-sm font-medium text-gray-700">Deal Image</Label>
              <div className="flex mt-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="deal-image-upload"
                />
                <div className="flex w-full">
                  <Input
                    value={selectedFile ? selectedFile.name : "Choose File"}
                    readOnly
                    className="flex-1 bg-gray-50"
                    placeholder="Choose File"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('deal-image-upload')?.click()}
                    className="ml-2 bg-green-500 hover:bg-green-600 text-white px-4"
                  >
                    Browse
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={createDealMutation.isPending || selectedItems.length === 0}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md"
              >
                {createDealMutation.isPending ? (editDeal ? "Updating..." : "Creating...") : (editDeal ? "Update Deal" : "Create Deal")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}