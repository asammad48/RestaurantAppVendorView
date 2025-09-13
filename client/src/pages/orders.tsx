import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, ChevronDown, Edit, Trash2, Plus, MoreHorizontal, Eye, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import QRCodeModal from "@/components/qr-code-modal";
import AddTableModal from "@/components/add-table-modal";
import EditTableModal from "@/components/edit-table-modal";
import AddMenuModal from "@/components/add-menu-modal";
import AddCategoryModal from "@/components/add-category-modal";
import AddSubMenuModal from "@/components/add-submenu-modal";
import ApplyDiscountModal from "@/components/apply-discount-modal";
import AddDealsModal from "@/components/add-deals-modal";
import AddServicesModal from "@/components/add-services-modal";
import AddDiscountModal from "@/components/add-discount-modal";
import PricingPlansModal from "@/components/pricing-plans-modal";
import SimpleDeleteModal from "@/components/simple-delete-modal";
import ViewMenuModal from "@/components/view-menu-modal";
import ViewDealsModal from "@/components/view-deals-modal";
import OrderDetailModal from "@/components/order-detail-modal";
import { SearchTooltip } from "@/components/SearchTooltip";
import { useLocation } from "wouter";
import { locationApi, branchApi, dealsApi, discountsApi, apiRepository, servicesApi, ordersApi } from "@/lib/apiRepository";
import { useBranchCurrency } from "@/hooks/useBranchCurrency";
import type { Branch } from "@/types/schema";
// Use MenuItem and MenuCategory from schema
import type { MenuItem, MenuCategory, SubMenu, Deal, Discount, BranchService, DetailedOrder } from "@/types/schema";
import { PaginationRequest, PaginationResponse, DEFAULT_PAGINATION_CONFIG, buildPaginationQuery } from "@/types/pagination";

// Deal interface is now imported from schema

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
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Extract branchId from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const branchId = parseInt(urlParams.get('branchId') || '1', 10); // Get branchId from URL, no hardcoded default
  
  // Use branch currency for proper formatting
  const { formatPrice: formatBranchPrice, getCurrencySymbol } = useBranchCurrency(branchId);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [orderFilter, setOrderFilter] = useState("All Orders");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, orderFilter, itemsPerPage]);
  
  // Pagination states for different tables
  const [menuCurrentPage, setMenuCurrentPage] = useState(1);
  const [categoryCurrentPage, setCategoryCurrentPage] = useState(1);
  const [subMenuCurrentPage, setSubMenuCurrentPage] = useState(1);
  const [dealsCurrentPage, setDealsCurrentPage] = useState(1);
  const [discountsCurrentPage, setDiscountsCurrentPage] = useState(1);
  const [menuItemsPerPage] = useState(6);
  const [categoryItemsPerPage] = useState(6);
  const [subMenuItemsPerPage] = useState(6);
  const [dealsItemsPerPage, setDealsItemsPerPage] = useState(DEFAULT_PAGINATION_CONFIG.defaultPageSize);
  const [discountsItemsPerPage, setDiscountsItemsPerPage] = useState(DEFAULT_PAGINATION_CONFIG.defaultPageSize);
  const [discountsSearchTerm, setDiscountsSearchTerm] = useState("");
  const [subMenuSearchTerm, setSubMenuSearchTerm] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSubMenuModal, setShowAddSubMenuModal] = useState(false);
  const [editSubMenu, setEditSubMenu] = useState<SubMenu | null>(null);
  const [showApplyDiscountModal, setShowApplyDiscountModal] = useState(false);
  const [showAddDealsModal, setShowAddDealsModal] = useState(false);
  const [showEditDealsModal, setShowEditDealsModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [showEditDiscountModal, setShowEditDiscountModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);
  const [showAddServicesModal, setShowAddServicesModal] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState("orders");

  // Query for branch services with real API
  // LAZY LOADING: Only fetch when services tab is active
  const { data: branchServices = [], isLoading: isLoadingBranchServices, refetch: refetchBranchServices } = useQuery<BranchService[]>({
    queryKey: ['branch-services', branchId],
    queryFn: async (): Promise<BranchService[]> => {
      return await servicesApi.getBranchServices(branchId);
    },
    enabled: activeMainTab === "services", // LAZY LOADING: Only fetch when services tab is active
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showEditTableModal, setShowEditTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableWithBranchData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null);
  const [showViewOrderModal, setShowViewOrderModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Check URL params for pricing modal trigger
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const showPricing = urlParams.get('showPricing');
    if (showPricing === 'true') {
      setShowPricingModal(true);
    }
  }, []);
  // Get branch details for the current branch
  const { data: branchData } = useQuery<Branch>({
    queryKey: ["branch", branchId],
    queryFn: async () => {
      const response = await branchApi.getBranchById(branchId);
      // getBranchById returns the data directly
      return response as Branch;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 2,
  });

  // Real API query for tables from the current branch
  // LAZY LOADING: Only fetch when tables tab is active
  const { data: tablesData, isLoading: isLoadingTables, refetch: refetchTables } = useQuery<LocationApiResponse[]>({
    queryKey: ["tables", "branch", branchId],
    queryFn: async () => {
      const response = await locationApi.getLocationsByBranch(branchId);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data as LocationApiResponse[];
    },
    enabled: activeMainTab === "tables", // LAZY LOADING: Only fetch when tables tab is active
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  // Transform API data to match UI format with real branch name from API
  const tables: TableWithBranchData[] = (tablesData || []).map((location) => ({
    id: location.id.toString(),
    tableNumber: `Table ${location.name}`,
    branch: branchData?.name || "Loading branch...", // Use actual branch name from API (Rich pakistan)
    branchName: branchData?.name || "Loading branch...", // For QR modal - use actual API branch name (Rich pakistan)
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
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState<SubMenu | null>(null);
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);
  const [showViewMenuModal, setShowViewMenuModal] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<number | null>(null);
  const [showViewDealsModal, setShowViewDealsModal] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showEditSubMenuModal, setShowEditSubMenuModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{type: 'menu' | 'category' | 'submenu' | 'deal' | 'table' | 'discount', id: string, name: string} | null>(null);

  // Query for orders using real API with pagination (following template pattern)
  const { data: ordersResponse, isLoading: isLoadingOrders, refetch: refetchOrders } = useQuery({
    queryKey: [`/api/orders/branch/${branchId}`, currentPage, itemsPerPage, searchTerm, orderFilter],
    queryFn: async (): Promise<PaginationResponse<DetailedOrder>> => {
      // Build search term that includes status filter
      const effectiveSearchTerm = orderFilter === "All Orders" ? searchTerm : 
        searchTerm ? `${searchTerm} ${orderFilter}` : orderFilter;
      
      const result = await ordersApi.getOrdersByBranch(
        branchId,
        currentPage,
        itemsPerPage,
        'createdAt', // Sort by creation date
        false, // Descending order (newest first)
        effectiveSearchTerm
      );
      
      if (!result) {
        throw new Error('No data returned from orders API');
      }
      
      return result;
    },
    enabled: activeMainTab === "orders", // Only fetch when orders tab is active
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Query for order status types from API
  const { data: orderStatusTypes = [], isLoading: isLoadingStatusTypes, error: statusTypesError } = useQuery({
    queryKey: ['order-status-types'],
    queryFn: async (): Promise<Array<{id: number, name: string}>> => {
      return await ordersApi.getOrderStatusTypes();
    },
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes since this rarely changes
  });

  // Helper functions for date formatting - properly convert UTC to local time
  const formatOrderDate = (dateString: string) => {
    try {
      // Use formatBranchTime to convert UTC to local time, then extract date part
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        timeZone: userTimeZone,
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting order date:', error);
      // Fallback to basic date formatting
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatOrderTime = (dateString: string) => {
    try {
      // Use user's timezone to display time correctly
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const date = new Date(dateString);
      return date.toLocaleTimeString(undefined, {
        timeZone: userTimeZone,
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting order time:', error);
      // Fallback to basic time formatting
      const date = new Date(dateString);
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Use DetailedOrders directly for the table to access createdAt
  const apiOrders = (ordersResponse as PaginationResponse<DetailedOrder>)?.items || [];
  const paginatedOrders = apiOrders; // Use DetailedOrder directly

  // Use pagination data from API response with proper typing
  const paginationData = ordersResponse as PaginationResponse<DetailedOrder>;
  const totalPages = paginationData?.totalPages || 0;
  const totalCount = paginationData?.totalCount || 0;
  const hasNext = paginationData?.hasNext || false;
  const hasPrevious = paginationData?.hasPrevious || false;

  // Helper functions for getting payment and status from DetailedOrder
  const getPaymentStatus = (order: DetailedOrder) => {
    // Assuming paid if total amount is greater than 0, adjust based on actual API structure
    return order.totalAmount > 0 ? "Paid" : "Unpaid";
  };

  const getOrderStatus = (order: DetailedOrder) => {
    // Map API orderStatus to UI status format
    const status = order.orderStatus?.toLowerCase();
    if (status?.includes('prepar')) return 'Preparing';
    if (status?.includes('deliver') || status?.includes('complet') || status?.includes('served')) return 'Delivered';
    if (status?.includes('cancel')) return 'Cancelled';
    return order.orderStatus || 'Preparing';
  };

  const getOrderItems = (order: DetailedOrder) => {
    return (order.orderItems?.length || 0) + (order.orderPackages?.length || 0);
  };

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
  // Query for menu items with real API and pagination support using generic API repository
  // LAZY LOADING: Only fetch when menu tab is active
  const { data: menuItemsResponse, isLoading: isLoadingMenu, refetch: refetchMenuItems } = useQuery({
    queryKey: [`menu-items-branch-${branchId}`, menuCurrentPage, menuSearchTerm, menuItemsPerPage],
    queryFn: async () => {
      const response = await apiRepository.call<{
        items: MenuItem[];
        pageNumber: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasPrevious: boolean;
        hasNext: boolean;
      }>(
        'getMenuItemsByBranch',
        'GET',
        undefined,
        {
          PageNumber: menuCurrentPage.toString(),
          PageSize: menuItemsPerPage.toString(),
          SortBy: 'name',
          IsAscending: 'true',
          ...(menuSearchTerm && { SearchTerm: menuSearchTerm })
        },
        true,
        { branchId }
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
    enabled: activeMainTab === "menu", // LAZY LOADING: Only fetch when menu tab is active
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const menuItems = menuItemsResponse?.items || [];
  const menuTotalCount = menuItemsResponse?.totalCount || 0;
  const menuTotalPages = menuItemsResponse?.totalPages || 0;
  const menuHasNext = menuItemsResponse?.hasNext || false;
  const menuHasPrevious = menuItemsResponse?.hasPrevious || false;


  // Query for submenus with real API and pagination support using generic API repository
  // LAZY LOADING: Only fetch when menu tab is active
  const { data: subMenusResponse, isLoading: isLoadingSubMenus, refetch: refetchSubMenus } = useQuery({
    queryKey: [`submenus-branch-${branchId}`, subMenuCurrentPage, subMenuSearchTerm, subMenuItemsPerPage],
    queryFn: async () => {
      const response = await apiRepository.call<{
        items: SubMenu[];
        pageNumber: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasPrevious: boolean;
        hasNext: boolean;
      }>(
        'getSubMenusByBranch',
        'GET',
        undefined,
        {
          PageNumber: subMenuCurrentPage.toString(),
          PageSize: subMenuItemsPerPage.toString(),
          SortBy: 'name',
          IsAscending: 'true',
          ...(subMenuSearchTerm && { SearchTerm: subMenuSearchTerm })
        },
        true,
        { branchId }
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
    enabled: activeMainTab === "menu", // LAZY LOADING: Only fetch when menu tab is active
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const subMenus = subMenusResponse?.items || [];
  const subMenuTotalPages = subMenusResponse?.totalPages || 1;

  // Fetch ALL submenu items for the branch to create a lookup map for deal display
  const { data: allSubMenuItems = [] } = useQuery({
    queryKey: [`all-submenus-branch-${branchId}`],
    queryFn: async () => {
      const response = await apiRepository.call<{
        items: SubMenu[];
        pageNumber: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasPrevious: boolean;
        hasNext: boolean;
      }>(
        'getSubMenusByBranch',
        'GET',
        undefined,
        {
          PageNumber: '1',
          PageSize: '1000', // Get all items for lookup
          SortBy: 'name',
          IsAscending: 'true'
        },
        true,
        { branchId }
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data?.items || [];
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes since this is for lookup only
  });

  // Create a lookup map for submenu item names
  const subMenuItemsLookup = new Map(
    allSubMenuItems.map(item => [item.id, item.name])
  );

  // Stock status update mutation
  const updateStockStatusMutation = useMutation({
    mutationFn: async ({ itemId, isOutOfStock }: { itemId: number; isOutOfStock: boolean }) => {
      const response = await apiRepository.call(
        'updateMenuItemStockStatus',
        'PUT',
        { isOutOfStock: !isOutOfStock }, // Toggle the current status
        undefined,
        true,
        { id: itemId }
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate menu items query to refresh data and show updated stock status
      queryClient.invalidateQueries({ queryKey: [`menu-items-branch-${branchId}`] });
      
      // Show success message
      toast({
        title: "Stock Status Updated",
        description: `Menu item stock status has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update stock status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handler function for updating stock status
  const handleUpdateStockStatus = (itemId: number, currentStockStatus: boolean) => {
    updateStockStatusMutation.mutate({ 
      itemId, 
      isOutOfStock: currentStockStatus 
    });
  };

  // Query for categories with real API and pagination support using generic API repository
  // LAZY LOADING: Only fetch when menu tab is active
  const { data: categoriesResponse, isLoading: isLoadingCategories, refetch: refetchCategories } = useQuery({
    queryKey: [`menu-categories-branch-${branchId}`, categoryCurrentPage, categorySearchTerm, categoryItemsPerPage],
    queryFn: async () => {
      const response = await apiRepository.call<{
        items: MenuCategory[];
        pageNumber: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasPrevious: boolean;
        hasNext: boolean;
      }>(
        'getMenuCategoriesByBranch',
        'GET',
        undefined,
        {
          PageNumber: categoryCurrentPage.toString(),
          PageSize: categoryItemsPerPage.toString(),
          SortBy: 'name',
          IsAscending: 'true',
          ...(categorySearchTerm && { SearchTerm: categorySearchTerm })
        },
        true,
        { branchId }
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
    enabled: activeMainTab === "menu", // LAZY LOADING: Only fetch when menu tab is active
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const categories = categoriesResponse?.items || [];
  const categoryTotalPages = categoriesResponse?.totalPages || 1;

  // Refresh tables after adding a new one
  const handleRefreshTables = () => {
    refetchTables();
  };

  // Removed handleEditTable function - now handled directly in the modal

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

  // Discount handlers
  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setShowEditDiscountModal(true);
  };

  const handleDeleteDiscount = (discount: Discount) => {
    setDeleteItem({ type: 'discount', id: discount.id.toString(), name: discount.name });
    setShowDeleteModal(true);
  };

  // Filter menu items based on search
  // Since API handles filtering and pagination, we use the items directly
  const filteredMenuItems = menuItems;
  const paginatedMenuItems = menuItems;

  // Categories are already filtered and paginated by the API
  const filteredCategories = categories;
  const paginatedCategories = categories;


  // Query for deals with real API and pagination support using generic API repository
  // LAZY LOADING: Only fetch when deals tab is active
  const { data: dealsResponse, isLoading: dealsLoading, refetch: refetchDeals } = useQuery({
    queryKey: [`deals-branch-${branchId}`, dealsCurrentPage, dealsSearchTerm, dealsItemsPerPage],
    queryFn: async () => {
      const response = await apiRepository.call<{
        items: Deal[];
        pageNumber: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasPrevious: boolean;
        hasNext: boolean;
      }>(
        'getDealsByBranch',
        'GET',
        undefined,
        {
          PageNumber: dealsCurrentPage.toString(),
          PageSize: dealsItemsPerPage.toString(),
          SortBy: 'name',
          IsAscending: 'true',
          ...(dealsSearchTerm && { SearchTerm: dealsSearchTerm })
        },
        true,
        { branchId }
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
    enabled: activeMainTab === "deals", // LAZY LOADING: Only fetch when deals tab is active
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const deals = dealsResponse?.items || [];
  const dealsTotalCount = dealsResponse?.totalCount || 0;
  const dealsTotalPages = dealsResponse?.totalPages || 0;
  const dealsHasNext = dealsResponse?.hasNext || false;
  const dealsHasPrevious = dealsResponse?.hasPrevious || false;

  // Fetch discounts with pagination using Generic API repository  
  // LAZY LOADING: Only fetch when discounts tab is active
  const { data: discountsResponse, isLoading: discountsLoading, refetch: refetchDiscounts } = useQuery<PaginationResponse<Discount>>({
    queryKey: [`discounts-branch-${branchId}`, discountsCurrentPage, discountsItemsPerPage, discountsSearchTerm],
    queryFn: async () => {
      const response = await discountsApi.getDiscountsByBranch(branchId, {
        PageNumber: discountsCurrentPage,
        PageSize: discountsItemsPerPage,
        SortBy: 'name',
        IsAscending: true,
        ...(discountsSearchTerm && { SearchTerm: discountsSearchTerm })
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data as PaginationResponse<Discount>;
    },
    enabled: activeMainTab === "discounts", // LAZY LOADING: Only fetch when discounts tab is active
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const discounts = discountsResponse?.items || [];
  const discountsTotalCount = discountsResponse?.totalCount || 0;
  const discountsTotalPages = discountsResponse?.totalPages || 0;
  const discountsHasNext = discountsResponse?.hasNext || false;
  const discountsHasPrevious = discountsResponse?.hasPrevious || false;

  // This local formatPrice function is no longer used - replaced with formatBranchPrice from useBranchCurrency

  return (
    <div className="container mx-auto px-4 py-8 space-y-6" data-testid="orders-page">
      {/* Header with Back Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" data-testid="link-back">
            <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        </div>
      </div>

      {/* Orders Tab Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({totalCount} total)
            </span>
          </div>
        </div>

        {/* Orders Table */}
        {isLoadingOrders ? (
          <div className="text-center py-8" data-testid="loading-orders">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : ordersError ? (
          <div className="text-center py-8 text-red-600" data-testid="error-orders">
            <p>Error loading orders: {(ordersError as Error).message}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                    <TableCell className="font-medium" data-testid={`text-order-number-${order.id}`}>
                      #{order.id}
                    </TableCell>
                    <TableCell data-testid={`text-items-count-${order.id}`}>
                      {order.items?.length || 0} items
                    </TableCell>
                    <TableCell data-testid={`text-order-date-${order.id}`}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell data-testid={`text-payment-method-${order.id}`}>
                      {order.paymentMethod || 'N/A'}
                    </TableCell>
                    <TableCell data-testid={`text-order-status-${order.id}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell data-testid={`text-order-total-${order.id}`}>
                      {formatBranchPrice(order.totalAmount || 0)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        data-testid={`button-view-order-${order.id}`}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!hasPrevious}
                  data-testid="button-previous-page"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!hasNext}
                  data-testid="button-next-page"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} orders
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        formatPrice={formatBranchPrice}
      />
    </div>
  );
}
