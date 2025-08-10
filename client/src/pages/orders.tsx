import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, ChevronDown, Edit, Trash2, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import QRCodeModal from "@/components/qr-code-modal";
import AddTableModal from "@/components/add-table-modal";
import EditTableModal from "@/components/edit-table-modal";
import AddMenuModal from "@/components/add-menu-modal";
import AddCategoryModal from "@/components/add-category-modal";
import ApplyDiscountModal from "@/components/apply-discount-modal";
import AddDealsModal from "@/components/add-deals-modal";
import AddServicesModal from "@/components/add-services-modal";
import PricingPlansModal from "@/components/pricing-plans-modal";
import SimpleDeleteModal from "@/components/simple-delete-modal";
import { useLocation } from "wouter";
import type { MenuItem, Category, Deal, Service } from "@shared/schema";

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
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showApplyDiscountModal, setShowApplyDiscountModal] = useState(false);
  const [showAddDealsModal, setShowAddDealsModal] = useState(false);
  const [showAddServicesModal, setShowAddServicesModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showEditTableModal, setShowEditTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

  // Check URL params for pricing modal trigger
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const showPricing = urlParams.get('showPricing');
    if (showPricing === 'true') {
      setShowPricingModal(true);
    }
  }, []);
  const [tables, setTables] = useState<TableData[]>(mockTables);
  const [menuSearchTerm, setMenuSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [dealsSearchTerm, setDealsSearchTerm] = useState("");
  const [activeMenuTab, setActiveMenuTab] = useState("Menu");
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{type: 'menu' | 'category', id: string, name: string} | null>(null);

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

  // Query for categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: () => fetch("/api/categories").then(res => res.json()),
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

  const handleEditTable = (tableId: string, updates: { seats: number; waiter: string }) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, seats: updates.seats, waiter: updates.waiter }
        : table
    ));
  };

  // Filter menu items based on search
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(menuSearchTerm.toLowerCase())
  );

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  // Mock deals data
  const mockDeals = [
    { id: "1", name: "Family Feast Deal", items: "1 large Pizza, 6 wings, 2 Drinks, 1 Fries", status: "Active", price: "$10.62" },
    { id: "2", name: "Lunch Special", items: "1 medium Pizza, 1 Drink", status: "Active", price: "$8.50" },
    { id: "3", name: "Weekend Combo", items: "2 large Pizza, 4 wings, 2 Drinks", status: "Inactive", price: "$15.99" },
    { id: "4", name: "Student Deal", items: "1 small Pizza, 1 Drink", status: "Active", price: "$6.25" },
    { id: "5", name: "Party Pack", items: "3 large Pizza, 12 wings, 4 Drinks, 2 Fries", status: "Active", price: "$32.50" },
  ];

  // Filter deals based on search
  const filteredDeals = mockDeals.filter(deal =>
    deal.name.toLowerCase().includes(dealsSearchTerm.toLowerCase()) ||
    deal.items.toLowerCase().includes(dealsSearchTerm.toLowerCase())
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
        

      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5" data-testid="main-tabs">
          <TabsTrigger value="orders" className="bg-gray-100 text-gray-700 data-[state=active]:bg-green-500 data-[state=active]:text-white">
            Orders
          </TabsTrigger>
          <TabsTrigger value="menu" className="bg-gray-100 text-gray-700 data-[state=active]:bg-green-500 data-[state=active]:text-white">Menu</TabsTrigger>
          <TabsTrigger value="tables" className="bg-gray-100 text-gray-700 data-[state=active]:bg-green-500 data-[state=active]:text-white">Tables</TabsTrigger>
          <TabsTrigger value="deals" className="bg-gray-100 text-gray-700 data-[state=active]:bg-green-500 data-[state=active]:text-white">Deals</TabsTrigger>
          <TabsTrigger value="services" className="bg-gray-100 text-gray-700 data-[state=active]:bg-green-500 data-[state=active]:text-white">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {/* Orders Filter Tabs and Search */}
          <div className="flex items-center justify-between gap-4">
            <Tabs value={orderFilter} onValueChange={setOrderFilter}>
              <TabsList data-testid="order-filter-tabs">
                <TabsTrigger value="All Orders">All Orders</TabsTrigger>
                <TabsTrigger value="Preparing">Preparing</TabsTrigger>
                <TabsTrigger value="Delivered">Delivered</TabsTrigger>
                <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Orders Search Input */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders, table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-orders"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2 cursor-pointer group">
                            <span>Orders</span>
                            <Search className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Search by order number or table</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
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
          {/* Menu Filter Tabs and Search */}
          <div className="flex items-center justify-between gap-4">
            <Tabs value={activeMenuTab} onValueChange={setActiveMenuTab}>
              <TabsList className="bg-transparent border-b border-gray-200 rounded-none" data-testid="menu-filter-tabs">
                <TabsTrigger 
                  value="Menu" 
                  className="bg-gray-100 text-gray-700 border-b-2 border-transparent data-[state=active]:bg-gray-100 data-[state=active]:border-green-500 data-[state=active]:text-gray-900 rounded-none"
                >
                  Menu
                </TabsTrigger>
                <TabsTrigger 
                  value="Category"
                  className="bg-gray-100 text-gray-700 border-b-2 border-transparent data-[state=active]:bg-gray-100 data-[state=active]:border-green-500 data-[state=active]:text-gray-900 rounded-none"
                >
                  Category
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={activeMenuTab === "Menu" ? "Search menu items..." : "Search categories..."}
                  value={activeMenuTab === "Menu" ? menuSearchTerm : categorySearchTerm}
                  onChange={(e) => activeMenuTab === "Menu" ? setMenuSearchTerm(e.target.value) : setCategorySearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid={`input-search-${activeMenuTab.toLowerCase()}`}
                />
              </div>
              
              {activeMenuTab === "Menu" ? (
                <>
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
                </>
              ) : (
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => setShowAddCategoryModal(true)}
                  data-testid="button-add-category"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              )}
            </div>
          </div>



          {/* Content Table */}
          <div className="bg-white rounded-lg border">
            {activeMenuTab === "Menu" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2 cursor-pointer group">
                              <span>Item Name</span>
                              <Search className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Search by item name or category</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-gray-600 hover:text-gray-800"
                                data-testid={`button-menu-options-${item.id}`}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedMenuItem(item);
                                setShowEditMenuModal(true);
                              }}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Menu Item
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => {
                                  setDeleteItem({type: 'menu', id: item.id, name: item.name});
                                  setShowDeleteModal(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Menu Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2 cursor-pointer group">
                              <span>Category Name</span>
                              <Search className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Search by category name</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingCategories ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8">
                        Loading categories...
                      </TableCell>
                    </TableRow>
                  ) : filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id} data-testid={`category-row-${category.id}`}>
                        <TableCell className="font-medium" data-testid={`category-name-${category.id}`}>
                          {category.name}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-gray-600 hover:text-gray-800"
                                data-testid={`button-category-options-${category.id}`}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedCategory(category);
                                setShowEditCategoryModal(true);
                              }}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => {
                                  setDeleteItem({type: 'category', id: category.id, name: category.name});
                                  setShowDeleteModal(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Category
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
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
              className="bg-green-500 hover:bg-green-600 text-white" 
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
                        onClick={() => {
                          setSelectedTable(table);
                          setShowEditTableModal(true);
                        }}
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
          {/* Deals Tab Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              {/* Deals Search Input */}
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search deals..."
                  value={dealsSearchTerm}
                  onChange={(e) => setDealsSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-deals"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  onClick={() => setShowApplyDiscountModal(true)}
                >
                  Apply Discount
                </Button>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => setShowAddDealsModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Deals
                </Button>
              </div>
            </div>

            {/* Mock Deals Table */}
            <div className="bg-white rounded-lg border">

              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2 cursor-pointer group">
                              <span>Deal Name</span>
                              <Search className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Search by deal name</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead>Items <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                    <TableHead>Status <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                    <TableHead>Price <ChevronDown className="w-4 h-4 inline ml-1" /></TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No deals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDeals.map((deal) => (
                      <TableRow key={deal.id} data-testid={`deal-row-${deal.id}`}>
                        <TableCell className="font-medium" data-testid={`deal-name-${deal.id}`}>
                          {deal.name}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600" data-testid={`deal-items-${deal.id}`}>
                            {deal.items}
                          </div>
                        </TableCell>
                        <TableCell data-testid={`deal-status-${deal.id}`}>
                          <Badge className={deal.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}>
                            {deal.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium" data-testid={`deal-price-${deal.id}`}>
                          {deal.price}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                data-testid={`button-deal-options-${deal.id}`}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Deal
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Deal
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show result:</span>
                  <Select defaultValue="6">
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    &lt;
                  </Button>
                  <Button variant="default" size="sm" className="bg-green-500 hover:bg-green-600">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">4</Button>
                  <span className="text-sm text-gray-500">20</span>
                  <Button variant="outline" size="sm">
                    &gt;
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="services">
          {/* Services Tab Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => setShowAddServicesModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Services
              </Button>
            </div>

            {/* Mock Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Request for Bottle", type: "Free", description: "Request a water bottle for the table" },
                { name: "Request for Song", type: "Paid - $2.00", description: "Request a specific song to be played" },
                { name: "Table Cleaning", type: "Free", description: "Request additional table cleaning" },
                { name: "Extra Napkins", type: "Free", description: "Request additional napkins" },
                { name: "Birthday Celebration", type: "Paid - $5.00", description: "Special birthday celebration setup" },
                { name: "Photo Service", type: "Paid - $3.00", description: "Professional photo service" },
              ].map((service, index) => (
                <Card key={index} className="bg-white border border-gray-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <Badge 
                        className={service.type.startsWith('Free') 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                        }
                      >
                        {service.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
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

      {/* Edit Table Modal */}
      <EditTableModal
        open={showEditTableModal}
        onOpenChange={setShowEditTableModal}
        table={selectedTable}
        onEditTable={handleEditTable}
      />

      {/* Add Menu Modal */}
      <AddMenuModal
        isOpen={showAddMenuModal}
        onClose={() => setShowAddMenuModal(false)}
        restaurantId="1"
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        restaurantId="1"
      />

      {/* Apply Discount Modal */}
      <ApplyDiscountModal
        isOpen={showApplyDiscountModal}
        onClose={() => setShowApplyDiscountModal(false)}
      />

      {/* Add Deals Modal */}
      <AddDealsModal
        open={showAddDealsModal}
        onOpenChange={setShowAddDealsModal}
        restaurantId="1"
      />

      {/* Add Services Modal */}
      <AddServicesModal
        open={showAddServicesModal}
        onOpenChange={setShowAddServicesModal}
        restaurantId="1"
      />

      {/* Pricing Plans Modal */}
      <PricingPlansModal
        open={showPricingModal}
        onOpenChange={setShowPricingModal}
        onPlanSelect={() => setShowPricingModal(false)}
      />

      {/* Edit Menu Modal - uses same component as Add Menu */}
      {selectedMenuItem && (
        <AddMenuModal
          isOpen={showEditMenuModal}
          onClose={() => {
            setShowEditMenuModal(false);
            setSelectedMenuItem(null);
          }}
          restaurantId="1"
          editMenuItem={selectedMenuItem}
        />
      )}

      {/* Edit Category Modal - uses same component as Add Category */}
      {selectedCategory && (
        <AddCategoryModal
          isOpen={showEditCategoryModal}
          onClose={() => {
            setShowEditCategoryModal(false);
            setSelectedCategory(null);
          }}
          restaurantId="1"
          editCategory={selectedCategory}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <SimpleDeleteModal
          open={showDeleteModal}
          onOpenChange={(open) => {
            setShowDeleteModal(open);
            if (!open) setDeleteItem(null);
          }}
          title={deleteItem.type === 'menu' ? 'Delete Menu Item' : 'Delete Category'}
          description={`Are you sure you want to delete this ${deleteItem.type}?`}
          itemName={deleteItem.name}
          onConfirm={() => {
            // Here you would typically call an API to delete the item
            console.log(`Deleting ${deleteItem.type}: ${deleteItem.name}`);
          }}
        />
      )}
    </div>
  );
}