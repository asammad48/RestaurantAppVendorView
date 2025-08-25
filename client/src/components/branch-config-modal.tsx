import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { Branch } from "@/types/schema";
import { branchApi } from "@/lib/apiRepository";

// Configuration schema - using lowercase to match API response
const branchConfigSchema = z.object({
  isTakeaway: z.boolean(),
  isReservation: z.boolean(),
  isDelivery: z.boolean(),
  
  // Operating Hours
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  
  // Delivery Configuration
  deliveryTime: z.number().min(0).optional(),
  deliveryMinimumOrder: z.number().min(0).optional(),
  deliveryFee: z.number().min(0).optional(),
  maxDeliveryDistance: z.number().min(0).optional(),
  
  // Reservation Configuration  
  maxAdvanceDays: z.number().min(0).optional(),
  minNoticeMinutes: z.number().min(0).optional(),
  maxGuestsPerReservation: z.number().min(1).optional(),
  holdTimeMinutes: z.number().min(0).optional(),
});

type BranchConfigData = z.infer<typeof branchConfigSchema>;

// Type for API response
interface BranchConfigResponse {
  branchId: number;
  isTakeaway: boolean;
  isReservation: boolean;
  isDelivery: boolean;
  deliveryTime: number;
  deliveryMinimumOrder: number;
  deliveryFee: number;
  maxDeliveryDistance: number;
  maxAdvanceDays: number;
  minNoticeMinutes: number;
  maxGuestsPerReservation: number;
  holdTimeMinutes: number;
  openTime: string;
  closeTime: string;
}

interface BranchConfigModalProps {
  open: boolean;
  onClose: () => void;
  branch: Branch;
}

export default function BranchConfigModal({ open, onClose, branch }: BranchConfigModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<BranchConfigData>({
    resolver: zodResolver(branchConfigSchema),
    defaultValues: {
      isTakeaway: true,
      isReservation: false,
      isDelivery: false,
      
      // Operating Hours defaults
      openTime: "09:00",
      closeTime: "22:00",
      
      // Delivery defaults
      deliveryTime: 30,
      deliveryMinimumOrder: 25.00,
      deliveryFee: 3.99,
      maxDeliveryDistance: 10,
      
      // Reservation defaults
      maxAdvanceDays: 30,
      minNoticeMinutes: 120,
      maxGuestsPerReservation: 8,
      holdTimeMinutes: 15,
    },
  });

  const isReservationEnabled = form.watch("isReservation");
  const isDeliveryEnabled = form.watch("isDelivery");

  // Fetch configuration data when modal opens
  useEffect(() => {
    const fetchConfiguration = async () => {
      if (!open || !branch.id) return;
      
      setIsLoading(true);
      try {
        const configData = await branchApi.getBranchConfiguration(branch.id) as BranchConfigResponse;
        console.log("Fetched configuration:", configData);
        
        // Convert time format from HH:mm:ss to HH:mm for HTML time inputs
        const formatTime = (timeString: string) => {
          if (!timeString || timeString === "00:00:00") return "09:00";
          return timeString.substring(0, 5); // Extract HH:mm from HH:mm:ss
        };

        // Reset form with fetched data
        form.reset({
          isTakeaway: configData.isTakeaway || false,
          isReservation: configData.isReservation || false,
          isDelivery: configData.isDelivery || false,
          openTime: formatTime(configData.openTime),
          closeTime: formatTime(configData.closeTime),
          deliveryTime: configData.deliveryTime || 30,
          deliveryMinimumOrder: configData.deliveryMinimumOrder || 25.00,
          deliveryFee: configData.deliveryFee || 3.99,
          maxDeliveryDistance: configData.maxDeliveryDistance || 10,
          maxAdvanceDays: configData.maxAdvanceDays || 30,
          minNoticeMinutes: configData.minNoticeMinutes || 120,
          maxGuestsPerReservation: configData.maxGuestsPerReservation || 8,
          holdTimeMinutes: configData.holdTimeMinutes || 15,
        });
      } catch (error: any) {
        console.error("Failed to fetch configuration:", error);
        toast({
          title: "Warning",
          description: "Could not load current configuration. Using defaults.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfiguration();
  }, [open, branch.id, form, toast]);

  const onSubmit = async (data: BranchConfigData) => {
    setIsSaving(true);
    try {
      console.log("Submitting configuration data:", data);
      
      // Convert time format from HH:mm to HH:mm:ss for API
      const formatTimeForApi = (timeString: string) => {
        if (!timeString) return "00:00:00";
        return `${timeString}:00`;
      };

      const apiData = {
        ...data,
        openTime: formatTimeForApi(data.openTime || ""),
        closeTime: formatTimeForApi(data.closeTime || ""),
      };

      await branchApi.updateBranchConfiguration(branch.id, apiData);
      
      toast({
        title: "Success",
        description: "Branch configuration updated successfully",
      });
      onClose();
    } catch (error: any) {
      console.error("Failed to update configuration:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Configure {branch.name}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Service Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isTakeaway"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium">Takeaway Service</FormLabel>
                        <p className="text-xs text-muted-foreground">Allow customers to place takeaway orders</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isReservation"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium">Reservation Service</FormLabel>
                        <p className="text-xs text-muted-foreground">Allow customers to make table reservations</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isDelivery"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium">Delivery Service</FormLabel>
                        <p className="text-xs text-muted-foreground">Allow customers to order for delivery</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operating Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="openTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="closeTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closing Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Configuration */}
            {isDeliveryEnabled && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="deliveryTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Time (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="30"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deliveryFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Fee ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              placeholder="3.99"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deliveryMinimumOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Order ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              placeholder="25.00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxDeliveryDistance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Distance (km)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reservation Configuration */}
            {isReservationEnabled && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reservation Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="maxAdvanceDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Advance Days</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="30"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minNoticeMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Notice (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="120"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxGuestsPerReservation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Guests per Reservation</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              placeholder="8"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="holdTimeMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hold Time (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="15"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
{isSaving ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}