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
// import { Textarea } from "@/components/ui/textarea";
import { insertServiceSchema, type InsertService } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddServicesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId?: string;
}

const predefinedServices = [
  { name: "Request for Bottle", type: "free", price: 0, description: "Request a water bottle for the table" },
  { name: "Request for Song", type: "paid", price: 200, description: "Request a specific song to be played" },
  { name: "Table Cleaning", type: "free", price: 0, description: "Request additional table cleaning" },
  { name: "Extra Napkins", type: "free", price: 0, description: "Request additional napkins" },
  { name: "Birthday Celebration", type: "paid", price: 500, description: "Special birthday celebration setup" },
  { name: "Photo Service", type: "paid", price: 300, description: "Professional photo service" },
  { name: "Wi-Fi Password", type: "free", price: 0, description: "Request Wi-Fi password" },
  { name: "High Chair", type: "free", price: 0, description: "Request high chair for children" },
];

export default function AddServicesModal({ open, onOpenChange, restaurantId }: AddServicesModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customServices, setCustomServices] = useState<InsertService[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<InsertService>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      name: "",
      type: "free",
      price: 0,
      description: "",
      restaurantId: restaurantId || undefined,
      status: "active",
    },
  });

  const createServicesMutation = useMutation({
    mutationFn: async (services: InsertService[]) => {
      const promises = services.map(service => 
        apiRequest("POST", "/api/services", service)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Success",
        description: `${selectedServices.length + customServices.length} service(s) added successfully`,
      });
      setSelectedServices([]);
      setCustomServices([]);
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add services",
        variant: "destructive",
      });
    },
  });

  const handlePredefinedServiceToggle = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName) 
        ? prev.filter(name => name !== serviceName)
        : [...prev, serviceName]
    );
  };

  const addCustomService = (data: InsertService) => {
    setCustomServices(prev => [...prev, data]);
    form.reset({
      name: "",
      type: "free",
      price: 0,
      description: "",
      restaurantId: restaurantId || undefined,
      status: "active",
    });
  };

  const removeCustomService = (index: number) => {
    setCustomServices(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const servicesToAdd: InsertService[] = [];
    
    // Add selected predefined services
    selectedServices.forEach(serviceName => {
      const service = predefinedServices.find(s => s.name === serviceName);
      if (service) {
        servicesToAdd.push({
          ...service,
          price: service.price,
          restaurantId: restaurantId || undefined,
          status: "active",
        });
      }
    });

    // Add custom services
    servicesToAdd.push(...customServices);

    if (servicesToAdd.length === 0) {
      toast({
        title: "Warning",
        description: "Please select at least one service",
        variant: "destructive",
      });
      return;
    }

    createServicesMutation.mutate(servicesToAdd);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-6 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add Services
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

        <div className="space-y-6">
          {/* Predefined Services */}
          <div>
            <Label className="text-lg font-medium text-gray-900 mb-4 block">
              Select from Available Services
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {predefinedServices.map((service) => (
                <div key={service.name} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={selectedServices.includes(service.name)}
                    onCheckedChange={() => handlePredefinedServiceToggle(service.name)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          service.type === 'free' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {service.type === 'free' ? 'Free' : `$${(service.price / 100).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Service Form */}
          <div className="border-t pt-6">
            <Label className="text-lg font-medium text-gray-900 mb-4 block">
              Add Custom Service
            </Label>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addCustomService)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter service name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch('type') === 'paid' && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Math.round(parseFloat(e.target.value) * 100))}
                            value={field.value ? (field.value / 100).toFixed(2) : ""}
                            placeholder="0.00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Describe the service..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                >
                  Add to Custom Services
                </Button>
              </form>
            </Form>
          </div>

          {/* Custom Services List */}
          {customServices.length > 0 && (
            <div className="border-t pt-6">
              <Label className="text-lg font-medium text-gray-900 mb-4 block">
                Custom Services to Add ({customServices.length})
              </Label>
              <div className="space-y-2">
                {customServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.type === 'free' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {service.type === 'free' ? 'Free' : `$${((service.price || 0) / 100).toFixed(2)}`}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomService(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-6 border-t">
            <Button
              onClick={handleSubmit}
              disabled={createServicesMutation.isPending || (selectedServices.length === 0 && customServices.length === 0)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md"
            >
              {createServicesMutation.isPending ? "Adding..." : `Add ${selectedServices.length + customServices.length} Service(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}