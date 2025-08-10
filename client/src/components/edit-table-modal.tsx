import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const editTableSchema = z.object({
  seatingCapacity: z.string().min(1, "Seating capacity is required"),
  assignedTo: z.string().min(1, "Please assign a waiter"),
});

type EditTableFormData = z.infer<typeof editTableSchema>;

interface TableData {
  id: string;
  tableNumber: string;
  branch: string;
  waiter: string;
  seats: number;
  status: "Active" | "Inactive";
}

interface EditTableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: TableData | null;
  onEditTable: (tableId: string, updates: { seats: number; waiter: string }) => void;
}

const mockWaiters = [
  { id: "1", name: "Raza" },
  { id: "2", name: "Ahmed" },
  { id: "3", name: "Sarah" },
  { id: "4", name: "Hassan" },
  { id: "5", name: "Fatima" }
];

export default function EditTableModal({ open, onOpenChange, table, onEditTable }: EditTableModalProps) {
  const form = useForm<EditTableFormData>({
    resolver: zodResolver(editTableSchema),
    defaultValues: {
      seatingCapacity: "",
      assignedTo: "",
    }
  });

  useEffect(() => {
    if (table) {
      form.reset({
        seatingCapacity: table.seats.toString(),
        assignedTo: table.waiter,
      });
    }
  }, [table, form]);

  const onSubmit = (data: EditTableFormData) => {
    if (table) {
      onEditTable(table.id, {
        seats: parseInt(data.seatingCapacity),
        waiter: data.assignedTo,
      });
    }
    onOpenChange(false);
  };

  if (!table) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="edit-table-modal">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-gray-900" data-testid="modal-title">
            Edit Table
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            {/* Table Number (Read-only) */}
            <div>
              <Label className="text-sm font-medium text-gray-900">
                Table Number
              </Label>
              <Input
                value={table.tableNumber}
                disabled
                className="w-full bg-gray-50"
              />
            </div>

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
                    Assignee
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-assignee">
                        <SelectValue placeholder="Select a waiter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockWaiters.map((waiter) => (
                        <SelectItem key={waiter.id} value={waiter.name}>
                          {waiter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white px-6"
                data-testid="button-save"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}