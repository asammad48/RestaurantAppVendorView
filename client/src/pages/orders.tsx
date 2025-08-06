import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, ChevronDown, Edit, Trash2, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import QRCodeModal from "@/components/qr-code-modal";
import AddTableModal from "@/components/add-table-modal";
import AddMenuModal from "@/components/add-menu-modal";
import ApplyDiscountModal from "@/components/apply-discount-modal";
import { useLocation } from "wouter";
import type { MenuItem } from "@shared/schema";

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

interface TableData {
  id: string;
  tableNumber: string;
  branch: string;
  waiter: string;
  seats: number;
  status: "Active" | "Inactive";
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

const mockTables: TableData[] = [
  {
    id: "1",
    tableNumber: "Table #5",
    branch: "Gulshan Branch",
    waiter: "Raza",
    seats: 4,
    status: "Active"
  },
  {
    id: "2",
    tableNumber: "Table #5",
    branch: "Gulshan Branch",
    waiter: "Raza",
    seats: 4,
    status: "Active"
  },
  {
    id: "3",
    tableNumber: "Table #5",
    branch: "Gulshan Branch",
    waiter: "Raza",
    seats: 4,
    status: "Active"
  },
  {
    id: "4",
    tableNumber: "Table #5",
    branch: "Gulshan Branch",
    waiter: "Raza",
    seats: 4,
    status: "Active"
  },
  {
    id: "5",
    tableNumber: "Table #5",
    branch: "Gulshan Branch",
    waiter: "Raza",
    seats: 4,
    status: "Active"
  },
  {
    id: "6",
    tableNumber: "Table #5",
    branch: "Gulshan Branch",
    waiter: "Raza",
    seats: 4,
    status: "Active"
  }
];

export default function Orders() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [orderFilter, setOrderFilter] = useState("All Orders");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [showApplyDiscountModal, setShowApplyDiscountModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [tables, setTables] = useState<TableData[]>(mockTables);
  const [menuSearchTerm, setMenuSearchTerm] = useState("");
  const [activeMenuTab, setActiveMenuTab] = useState("Menu");

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

  // Query for menu items
  const { data: menuItems = [], isLoading: isLoadingMenu } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    queryFn: () => fetch("/api/menu-items").then(res => res.json()),
  });

  const handleAddTable = (tableData: any) => {
    const newTable: TableData = {
      id: (tables.length + 1).toString(),
      tableNumber: tableData.tableNumber,
      branch: "Gulshan Branch", // Default branch
      waiter: tableData.assignedTo,
      seats: parseInt(tableData.seatingCapacity),
      status: tableData.available ? "Active" : "Inactive"
    };
    setTables([...tables, newTable]);
  };

  // Filter menu items based on search
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(menuSearchTerm.toLowerCase())
  );

  // Format price from cents to rupees
  const formatPrice = (priceInCents: number) => {
    return `Rs${(priceInCents / 100).toFixed(0)}`;
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

        <TabsContent value="menu" className="space-y-6">
          {/* Menu Filter Tabs */}
          <div className="flex items-center justify-between">
            <Tabs value={activeMenuTab} onValueChange={setActiveMenuTab}>
              <TabsList data-testid="menu-filter-tabs">
                <TabsTrigger value="Menu" className="bg-green-500 text-white data-[state=active]:bg-green-600">
                  Menu
                </TabsTrigger>
                <TabsTrigger value="Category">Category</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-4">
              <Button 
                className="bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                onClick={() => setShowApplyDiscountModal(true)}
                data-testid="button-apply-discount"
              >
                Apply Discount
              </Button>
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => setShowAddMenuModal(true)}
                data-testid="button-add-item"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={menuSearchTerm}
              onChange={(e) => setMenuSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="menu-search"
            />
          </div>

          {/* Menu Items Table */}
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                  <TableHead>Descriptions <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                  <TableHead>Category <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                  <TableHead>Price <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                  <TableHead>Image <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingMenu ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading menu items...
                    </TableCell>
                  </TableRow>
                ) : filteredMenuItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No menu items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMenuItems.map((item) => (
                    <TableRow key={item.id} data-testid={`menu-item-row-${item.id}`}>
                      <TableCell className="font-medium" data-testid={`menu-item-name-${item.id}`}>
                        {item.name}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-xs truncate" data-testid={`menu-item-description-${item.id}`}>
                        {item.description || "No description"}
                      </TableCell>
                      <TableCell data-testid={`menu-item-category-${item.id}`}>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium" data-testid={`menu-item-price-${item.id}`}>
                        {formatPrice(item.price)}
                      </TableCell>
                      <TableCell data-testid={`menu-item-image-${item.id}`}>
                        <span className="text-gray-500">
                          {item.image ? "Image" : "No image"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-600 hover:text-gray-800"
                          data-testid={`button-menu-options-${item.id}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination for Menu */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show result:</span>
              <Select value="6">
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
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button className="bg-green-500 hover:bg-green-600" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                20
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tables" className="space-y-6">
          {/* Add Table Button */}
          <div className="flex justify-end">
            <Button 
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50" 
              onClick={() => setShowAddTableModal(true)}
              data-testid="button-add-table"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Table
            </Button>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <Card key={table.id} className="bg-white border border-gray-200 shadow-sm" data-testid={`table-card-${table.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1" data-testid={`table-name-${table.id}`}>
                        {table.tableNumber}
                      </h3>
                      <p className="text-sm text-gray-600" data-testid={`table-branch-${table.id}`}>
                        {table.branch}
                      </p>
                    </div>
                    <Badge 
                      className="bg-green-100 text-green-800 hover:bg-green-200" 
                      data-testid={`table-status-${table.id}`}
                    >
                      {table.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Waiter:</span>
                      <span className="font-medium text-red-500" data-testid={`table-waiter-${table.id}`}>
                        {table.waiter}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Seats:</span>
                      <span className="font-medium text-red-500" data-testid={`table-seats-${table.id}`}>
                        {table.seats}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button 
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm"
                      onClick={() => {
                        setSelectedTable(table);
                        setShowQRModal(true);
                      }}
                      data-testid={`button-view-qr-${table.id}`}
                    >
                      View QR Code
                    </Button>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-600 hover:text-gray-800"
                        data-testid={`button-edit-table-${table.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        data-testid={`button-delete-table-${table.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

      {/* QR Code Modal */}
      {selectedTable && (
        <QRCodeModal
          open={showQRModal}
          onOpenChange={setShowQRModal}
          tableNumber={selectedTable.tableNumber}
          branchName={selectedTable.branch}
        />
      )}

      {/* Add Table Modal */}
      <AddTableModal
        open={showAddTableModal}
        onOpenChange={setShowAddTableModal}
        onAddTable={handleAddTable}
      />

      {/* Add Menu Modal */}
      <AddMenuModal
        isOpen={showAddMenuModal}
        onClose={() => setShowAddMenuModal(false)}
        restaurantId="1"
      />

      {/* Apply Discount Modal */}
      <ApplyDiscountModal
        isOpen={showApplyDiscountModal}
        onClose={() => setShowApplyDiscountModal(false)}
      />
    </div>
  );
}