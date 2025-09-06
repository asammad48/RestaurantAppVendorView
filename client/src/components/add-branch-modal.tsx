import { useState, useRef } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertBranchSchema, type InsertBranch, type Branch } from "@/types/schema";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { branchApi, genericApi, getImageUrl } from "@/lib/apiRepository";

interface AddBranchModalProps {
  open: boolean;
  onClose: () => void;
  entityId: number;
  branchToEdit?: Branch | null;
  isEdit?: boolean;
}

export default function AddBranchModal({ open, onClose, entityId, branchToEdit, isEdit = false }: AddBranchModalProps) {
  console.log('=== AddBranchModal Props ===');
  console.log('entityId:', entityId);
  console.log('isEdit:', isEdit);
  console.log('branchToEdit:', branchToEdit);
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch branch data for editing - ALWAYS REFRESH when modal opens
  const { data: branchData } = useQuery({
    queryKey: ["branch", branchToEdit?.id, open], // Include 'open' to refresh when modal opens
    queryFn: async () => {
      if (!branchToEdit) return null;
      return await branchApi.getBranchById(branchToEdit.id);
    },
    enabled: isEdit && !!branchToEdit?.id && open,
    staleTime: 0, // Always fetch fresh data when modal opens for editing
  });

  // Fetch currencies and timezones
  const { data: currencies, isLoading: currenciesLoading } = useQuery({
    queryKey: ["currencies"],
    queryFn: async () => {
      const response = await genericApi.getCurrencies();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  });

  const { data: timezones, isLoading: timezonesLoading } = useQuery({
    queryKey: ["timezones"], 
    queryFn: async () => {
      const response = await genericApi.getTimezones();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  });

  const form = useForm<InsertBranch>({
    resolver: zodResolver(insertBranchSchema),
    defaultValues: {
      Name: "",
      Address: "",
      ContactNumber: "",
      EntityId: entityId,
      SubscriptionId: 1,
      InstagramLink: "",
      WhatsappLink: "",
      FacebookLink: "",
      GoogleMapsLink: "",
      TimeZone: "",
      Currency: "",
    },
  });

  // Update form values when branch data is loaded for editing or reset for add mode
  React.useEffect(() => {
    console.log('Effect triggered:', { isEdit, branchData, hasFormData: !!branchData, open });
    if (isEdit && branchData) {
      console.log('Resetting form with branch data:', branchData);
      form.reset({
        Name: (branchData as any).name || "",
        Address: (branchData as any).address || "",
        ContactNumber: (branchData as any).contactNumber || "",
        EntityId: entityId,
        SubscriptionId: (branchData as any).subscriptionId || 1,
        InstagramLink: (branchData as any).instagramLink || "",
        WhatsappLink: (branchData as any).whatsappLink || "",
        FacebookLink: (branchData as any).facebookLink || "",
        GoogleMapsLink: (branchData as any).googleMapsLink || "",
        TimeZone: (branchData as any).timeZone || "",
        Currency: (branchData as any).currency || "",
      });
      
      // Set image previews if they exist
      if ((branchData as any).restaurantLogo) {
        setLogoPreview(getImageUrl((branchData as any).restaurantLogo));
      }
      if ((branchData as any).restaurantBanner) {
        setBannerPreview(getImageUrl((branchData as any).restaurantBanner));
      }
    } else if (!isEdit && open) {
      // Add mode - ALWAYS reset form when modal opens
      console.log('Resetting form for add mode');
      form.reset({
        Name: "",
        Address: "",
        ContactNumber: "",
        EntityId: entityId,
        SubscriptionId: 1,
        InstagramLink: "",
        WhatsappLink: "",
        FacebookLink: "",
        GoogleMapsLink: "",
        TimeZone: "",
        Currency: "",
      });
      setLogoPreview("");
      setBannerPreview("");
      setLogoFile(null);
      setBannerFile(null);
    }
  }, [isEdit, branchData, form, entityId, open]);

  const createBranchMutation = useMutation({
    mutationFn: async (data: InsertBranch) => {
      console.log('Form submission data:', data);
      console.log('Is edit mode:', isEdit);
      console.log('Branch to edit:', branchToEdit);
      console.log('Logo file:', logoFile);
      console.log('Banner file:', bannerFile);
      
      if (isEdit && branchToEdit) {
        console.log('Calling updateBranch API...');
        return await branchApi.updateBranch(branchToEdit.id, data, logoFile || undefined, bannerFile || undefined);
      } else {
        console.log('Calling createBranch API...');
        return await branchApi.createBranch(data, logoFile || undefined, bannerFile || undefined);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", entityId] });
      queryClient.invalidateQueries({ queryKey: ["entities"] });
      if (isEdit && branchToEdit) {
        queryClient.invalidateQueries({ queryKey: ["branch", branchToEdit.id] });
      }
      toast({
        title: "Success",
        description: isEdit ? "Branch updated successfully" : "Branch added successfully",
      });
      form.reset();
      setLogoFile(null);
      setBannerFile(null);
      setLogoPreview("");
      setBannerPreview("");
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: error.message || (isEdit ? "Failed to update branch" : "Failed to add branch"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBranch) => {
    console.log('=== FORM SUBMIT TRIGGERED ===');
    console.log('Submit data:', data);
    console.log('EntityId in form data:', data.EntityId);
    console.log('entityId prop:', entityId);
    console.log('isEdit:', isEdit);
    console.log('branchToEdit:', branchToEdit);
    console.log('Mutation pending:', createBranchMutation.isPending);
    
    // Ensure EntityId is set
    const formDataWithEntityId = {
      ...data,
      EntityId: entityId // Force entityId to be set
    };
    
    console.log('Final form data being sent:', formDataWithEntityId);
    createBranchMutation.mutate(formDataWithEntityId);
  };

  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setBannerPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {isEdit ? "Edit Branch" : "Add Branch"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('=== FORM VALIDATION ERRORS ===');
            console.log('Validation errors:', errors);
            console.log('Form values:', form.getValues());
            console.log('Form state:', form.formState);
          })} className="space-y-6 px-1">
            <FormField
              control={form.control}
              name="Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">Branch Name</FormLabel>
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

            <FormField
              control={form.control}
              name="Address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">Address</FormLabel>
                  <FormControl>
                    <Textarea
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

            <FormField
              control={form.control}
              name="ContactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter contact number"
                      className="w-full"
                      data-testid="input-contact-number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="TimeZone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">Time Zone</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full" data-testid="select-timezone">
                          <SelectValue placeholder={timezonesLoading ? "Loading timezones..." : "Select timezone"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.isArray(timezones) && timezones.map((timezone: any) => (
                          <SelectItem key={timezone.timeZoneValue} value={timezone.timeZoneValue} data-testid={`option-timezone-${timezone.timeZoneValue}`}>
                            {timezone.timeZoneName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">Currency</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full" data-testid="select-currency">
                          <SelectValue placeholder={currenciesLoading ? "Loading currencies..." : "Select currency"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.isArray(currencies) && currencies.map((currency: any) => (
                          <SelectItem key={currency.currencyValue} value={currency.currencyValue} data-testid={`option-currency-${currency.currencyValue}`}>
                            {currency.currencyName} ({currency.currencyValue})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Logo Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white">Restaurant Logo</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoSelect}
                  className="hidden"
                  data-testid="input-logo"
                />
                <div className="text-center">
                  {logoPreview ? (
                    <div className="relative">
                      <img src={logoPreview} alt="Logo preview" className="mx-auto h-32 w-32 object-cover rounded-lg" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Click to upload logo</p>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    className="mt-2"
                    data-testid="button-upload-logo"
                  >
                    Choose Logo
                  </Button>
                </div>
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white">Restaurant Banner</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerSelect}
                  className="hidden"
                  data-testid="input-banner"
                />
                <div className="text-center">
                  {bannerPreview ? (
                    <div className="relative">
                      <img src={bannerPreview} alt="Banner preview" className="mx-auto h-32 w-full object-cover rounded-lg" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0"
                        onClick={() => {
                          setBannerFile(null);
                          setBannerPreview("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Click to upload banner</p>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => bannerInputRef.current?.click()}
                    className="mt-2"
                    data-testid="button-upload-banner"
                  >
                    Choose Banner
                  </Button>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Social Links (Optional)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="InstagramLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">Instagram</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Instagram URL"
                          className="w-full"
                          data-testid="input-instagram"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="WhatsappLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">WhatsApp</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="WhatsApp URL"
                          className="w-full"
                          data-testid="input-whatsapp"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="FacebookLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">Facebook</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Facebook URL"
                          className="w-full"
                          data-testid="input-facebook"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="GoogleMapsLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">Google Maps</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Google Maps URL"
                          className="w-full"
                          data-testid="input-google-maps"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createBranchMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-submit"
                onClick={() => {
                  console.log('=== SUBMIT BUTTON CLICKED ===');
                  console.log('Form valid:', form.formState.isValid);
                  console.log('Form errors:', form.formState.errors);
                  console.log('Current values:', form.getValues());
                }}
              >
                {createBranchMutation.isPending ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Branch" : "Add Branch")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}