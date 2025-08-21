import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertMenuItem } from "@/types/schema";

const addMenuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  preparationTime: z.number().min(1, "Preparation time must be at least 1 minute"),
  restaurantId: z.string().optional(),
});

type AddMenuFormData = z.infer<typeof addMenuSchema>;

interface AddOn {
  name: string;
  price: number;
}

interface Customization {
  name: string;
  options: string[];
}

interface Variant {
  option: string;
  price: number;
}

interface AddMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId?: string;
  editMenuItem?: any; // MenuItem type for edit mode
}

export default function AddMenuModal({ isOpen, onClose, restaurantId, editMenuItem }: AddMenuModalProps) {
  const isEditMode = !!editMenuItem;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<string>("");
  const [addOns, setAddOns] = useState<AddOn[]>([{ name: "", price: 0 }]);
  const [customizations, setCustomizations] = useState<Customization[]>([{ name: "", options: [""] }]);
  const [variants, setVariants] = useState<Variant[]>([{ option: "", price: 0 }]);
  
  // Section visibility states
  const [showAddOns, setShowAddOns] = useState<boolean>(true);
  const [showCustomizations, setShowCustomizations] = useState<boolean>(true);

  const form = useForm<AddMenuFormData>({
    resolver: zodResolver(addMenuSchema),
    defaultValues: {
      name: editMenuItem?.name || "",
      category: editMenuItem?.category || "",
      description: editMenuItem?.description || "",
      preparationTime: editMenuItem?.preparationTime || 15,
      restaurantId: restaurantId || "",
    },
  });

  const createMenuItemMutation = useMutation({
    mutationFn: async (data: InsertMenuItem) => {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to create menu item");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({ title: "Menu item added successfully" });
      onClose();
      form.reset();
      setAddOns([{ name: "", price: 0 }]);
      setCustomizations([{ name: "", options: [""] }]);
      setVariants([{ option: "", price: 0 }]);
      setImage("");
      setShowAddOns(true);
      setShowCustomizations(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error adding menu item",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAddOn = () => {
    setAddOns([...addOns, { name: "", price: 0 }]);
  };

  const updateAddOn = (index: number, field: keyof AddOn, value: string | number) => {
    const newAddOns = [...addOns];
    newAddOns[index] = { ...newAddOns[index], [field]: value };
    setAddOns(newAddOns);
  };

  const addCustomization = () => {
    setCustomizations([...customizations, { name: "", options: [""] }]);
  };

  const updateCustomization = (index: number, field: keyof Customization, value: string | string[]) => {
    const newCustomizations = [...customizations];
    newCustomizations[index] = { ...newCustomizations[index], [field]: value };
    setCustomizations(newCustomizations);
  };

  const addCustomizationOption = (custIndex: number) => {
    const newCustomizations = [...customizations];
    newCustomizations[custIndex].options.push("");
    setCustomizations(newCustomizations);
  };

  const updateCustomizationOption = (custIndex: number, optIndex: number, value: string) => {
    const newCustomizations = [...customizations];
    newCustomizations[custIndex].options[optIndex] = value;
    setCustomizations(newCustomizations);
  };

  const addVariant = () => {
    setVariants([...variants, { option: "", price: 0 }]);
  };

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  // Remove functions for each section
  const removeAddOn = (index: number) => {
    if (addOns.length > 1) {
      setAddOns(addOns.filter((_, i) => i !== index));
    }
  };

  const removeCustomization = (index: number) => {
    if (customizations.length > 1) {
      setCustomizations(customizations.filter((_, i) => i !== index));
    }
  };

  const removeCustomizationOption = (custIndex: number, optIndex: number) => {
    const newCustomizations = [...customizations];
    if (newCustomizations[custIndex].options.length > 1) {
      newCustomizations[custIndex].options = newCustomizations[custIndex].options.filter((_, i) => i !== optIndex);
      setCustomizations(newCustomizations);
    }
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  // Section removal functions
  const removeEntireAddOnSection = () => {
    setShowAddOns(false);
    setAddOns([{ name: "", price: 0 }]); // Reset to default
  };

  const removeEntireCustomizationSection = () => {
    setShowCustomizations(false);
    setCustomizations([{ name: "", options: [""] }]); // Reset to default
  };

  // Functions to restore sections
  const addAddOnSection = () => {
    setShowAddOns(true);
  };

  const addCustomizationSection = () => {
    setShowCustomizations(true);
  };

  const onSubmit = (data: AddMenuFormData) => {
    // Calculate base price from the first variant, or default to 0 if no variants
    const basePrice = variants.length > 0 && variants[0].price > 0 ? variants[0].price : 0;
    
    const menuItemData: InsertMenuItem = {
      ...data,
      price: Math.round(basePrice * 100), // Convert to cents, use base price from variants
      image: image || undefined,
      addOns: showAddOns 
        ? addOns
          .filter(addon => addon.name.trim())
          .map(addon => JSON.stringify({ name: addon.name, price: addon.price }))
        : [],
      customizations: showCustomizations
        ? customizations
          .filter(cust => cust.name.trim() && cust.options.some(opt => opt.trim()))
          .map(cust => JSON.stringify({ 
            name: cust.name, 
            options: cust.options.filter(opt => opt.trim()) 
          }))
        : [],
      variants: variants
        .filter(variant => variant.option.trim())
        .map(variant => JSON.stringify({ option: variant.option, price: variant.price })),
      status: "active",
    };

    createMenuItemMutation.mutate(menuItemData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" data-testid="modal-add-menu">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{isEditMode ? 'Edit Menu Item' : 'Add Menu'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter menu item name"
                data-testid="input-menu-name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => form.setValue("category", value)} data-testid="select-category">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fast Food">Fast Food</SelectItem>
                  <SelectItem value="Cuisine">Cuisine</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="Salads">Salads</SelectItem>
                  <SelectItem value="Seafood">Seafood</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Desserts">Desserts</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Enter description"
                rows={3}
                data-testid="textarea-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preparationTime">Preparation Time (minutes)</Label>
              <Input
                id="preparationTime"
                type="number"
                min="1"
                {...form.register("preparationTime", { valueAsNumber: true })}
                placeholder="15"
                data-testid="input-preparation-time"
              />
              {form.formState.errors.preparationTime && (
                <p className="text-sm text-red-500">{form.formState.errors.preparationTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image Upload</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  data-testid="input-image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex-1 p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                >
                  {image ? "Image selected" : "Choose File"}
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  data-testid="button-browse-image"
                >
                  Browse
                </Button>
              </div>
            </div>
          </div>

          {/* Add-ons Section */}
          {!showAddOns ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <span className="text-gray-500">Modifiers section removed</span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAddOnSection}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  data-testid="button-restore-addon-section"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Modifiers Section
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Modifiers (Add-ons)</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeEntireAddOnSection}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  data-testid="button-remove-addon-section"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Section
                </Button>
              </div>
            {addOns.map((addOn, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <Label>Name</Label>
                  <Input
                    placeholder="Add-on name"
                    value={addOn.name}
                    onChange={(e) => updateAddOn(index, "name", e.target.value)}
                    data-testid={`input-addon-name-${index}`}
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={addOn.price}
                      onChange={(e) => updateAddOn(index, "price", parseFloat(e.target.value) || 0)}
                      data-testid={`input-addon-price-${index}`}
                    />
                    {addOns.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeAddOn(index)}
                        className="text-red-600 border-red-600 hover:bg-red-50 flex-shrink-0"
                        data-testid={`button-remove-addon-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addAddOn}
              className="text-green-600 border-green-600 hover:bg-green-50"
              data-testid="button-add-addon"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another
            </Button>
            </div>
          )}

          {/* Customization Section */}
          {!showCustomizations ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <span className="text-gray-500">Customization section removed</span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomizationSection}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  data-testid="button-restore-customization-section"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customization Section
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Customization</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeEntireCustomizationSection}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  data-testid="button-remove-customization-section"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Section
                </Button>
              </div>
            {customizations.map((customization, custIndex) => (
              <div key={custIndex} className="space-y-3 p-4 border rounded-lg relative">
                {customizations.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeCustomization(custIndex)}
                    className="absolute top-2 right-2 text-red-600 border-red-600 hover:bg-red-50 h-8 w-8"
                    data-testid={`button-remove-customization-${custIndex}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <div>
                  <Label>Customization Name</Label>
                  <Input
                    placeholder="e.g., Size, Spice Level"
                    value={customization.name}
                    onChange={(e) => updateCustomization(custIndex, "name", e.target.value)}
                    data-testid={`input-customization-name-${custIndex}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Options</Label>
                  {customization.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex gap-2">
                      <Input
                        placeholder="Option"
                        value={option}
                        onChange={(e) => updateCustomizationOption(custIndex, optIndex, e.target.value)}
                        data-testid={`input-customization-option-${custIndex}-${optIndex}`}
                      />
                      {customization.options.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCustomizationOption(custIndex, optIndex)}
                          className="text-red-600 border-red-600 hover:bg-red-50 flex-shrink-0"
                          data-testid={`button-remove-customization-option-${custIndex}-${optIndex}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCustomizationOption(custIndex)}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    data-testid={`button-add-customization-option-${custIndex}`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Option
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addCustomization}
              className="text-green-600 border-green-600 hover:bg-green-50"
              data-testid="button-add-customization"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Customization
            </Button>
            </div>
          )}

          {/* Variants Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Variants</h3>
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <Label>Options</Label>
                  <Input
                    placeholder="e.g., Small, Medium, Large"
                    value={variant.option}
                    onChange={(e) => updateVariant(index, "option", e.target.value)}
                    data-testid={`input-variant-option-${index}`}
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value) || 0)}
                      data-testid={`input-variant-price-${index}`}
                    />
                    {variants.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 border-red-600 hover:bg-red-50 flex-shrink-0"
                        data-testid={`button-remove-variant-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addVariant}
              className="text-green-600 border-green-600 hover:bg-green-50"
              data-testid="button-add-variant"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Option
            </Button>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg"
              disabled={createMenuItemMutation.isPending}
              data-testid="button-add-menu-item"
            >
              {createMenuItemMutation.isPending 
                ? (isEditMode ? "Updating..." : "Adding...") 
                : (isEditMode ? "Update Menu Item" : "Add")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}