import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { Branch } from "@/types/schema";
import { branchApi } from "@/lib/apiRepository";
import { convertToUTC, getCurrencySymbol } from "@/lib/currencyUtils";
import { useBranchCurrency } from "@/hooks/useBranchCurrency";

// Configuration schema - using lowercase to match API response
const branchConfigSchema = z.object({
  isTakeaway: z.boolean(),
  isReservation: z.boolean(),
  isDelivery: z.boolean(),
  
  // Operating Hours
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  
  // Financial Configuration
  serviceCharges: z.number().min(0).optional(),
  taxPercentage: z.number().min(0).max(100).optional(),
  taxAppliedType: z.number().optional(),
  
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
  serviceCharges: number;
  taxPercentage: number;
  taxAppliedType: number;
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
  const { getCurrencySymbol: getBranchCurrencySymbol } = useBranchCurrency(branch?.id);
  
  const form = useForm<BranchConfigData>({
    resolver: zodResolver(branchConfigSchema),
    defaultValues: {
      isTakeaway: true,
      isReservation: false,
      isDelivery: false,
      
      // Operating Hours defaults
      openTime: "09:00",
      closeTime: "22:00",
      
      // Financial defaults
      serviceCharges: 0,
      taxPercentage: 0,
      taxAppliedType: 1,
      
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
        
        // Convert UTC time back to local time for display
        const formatTimeFromUTC = (utcTimeString: string) => {
          if (!utcTimeString || utcTimeString === "00:00:00") return "09:00";
          try {
            // If it's just HH:mm:ss format, create a proper UTC date object
            if (utcTimeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
              const [hours, minutes, seconds] = utcTimeString.split(':');
              
              // Create a date object with today's date and the UTC time
              const today = new Date();
              const utcDate = new Date(Date.UTC(
                today.getUTCFullYear(),
                today.getUTCMonth(),
                today.getUTCDate(),
                parseInt(hours),
                parseInt(minutes),
                parseInt(seconds || '0')
              ));
              
              // Convert UTC to branch local time
              const branchTimeZone = branch?.timeZone || 'UTC';
              const localTimeString = utcDate.toLocaleTimeString('en-US', { 
                timeZone: branchTimeZone,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              });
              
              return localTimeString; // Already in HH:mm format
            }
            return utcTimeString.substring(0, 5); // Fallback
          } catch (error) {
            console.error('Error converting UTC time to local:', error);
            return utcTimeString.substring(0, 5);
          }
        };

        // Reset form with fetched data
        form.reset({
          isTakeaway: configData.isTakeaway || false,
          isReservation: configData.isReservation || false,
          isDelivery: configData.isDelivery || false,
          openTime: formatTimeFromUTC(configData.openTime),
          closeTime: formatTimeFromUTC(configData.closeTime),
          serviceCharges: configData.serviceCharges || 0,
          taxPercentage: configData.taxPercentage || 0,
          taxAppliedType: configData.taxAppliedType || 1,
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
      
      // Convert local time to UTC for API submission
      const formatTimeForApi = (timeString: string) => {
        if (!timeString) return "00:00:00";
        try {
          // Create a date object for today with the local time
          const today = new Date();
          const [hours, minutes] = timeString.split(':');
          today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          // Convert to UTC considering the branch timezone
          const branchTimeZone = branch?.timeZone || 'UTC';
          
          // Calculate timezone offset difference
          const localOffset = today.getTimezoneOffset(); // Browser timezone offset in minutes
          const targetTime = new Date(today.toLocaleString('en-US', { timeZone: branchTimeZone }));
          const branchOffset = (today.getTime() - targetTime.getTime()) / (1000 * 60); // Branch timezone offset
          
          // Apply the difference to get UTC time
          const utcTime = new Date(today.getTime() + (branchOffset * 60 * 1000));
          return utcTime.toTimeString().split(' ')[0]; // Extract HH:mm:ss
        } catch (error) {
          console.error('Error converting local time to UTC:', error);
          return timeString + ":00"; // Fallback
        }
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
                <CardTitle className="text-lg">Operating Hours & Financial Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="openTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Time (Local Time)</FormLabel>
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
                        <FormLabel>Closing Time (Local Time)</FormLabel>
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
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serviceCharges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Charges ({getBranchCurrencySymbol()})</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Percentage (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            max="100"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="taxAppliedType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Applied On</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tax application type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Total Amount</SelectItem>
                            <SelectItem value="2">Discount Amount</SelectItem>
                          </SelectContent>
                        </Select>
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
                          <FormLabel>Delivery Fee ({getBranchCurrencySymbol()})</FormLabel>
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
                          <FormLabel>Minimum Order ({getBranchCurrencySymbol()})</FormLabel>
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