import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

interface Order {
  id: string;
  items: number;
  orderNumber: string;
  date: string;
  tableNo: string;
  payment: "Paid" | "Unpaid";
  status: "Preparing" | "Delivered" | "Cancelled";
  price: number;
}

const mockOrders: Order[] = [
  {
    id: "1",
    items: 2,
    orderNumber: "#ID238976",
    date: "Apr 24, 2022",
    tableNo: "Table No 3",
    payment: "Paid",
    status: "Preparing",
    price: 10.62
  },
  {
    id: "2",
    items: 2,
    orderNumber: "#ID238976",
    date: "Apr 24, 2022",
    tableNo: "Chieko Chute",
    payment: "Paid",
    status: "Preparing",
    price: 10.62
  },
  {
    id: "3",
    items: 2,
    orderNumber: "#ID238974",
    date: "Apr 24, 2022",
    tableNo: "Table No 5",
    payment: "Paid",
    status: "Delivered",
    price: 42.85
  },
  {
    id: "4",
    items: 2,
    orderNumber: "#ID238976",
    date: "Apr 23, 2022",
    tableNo: "Table No 6",
    payment: "Unpaid",
    status: "Cancelled",
    price: 64.23
  },
  {
    id: "5",
    items: 2,
    orderNumber: "#ID238976",
    date: "Apr 24, 2022",
    tableNo: "Chieko Chute",
    payment: "Paid",
    status: "Preparing",
    price: 10.62
  }
];

export default function Orders() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [orderFilter, setOrderFilter] = useState("All Orders");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tableNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = orderFilter === "All Orders" || 
      (orderFilter === "Preparing" && order.status === "Preparing") ||
      (orderFilter === "Delivered" && order.status === "Delivered") ||
      (orderFilter === "Cancelled" && order.status === "Cancelled");
    
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Preparing":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Preparing</Badge>;
      case "Delivered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Delivered</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (payment: string) => {
    return payment === "Paid" ? 
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Paid</Badge> :
      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Unpaid</Badge>;
  };

  return (
    <div className="p-6 space-y-6" data-testid="orders-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/entities")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900" data-testid="page-title">
            Restaurants
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 w-64"
              data-testid="search-input"
            />
          </div>
          <Button variant="ghost" size="sm">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          </Button>
          <Button variant="ghost" size="sm">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5" data-testid="main-tabs">
          <TabsTrigger value="orders" className="bg-green-500 text-white data-[state=active]:bg-green-600">
            Orders
          </TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="discount">Discount</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {/* Orders Filter Tabs */}
          <div className="flex items-center justify-between">
            <Tabs value={orderFilter} onValueChange={setOrderFilter}>
              <TabsList data-testid="order-filter-tabs">
                <TabsTrigger value="All Orders">All Orders</TabsTrigger>
                <TabsTrigger value="Preparing">Preparing</TabsTrigger>
                <TabsTrigger value="Delivered">Delivered</TabsTrigger>
                <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
                data-testid="orders-search"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Orders <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                  <TableHead>Date <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                  <TableHead>Table No <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                  <TableHead>Payment <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                  <TableHead>Status <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                  <TableHead>Price <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id} data-testid={`order-row-${order.id}`}>
                    <TableCell>
                      <input type="checkbox" className="rounded" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.items} Items</div>
                        <div className="text-sm text-gray-500">{order.orderNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.tableNo}</TableCell>
                    <TableCell>{getPaymentBadge(order.payment)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="font-medium">${order.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show result:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="menu">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Menu Management</h3>
            <p className="text-gray-600">Menu management features will be implemented here.</p>
          </div>
        </TabsContent>

        <TabsContent value="tables">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Table Management</h3>
            <p className="text-gray-600">Table management features will be implemented here.</p>
          </div>
        </TabsContent>

        <TabsContent value="deals">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Deals Management</h3>
            <p className="text-gray-600">Deals management features will be implemented here.</p>
          </div>
        </TabsContent>

        <TabsContent value="discount">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Discount Management</h3>
            <p className="text-gray-600">Discount management features will be implemented here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}