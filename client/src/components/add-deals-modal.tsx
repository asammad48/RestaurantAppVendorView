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
import { insertDealSchema, type InsertDeal, type MenuItem } from "@shared/schema";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddDealsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId?: string;
}

interface DealItem {
  itemId: string;
  name: string;
  quantity: number;
}

export default function AddDealsModal({ open, onOpenChange, restaurantId }: AddDealsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedItems, setSelectedItems] = useState<DealItem[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    enabled: open,
  });

  const form = useForm<InsertDeal>({
    resolver: zodResolver(insertDealSchema),
    defaultValues: {
      name: "",
      items: [],
      dealPrice: 0,
      image: "",
      expiryTime: undefined,
      restaurantId: restaurantId || undefined,
      status: "active",
    },
  });

  const createDealMutation = useMutation({
    mutationFn: async (data: InsertDeal) => {
      return await apiRequest("POST", "/api/deals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      toast({
        title: "Success",
        description: "Deal added successfully",
      });
      form.reset();
      setSelectedFile(null);
      setSelectedItems([]);
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add deal",
        variant: "destructive",
      });
    },
  });

  const handleItemToggle = (item: MenuItem) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.itemId === item.id);
      if (exists) {
        return prev.filter(i => i.itemId !== item.id);
      } else {
        return [...prev, { itemId: item.id, name: item.name, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setSelectedItems(prev => 
      prev.map(item => 
        item.itemId === itemId ? { ...item, quantity } : item
      )
    );
  };

  const onSubmit = (data: InsertDeal) => {
    const itemsData = selectedItems.map(item => JSON.stringify(item));
    createDealMutation.mutate({
      ...data,
      items: itemsData,
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("image", `deal_${file.name}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-6 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add Deal
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

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

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Select Items for Deal
              </Label>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-4 space-y-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedItems.some(i => i.itemId === item.id)}
                        onCheckedChange={() => handleItemToggle(item)}
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">${(item.price / 100).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {selectedItems.some(i => i.itemId === item.id) && (
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">Qty:</Label>
                        <Input
                          type="number"
                          min="1"
                          value={selectedItems.find(i => i.itemId === item.id)?.quantity || 1}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dealPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Deal Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Math.round(parseFloat(e.target.value) * 100))}
                        value={field.value ? (field.value / 100).toFixed(2) : ""}
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
                name="expiryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Expiry Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {createDealMutation.isPending ? "Adding..." : "Add Deal"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}