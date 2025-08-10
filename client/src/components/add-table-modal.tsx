import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const addTableSchema = z.object({
  tableNumber: z.string().min(1, "Table number is required"),
  seatingCapacity: z.string().min(1, "Seating capacity is required"),
  assignedTo: z.string().min(1, "Please assign a waiter"),
  available: z.boolean().default(true)
});

type AddTableFormData = z.infer<typeof addTableSchema>;

interface AddTableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTable: (table: AddTableFormData) => void;
}

const mockWaiters = [
  { id: "1", name: "Raza" },
  { id: "2", name: "Ahmed" },
  { id: "3", name: "Sarah" },
  { id: "4", name: "Hassan" },
  { id: "5", name: "Fatima" }
];

export default function AddTableModal({ open, onOpenChange, onAddTable }: AddTableModalProps) {
  const form = useForm<AddTableFormData>({
    resolver: zodResolver(addTableSchema),
    defaultValues: {
      tableNumber: "",
      seatingCapacity: "",
      assignedTo: "",
      available: true
    }
  });

  const onSubmit = (data: AddTableFormData) => {
    onAddTable(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="add-table-modal">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-gray-900" data-testid="modal-title">
            Add Table
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            {/* Table Number */}
            <FormField
              control={form.control}
              name="tableNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Table Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Table #1"
                      {...field}
                      className="w-full"
                      data-testid="input-table-number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Seating Capacity */}
            <FormField
              control={form.control}
              name="seatingCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Seating Capacity
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 4"
                      min="1"
                      max="20"
                      {...field}
                      className="w-full"
                      data-testid="input-seating-capacity"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assigned To */}
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Assign to
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full" data-testid="select-assigned-to">
                        <SelectValue placeholder="Select a waiter" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockWaiters.map((waiter) => (
                          <SelectItem key={waiter.id} value={waiter.name}>
                            {waiter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Available Toggle */}
            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between py-2">
                  <FormLabel className="text-sm font-medium text-gray-900 mb-0">
                    Available
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-green-500"
                      data-testid="toggle-available"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-12 py-2 rounded-lg"
                disabled={form.formState.isSubmitting}
                data-testid="button-submit"
              >
                Next
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}