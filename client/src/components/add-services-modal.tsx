import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { type InsertService, type Service } from "@/types/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { servicesApi } from "@/lib/apiRepository";

interface AddServicesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId?: string;
}


export default function AddServicesModal({ open, onOpenChange, restaurantId }: AddServicesModalProps) {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();



  // Fetch available services from API
  const { data: availableServices = [], isLoading: isLoadingServices } = useQuery<Service[]>({
    queryKey: ['services', 2],
    queryFn: async (): Promise<Service[]> => {
      return await servicesApi.getServicesByType(2); // Type 2 for restaurant
    },
    enabled: open,
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
        description: `${selectedServices.length} service(s) added successfully`,
      });
      setSelectedServices([]);
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

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };



  const handleSubmit = () => {
    const servicesToAdd: InsertService[] = [];
    
    // Add selected services
    selectedServices.forEach(serviceId => {
      const service = availableServices.find(s => s.id === serviceId);
      if (service) {
        servicesToAdd.push({
          name: service.name,
          type: service.price > 0 ? "paid" : "service", // Convert API type to UI type
          price: service.price,
          description: service.description,
          status: "active",
        });
      }
    });

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
      <DialogContent className="max-w-3xl p-6 bg-white rounded-lg max-h-[85vh] overflow-y-auto">
        <DialogTitle className="text-xl font-semibold text-gray-900 mb-6">
          Add Services
        </DialogTitle>

        <div className="space-y-6">
          {/* Predefined Services */}
          <div>
            <Label className="text-lg font-medium text-gray-900 mb-4 block">
              Select from Available Services
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {isLoadingServices ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  Loading services...
                </div>
              ) : availableServices.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  No services available
                </div>
              ) : (
                availableServices.map((service) => (
                  <div key={service.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            service.price === 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {service.price === 0 ? 'Free' : `$${(service.price / 100).toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>



          {/* Submit Button */}
          <div className="flex justify-center pt-6 border-t">
            <Button
              onClick={handleSubmit}
              disabled={createServicesMutation.isPending || selectedServices.length === 0}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md"
            >
              {createServicesMutation.isPending ? "Adding..." : `Add ${selectedServices.length} Service(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}