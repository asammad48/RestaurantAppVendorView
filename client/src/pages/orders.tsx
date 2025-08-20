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
import { SearchTooltip } from "@/components/SearchTooltip";
import { useLocation } from "wouter";
import { locationApi, branchApi } from "@/lib/apiRepository";
// Temporary interface definitions until proper schema is set up
interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  image?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Deal {
  id: string;
  name: string;
  items: string;
  status: string;
  price: string;
}

interface Service {
  id: string;
  name: string;
  type: string;
  description: string;
  price: string;
}

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

// API response interface for locations/tables
interface LocationApiResponse {
  id: number;
  branchId: number;
  locationType: number;
  name: string;
  qrCode: string;
  capacity: number;
}

// Extended interface with branch name
interface TableWithBranchData extends TableData {
  qrCode: string;
  branchName: string;
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
  
  // Pagination states for different tables
  const [menuCurrentPage, setMenuCurrentPage] = useState(1);
  const [categoryCurrentPage, setCategoryCurrentPage] = useState(1);
  const [dealsCurrentPage, setDealsCurrentPage] = useState(1);
  const [menuItemsPerPage] = useState(6);
  const [categoryItemsPerPage] = useState(6);
  const [dealsItemsPerPage] = useState(6);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showApplyDiscountModal, setShowApplyDiscountModal] = useState(false);
  const [showAddDealsModal, setShowAddDealsModal] = useState(false);
  const [showEditDealsModal, setShowEditDealsModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [showAddServicesModal, setShowAddServicesModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showEditTableModal, setShowEditTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableWithBranchData | null>(null);

  // Check URL params for pricing modal trigger
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const showPricing = urlParams.get('showPricing');
    if (showPricing === 'true') {
      setShowPricingModal(true);
    }
  }, []);
  // Get branch details for branch 3
  const { data: branchData } = useQuery({
    queryKey: ["branch", 3],
    queryFn: async () => {
      const response = await branchApi.getBranchById(3);
      if ((response as any).error) {
        throw new Error((response as any).error);
      }
      return (response as any).data;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 2,
  });

  // Real API query for tables from branch 3
  const { data: tablesData, isLoading: isLoadingTables, refetch: refetchTables } = useQuery<LocationApiResponse[]>({
    queryKey: ["tables", "branch", 3],
    queryFn: async () => {
      const response = await locationApi.getLocationsByBranch(3);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data as LocationApiResponse[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  // Transform API data to match UI format with real branch name
  const tables: TableWithBranchData[] = (tablesData || []).map((location) => ({
    id: location.id.toString(),
    tableNumber: `Table ${location.name}`,
    branch: branchData?.name || "Branch", // Use real branch name
    branchName: branchData?.name || "Branch", // For QR modal
    waiter: "Unassigned", // Keep for interface compatibility but won't display
    seats: location.capacity,
    status: location.capacity > 0 ? "Active" : "Inactive" as "Active" | "Inactive",
    qrCode: location.qrCode // Store QR code from API
  }));
  const [menuSearchTerm, setMenuSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [dealsSearchTerm, setDealsSearchTerm] = useState("");
  const [activeMenuTab, setActiveMenuTab] = useState("Menu");
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{type: 'menu' | 'category' | 'deal' | 'table', id: string, name: string} | null>(null);

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
    queryKey: ["menu-items"],
    queryFn: () => fetch("/api/menu-items").then(res => res.json()),
  });

  // Query for categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch("/api/categories").then(res => res.json()),
  });

  // Refresh tables after adding a new one
  const handleRefreshTables = () => {
    refetchTables();
  };

  const handleEditTable = (tableId: string, updates: { seats: number; waiter: string }) => {
    // TODO: Implement table update API call
    console.log('Edit table:', tableId, updates);
    // For now, just refresh the data
    refetchTables();
  };

  const handleDeleteTable = (table: TableData) => {
    setDeleteItem({ type: 'table', id: table.id, name: `Table ${table.tableNumber}` });
    setShowDeleteModal(true);
  };

  const handleEditDeal = (deal: any) => {
    setSelectedDeal(deal);
    setShowEditDealsModal(true);
  };

  const handleDeleteDeal = (deal: any) => {
    setDeleteItem({ type: 'deal', id: deal.id, name: deal.name });
    setShowDeleteModal(true);
  };

  // Filter menu items based on search
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(menuSearchTerm.toLowerCase())
  );

  // Menu pagination
  const menuTotalPages = Math.ceil(filteredMenuItems.length / menuItemsPerPage);
  const menuStartIndex = (menuCurrentPage - 1) * menuItemsPerPage;
  const paginatedMenuItems = filteredMenuItems.slice(menuStartIndex, menuStartIndex + menuItemsPerPage);

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  // Category pagination
  const categoryTotalPages = Math.ceil(filteredCategories.length / categoryItemsPerPage);
  const categoryStartIndex = (categoryCurrentPage - 1) * categoryItemsPerPage;
  const paginatedCategories = filteredCategories.slice(categoryStartIndex, categoryStartIndex + categoryItemsPerPage);

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

  // Deals pagination
  const dealsTotalPages = Math.ceil(filteredDeals.length / dealsItemsPerPage);
  const dealsStartIndex = (dealsCurrentPage - 1) * dealsItemsPerPage;
  const paginatedDeals = filteredDeals.slice(dealsStartIndex, dealsStartIndex + dealsItemsPerPage);

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
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <span>Orders</span>
                      <SearchTooltip
                        placeholder="Search orders, table..."
                        onSearch={setSearchTerm}
                        onClear={() => setSearchTerm('')}
                        currentValue={searchTerm}
                      />
                    </div>
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
          {/* Menu Filter Tabs */}
          <div className="flex items-center justify-between">
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
                      <div className="flex items-center space-x-2">
                        <span>Item Name</span>
                        <SearchTooltip
                          placeholder="Search menu items..."
                          onSearch={setMenuSearchTerm}
                          onClear={() => setMenuSearchTerm('')}
                          currentValue={menuSearchTerm}
                        />
                      </div>
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
                    paginatedMenuItems.map((item) => (
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
                      <div className="flex items-center space-x-2">
                        <span>Category Name</span>
                        <SearchTooltip
                          placeholder="Search categories..."
                          onSearch={setCategorySearchTerm}
                          onClear={() => setCategorySearchTerm('')}
                          currentValue={categorySearchTerm}
                        />
                      </div>
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
                    paginatedCategories.map((category) => (
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

          {/* Menu/Category Pagination */}
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show result:</span>
              <Select defaultValue="6">
                <SelectTrigger className="w-16">
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
                disabled={activeMenuTab === "Menu" ? menuCurrentPage === 1 : categoryCurrentPage === 1}
                onClick={() => {
                  if (activeMenuTab === "Menu") {
                    setMenuCurrentPage(Math.max(1, menuCurrentPage - 1));
                  } else {
                    setCategoryCurrentPage(Math.max(1, categoryCurrentPage - 1));
                  }
                }}
              >
                &lt;
              </Button>
              
              {/* Current page indicator */}
              <Button 
                variant="default" 
                size="sm" 
                className="bg-green-500 hover:bg-green-600"
              >
                {activeMenuTab === "Menu" ? menuCurrentPage : categoryCurrentPage}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={activeMenuTab === "Menu" ? menuCurrentPage === menuTotalPages : categoryCurrentPage === categoryTotalPages}
                onClick={() => {
                  if (activeMenuTab === "Menu") {
                    const maxPage = menuTotalPages || 1;
                    setMenuCurrentPage(Math.min(maxPage, menuCurrentPage + 1));
                  } else {
                    const maxPage = categoryTotalPages || 1;
                    setCategoryCurrentPage(Math.min(maxPage, categoryCurrentPage + 1));
                  }
                }}
              >
                &gt;
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tables" className="space-y-6">
          {/* Tables Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Tables 
              {isLoadingTables && <span className="text-sm text-gray-500 ml-2">(Loading...)</span>}
            </h2>
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
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium text-red-500" data-testid={`table-capacity-${table.id}`}>
                        {table.seats} {table.seats === 1 ? 'person' : 'people'}
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
                        onClick={() => handleDeleteTable(table)}
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
            <div className="flex items-center justify-end">
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
                      <div className="flex items-center space-x-2">
                        <span>Deal Name</span>
                        <SearchTooltip
                          placeholder="Search deals..."
                          onSearch={setDealsSearchTerm}
                          onClear={() => setDealsSearchTerm('')}
                          currentValue={dealsSearchTerm}
                        />
                      </div>
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
                    paginatedDeals.map((deal) => (
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
                              <DropdownMenuItem onClick={() => handleEditDeal(deal)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Deal
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDeal(deal)}>
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
              
              {/* Deals Pagination */}
              <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show result:</span>
                  <Select defaultValue="6">
                    <SelectTrigger className="w-16">
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
                    disabled={dealsCurrentPage === 1}
                    onClick={() => setDealsCurrentPage(Math.max(1, dealsCurrentPage - 1))}
                  >
                    &lt;
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {dealsCurrentPage}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={dealsCurrentPage === dealsTotalPages}
                    onClick={() => {
                      const maxPage = dealsTotalPages || 1;
                      setDealsCurrentPage(Math.min(maxPage, dealsCurrentPage + 1));
                    }}
                  >
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
          branchName={selectedTable.branchName}
          qrCodeBase64={selectedTable.qrCode}
        />
      )}

      {/* Add Table Modal */}
      <AddTableModal
        open={showAddTableModal}
        onOpenChange={setShowAddTableModal}
        branchId={3}
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

      {/* Edit Deals Modal */}
      {selectedDeal && (
        <AddDealsModal
          open={showEditDealsModal}
          onOpenChange={(open) => {
            setShowEditDealsModal(open);
            if (!open) setSelectedDeal(null);
          }}
          restaurantId="1"
          editDeal={selectedDeal}
        />
      )}

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
          title={
            deleteItem.type === 'menu' ? 'Delete Menu Item' :
            deleteItem.type === 'category' ? 'Delete Category' :
            deleteItem.type === 'deal' ? 'Delete Deal' :
            'Delete Table'
          }
          description={`Are you sure you want to delete this ${deleteItem.type}?`}
          itemName={deleteItem.name}
          onConfirm={async () => {
            if (deleteItem.type === 'table') {
              // TODO: Implement delete table API call
              try {
                // await locationApi.deleteLocation(deleteItem.id);
                console.log(`Deleting table: ${deleteItem.name}`);
                // Refresh the tables list after deletion
                refetchTables();
              } catch (error) {
                console.error('Failed to delete table:', error);
              }
            } else {
              // Here you would typically call an API to delete the item
              console.log(`Deleting ${deleteItem.type}: ${deleteItem.name}`);
            }
            setShowDeleteModal(false);
            setDeleteItem(null);
          }}
        />
      )}
    </div>
  );
}