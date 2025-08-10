import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { type InsertService } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddServicesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId?: string;
}

const predefinedServices = [
  { name: "Request for Bottle", type: "service", price: 0, description: "Request a water bottle for the table" },
  { name: "Request for Song", type: "paid", price: 200, description: "Request a specific song to be played" },
  { name: "Table Cleaning", type: "service", price: 0, description: "Request additional table cleaning" },
  { name: "Extra Napkins", type: "service", price: 0, description: "Request additional napkins" },
  { name: "Birthday Celebration", type: "paid", price: 500, description: "Special birthday celebration setup" },
  { name: "Photo Service", type: "paid", price: 300, description: "Professional photo service" },
  { name: "Wi-Fi Password", type: "service", price: 0, description: "Request Wi-Fi password" },
  { name: "High Chair", type: "service", price: 0, description: "Request high chair for children" },
];

export default function AddServicesModal({ open, onOpenChange, restaurantId }: AddServicesModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();



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

  const handlePredefinedServiceToggle = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName) 
        ? prev.filter(name => name !== serviceName)
        : [...prev, serviceName]
    );
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
                          service.type === 'service' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {service.type === 'service' ? 'Service' : `$${(service.price / 100).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  </div>
                </div>
              ))}
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