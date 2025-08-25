import { useState } from "react";
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

// Configuration schema
const branchConfigSchema = z.object({
  IsTakeaway: z.boolean(),
  IsReservation: z.boolean(),
  IsDelivery: z.boolean(),
  
  // Operating Hours
  OpenTime: z.string().optional(),
  CloseTime: z.string().optional(),
  
  // Delivery Configuration
  DeliveryTime: z.number().min(0).optional(),
  DeliveryMinimumOrder: z.number().min(0).optional(),
  DeliveryFee: z.number().min(0).optional(),
  MaxDeliveryDistance: z.number().min(0).optional(),
  
  // Reservation Configuration  
  MaxAdvanceDays: z.number().min(0).optional(),
  MinNoticeMinutes: z.number().min(0).optional(),
  MaxGuestsPerReservation: z.number().min(1).optional(),
  HoldTimeMinutes: z.number().min(0).optional(),
});

type BranchConfigData = z.infer<typeof branchConfigSchema>;

interface BranchConfigModalProps {
  open: boolean;
  onClose: () => void;
  branch: Branch;
}

export default function BranchConfigModal({ open, onClose, branch }: BranchConfigModalProps) {
  const { toast } = useToast();
  
  const form = useForm<BranchConfigData>({
    resolver: zodResolver(branchConfigSchema),
    defaultValues: {
      IsTakeaway: true,
      IsReservation: false,
      IsDelivery: false,
      
      // Operating Hours defaults
      OpenTime: "09:00",
      CloseTime: "22:00",
      
      // Delivery defaults
      DeliveryTime: 30,
      DeliveryMinimumOrder: 25.00,
      DeliveryFee: 3.99,
      MaxDeliveryDistance: 10,
      
      // Reservation defaults
      MaxAdvanceDays: 30,
      MinNoticeMinutes: 120,
      MaxGuestsPerReservation: 8,
      HoldTimeMinutes: 15,
    },
  });

  const isReservationEnabled = form.watch("IsReservation");
  const isDeliveryEnabled = form.watch("IsDelivery");

  const onSubmit = async (data: BranchConfigData) => {
    try {
      console.log("Branch configuration data:", data);
      // TODO: Replace with actual API call when provided
      // await branchApi.updateBranchConfig(branch.id, data);
      
      toast({
        title: "Success",
        description: "Branch configuration updated successfully",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update configuration",
        variant: "destructive",
      });
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
                  name="IsTakeaway"
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
                  name="IsReservation"
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
                  name="IsDelivery"
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
                    name="OpenTime"
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
                    name="CloseTime"
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
                      name="DeliveryTime"
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
                      name="DeliveryFee"
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
                      name="DeliveryMinimumOrder"
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
                      name="MaxDeliveryDistance"
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
                      name="MaxAdvanceDays"
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
                      name="MinNoticeMinutes"
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
                      name="MaxGuestsPerReservation"
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
                      name="HoldTimeMinutes"
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
                className="bg-green-600 hover:bg-green-700"
              >
                Save Configuration
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}