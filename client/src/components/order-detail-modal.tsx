import { useMemo } from "react";
import { X, Clock, MapPin, User, Phone, Receipt, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useBranchCurrency } from "@/hooks/useBranchCurrency";
import type { DetailedOrder } from "@/types/schema";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DetailedOrder | null;
}

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  const { formatPrice, getCurrencySymbol } = useBranchCurrency(order?.branchId);

  // Format the order date and time
  const orderDateTime = useMemo(() => {
    if (!order?.createdAt) return { date: '', time: '' };
    
    const orderDate = new Date(order.createdAt);
    const date = orderDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const time = orderDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return { date, time };
  }, [order?.createdAt]);

  // Get status color based on order status
  const getStatusColor = (status: string) => {
    if (!status) return 'bg-muted text-muted-foreground';
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending':
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-primary/10 text-primary dark:bg-primary/20';
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-card text-card-foreground">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold text-primary">Receipt</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
                data-testid="button-close-order-detail"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Restaurant Info */}
            <div className="text-center border-b border-primary/20 pb-4">
              <h2 className="text-xl font-bold text-primary">{order.branchName}</h2>
              <p className="text-sm text-muted-foreground mt-1">Order Receipt</p>
            </div>
          </DialogHeader>

          <CardContent className="px-6 pb-6">
            {/* Order Info */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Order #</span>
                <span className="text-sm font-mono text-primary">{order.orderNumber}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Date & Time</span>
                <div className="text-right">
                  <div className="text-sm">{orderDateTime.date}</div>
                  <div className="text-xs text-muted-foreground">{orderDateTime.time}</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer</span>
                <span className="text-sm">{order.username}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Type</span>
                <Badge variant="outline" className="text-xs">
                  {order.orderType}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status</span>
                <Badge className={`text-xs ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </Badge>
              </div>

              {order.completionTimeMinutes > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Est. Time
                  </span>
                  <span className="text-sm">{order.completionTimeMinutes} mins</span>
                </div>
              )}
            </div>

            {/* Delivery/Pickup Info */}
            {(order.orderDeliveryDetails || order.orderPickupDetails) && (
              <div className="mb-6 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {order.orderDeliveryDetails ? 'Delivery Details' : 'Pickup Details'}
                  </span>
                </div>
                
                {order.orderDeliveryDetails && (
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>{order.orderDeliveryDetails.deliveryAddress}</p>
                    {order.orderDeliveryDetails.phoneNumber && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {order.orderDeliveryDetails.phoneNumber}
                      </div>
                    )}
                    {order.orderDeliveryDetails.deliveryInstruction && (
                      <p className="italic">Note: {order.orderDeliveryDetails.deliveryInstruction}</p>
                    )}
                  </div>
                )}

                {order.orderPickupDetails && (
                  <div className="text-xs text-muted-foreground">
                    <p>Pickup Time: {order.orderPickupDetails.prefferedPickupTime}</p>
                    {order.orderPickupDetails.pickupInstruction && (
                      <p className="italic">Note: {order.orderPickupDetails.pickupInstruction}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            <Separator className="my-4" />

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span className="font-medium">Items Ordered</span>
              </div>
              
              <div className="space-y-3">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{item.itemName}</span>
                          <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                        </div>
                        
                        {item.orderItemModifiers && item.orderItemModifiers.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {item.orderItemModifiers.map((modifier, modifierIndex) => (
                              <div key={modifierIndex} className="text-xs text-muted-foreground ml-2">
                                • {modifier.modifierName} {modifier.quantity > 1 && `×${modifier.quantity}`}
                                {modifier.price > 0 && ` (+${formatPrice(modifier.price)})`}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {item.orderItemCustomizations && item.orderItemCustomizations.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {item.orderItemCustomizations.map((customization, customIndex) => (
                              <div key={customIndex} className="text-xs text-muted-foreground ml-2 italic">
                                • {customization.customizationName}: {customization.optionName}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <span className="text-sm font-medium">{formatPrice(item.totalPrice)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Charges Breakdown */}
            <div className="space-y-3">
              <h3 className="font-medium text-primary">Bill Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subTotal)}</span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}

                {order.serviceCharges > 0 && (
                  <div className="flex justify-between">
                    <span>Service Charges</span>
                    <span>{formatPrice(order.serviceCharges)}</span>
                  </div>
                )}

                {order.deliveryCharges > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>{formatPrice(order.deliveryCharges)}</span>
                  </div>
                )}

                {order.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(order.taxAmount)}</span>
                  </div>
                )}

                {order.tipAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Tip</span>
                    <span>{formatPrice(order.tipAmount)}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between items-center text-lg font-bold text-primary">
                <span>Total Amount</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            {/* Allergens */}
            {order.allergens && order.allergens.length > 0 && (
              <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-sm">
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">Allergen Info: </span>
                  <span className="text-yellow-700 dark:text-yellow-300">
                    Contains {order.allergens.join(', ')}
                  </span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-dashed border-primary/30 text-center">
              <p className="text-xs text-muted-foreground">
                Thank you for your order!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Order ID: {order.id}
              </p>
            </div>
          </CardContent>
        </div>
      </DialogContent>
    </Dialog>
  );
}