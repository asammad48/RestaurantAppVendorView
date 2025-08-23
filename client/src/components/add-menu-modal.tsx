import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRepository } from "@/lib/apiRepository";
import type { InsertMenuItem, MenuCategory, MenuItem } from "@/types/schema";

const addMenuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.number().min(1, "Category is required"),
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
  branchId?: number;
  editMenuItem?: MenuItem; // MenuItem type for edit mode
}

export default function AddMenuModal({ isOpen, onClose, restaurantId, branchId = 3, editMenuItem }: AddMenuModalProps) {
  const isEditMode = !!editMenuItem;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<string>("");
  const [originalImage, setOriginalImage] = useState<string>(""); // Track original image for comparison
  const [addOns, setAddOns] = useState<AddOn[]>([{ name: "", price: 0 }]);
  const [customizations, setCustomizations] = useState<Customization[]>([{ name: "", options: [""] }]);
  const [variants, setVariants] = useState<Variant[]>([{ option: "", price: 0 }]);
  
  // Section visibility states
  const [showAddOns, setShowAddOns] = useState<boolean>(true);
  const [showCustomizations, setShowCustomizations] = useState<boolean>(true);

  // Fetch categories for dropdown
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: [`menu-categories-branch-${branchId}`],
    queryFn: async () => {
      const response = await apiRepository.call<{
        items: MenuCategory[];
        pageNumber: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasPrevious: boolean;
        hasNext: boolean;
      }>(
        'getMenuCategoriesByBranch',
        'GET',
        undefined,
        {
          PageNumber: '1',
          PageSize: '100',
          SortBy: 'name',
          IsAscending: 'true'
        },
        true,
        { branchId: branchId }
      );
      return response.data?.items || [];
    },
    enabled: !!branchId, // Only fetch when branchId is available
  });

  // Fetch menu item data for editing
  const { data: menuItemData, isLoading: isLoadingMenuItem } = useQuery({
    queryKey: [`menu-item-${editMenuItem?.id}`],
    queryFn: async () => {
      const response = await apiRepository.call<MenuItem>(
        'getMenuItemById',
        'GET',
        undefined,
        {},
        true,
        { id: editMenuItem!.id }
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
    enabled: !!editMenuItem?.id && isEditMode, // Only fetch when editing and we have an ID
  });

  const form = useForm<AddMenuFormData>({
    resolver: zodResolver(addMenuSchema),
    defaultValues: {
      name: "",
      categoryId: 0,
      description: "",
      preparationTime: 15,
      restaurantId: restaurantId || "",
    },
  });

  // Effect to populate form when editing
  useEffect(() => {
    if (isEditMode && menuItemData) {
      // Populate form with API data
      form.reset({
        name: menuItemData.name || "",
        categoryId: menuItemData.menuCategoryId || 0,
        description: menuItemData.description || "",
        preparationTime: menuItemData.preparationTime || 15,
        restaurantId: restaurantId || "",
      });
      
      // Set image if available
      if (menuItemData.menuItemPicture) {
        setImage(menuItemData.menuItemPicture);
        setOriginalImage(menuItemData.menuItemPicture); // Store original for comparison
      }
      
      // Set variants (convert to local format)
      if (menuItemData.variants && menuItemData.variants.length > 0) {
        setVariants(menuItemData.variants.map(v => ({
          option: v.name,
          price: v.price
        })));
      }
      
      // Set modifiers/addOns (convert to local format)
      if (menuItemData.modifiers && menuItemData.modifiers.length > 0) {
        setAddOns(menuItemData.modifiers.map(m => ({
          name: m.name,
          price: m.price
        })));
      }
      
      // Set customizations (convert to local format)
      if (menuItemData.customizations && menuItemData.customizations.length > 0) {
        setCustomizations(menuItemData.customizations.map(c => ({
          name: c.name,
          options: c.options.map(o => o.name)
        })));
      }
    }
  }, [isEditMode, menuItemData, form, restaurantId]);

  const createMenuItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRepository.call(
        'menuItemCreate',
        'POST',
        data
      );
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`menu-items-branch-${branchId}`] });
      toast({ title: "Menu item added successfully" });
      onClose();
      form.reset();
      setAddOns([{ name: "", price: 0 }]);
      setCustomizations([{ name: "", options: [""] }]);
      setVariants([{ option: "", price: 0 }]);
      setImage("");
      setOriginalImage("");
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

  const updateMenuItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRepository.call(
        'updateMenuItem',
        'PUT',
        data,
        undefined,
        true,
        { id: editMenuItem!.id }
      );
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`menu-items-branch-${branchId}`] });
      queryClient.invalidateQueries({ queryKey: [`menu-item-${editMenuItem!.id}`] });
      toast({ title: "Menu item updated successfully" });
      onClose();
      form.reset();
      setAddOns([{ name: "", price: 0 }]);
      setCustomizations([{ name: "", options: [""] }]);
      setVariants([{ option: "", price: 0 }]);
      setImage("");
      setOriginalImage("");
      setShowAddOns(true);
      setShowCustomizations(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating menu item",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store as base64 for API submission
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
    // Determine if image has changed (for update mode)
    const imageChanged = isEditMode && image !== originalImage;
    const imageData = isEditMode ? (imageChanged ? image : "") : image || "";

    // Prepare API payload according to the real API structure
    const menuItemData = {
      menuCategoryId: data.categoryId,
      name: data.name,
      description: data.description || "",
      isActive: true, // Required field for update
      preparationTime: data.preparationTime,
      MenuItemPicture: imageData, // Use capital M as per API spec
      variants: variants
        .filter(variant => variant.option.trim())
        .map(variant => ({
          name: variant.option,
          price: variant.price
        })),
      modifiers: showAddOns 
        ? addOns
          .filter(addon => addon.name.trim())
          .map(addon => ({
            name: addon.name,
            price: addon.price
          }))
        : [],
      customizations: showCustomizations
        ? customizations
          .filter(cust => cust.name.trim() && cust.options.some(opt => opt.trim()))
          .map(cust => ({
            name: cust.name,
            options: cust.options
              .filter(opt => opt.trim())
              .map(opt => ({ name: opt }))
          }))
        : []
    };

    // Use appropriate mutation based on mode
    if (isEditMode) {
      updateMenuItemMutation.mutate(menuItemData);
    } else {
      // For create mode, use different field name for image and exclude update-specific fields
      const createData = {
        menuCategoryId: data.categoryId,
        name: data.name,
        description: data.description || "",
        preparationTime: data.preparationTime,
        menuItemPicture: imageData, // lowercase for create
        variants: variants
          .filter(variant => variant.option.trim())
          .map(variant => ({
            name: variant.option,
            price: variant.price
          })),
        modifiers: showAddOns 
          ? addOns
            .filter(addon => addon.name.trim())
            .map(addon => ({
              name: addon.name,
              price: addon.price
            }))
          : [],
        customizations: showCustomizations
          ? customizations
            .filter(cust => cust.name.trim() && cust.options.some(opt => opt.trim()))
            .map(cust => ({
              name: cust.name,
              options: cust.options
                .filter(opt => opt.trim())
                .map(opt => ({ name: opt }))
            }))
          : []
      };
      createMenuItemMutation.mutate(createData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" data-testid="modal-add-menu">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{isEditMode ? 'Edit Menu Item' : 'Add Menu'}</DialogTitle>
        </DialogHeader>

        {/* Loading state for edit mode */}
        {isEditMode && isLoadingMenuItem ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading menu item data...</p>
            </div>
          </div>
        ) : (
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
              <Select 
                onValueChange={(value) => form.setValue("categoryId", parseInt(value))} 
                data-testid="select-category"
                disabled={categoriesLoading || (isEditMode && isLoadingMenuItem)}
                value={form.watch("categoryId")?.toString() || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category: MenuCategory) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.categoryId && (
                <p className="text-sm text-red-500">{form.formState.errors.categoryId.message}</p>
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
                {...form.register("preparationTime", { 
                  valueAsNumber: true,
                  setValueAs: (value) => value === "" ? undefined : Number(value)
                })}
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
                      value={addOn.price === 0 ? "" : addOn.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateAddOn(index, "price", value === "" ? 0 : parseFloat(value) || 0);
                      }}
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
                      value={variant.price === 0 ? "" : variant.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateVariant(index, "price", value === "" ? 0 : parseFloat(value) || 0);
                      }}
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
              disabled={createMenuItemMutation.isPending || updateMenuItemMutation.isPending || (isEditMode && isLoadingMenuItem)}
              data-testid="button-add-menu-item"
            >
              {(createMenuItemMutation.isPending || updateMenuItemMutation.isPending)
                ? (isEditMode ? "Updating..." : "Adding...") 
                : (isEditMode ? "Update Menu Item" : "Add")
              }
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}