import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersTable from "@/components/users-table";
import AddUserModal from "@/components/add-user-modal";

const roleFilters = [
  { value: "all", label: "All Users" },
  { value: "waiter", label: "Waiter" },
  { value: "manager", label: "Manager" },
  { value: "chef", label: "Chefs" },
];

export default function Users() {
  const [activeRole, setActiveRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { data: users, isLoading } = useQuery({
    queryKey: activeRole === "all" ? ["/api/users"] : ["/api/users", { role: activeRole }],
  });

  const filteredUsers = Array.isArray(users) 
    ? users.filter((user: any) =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading-spinner" data-testid="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="users-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800" data-testid="page-title">Users</h2>
        <Button 
          className="bg-green-500 hover:bg-green-600" 
          onClick={() => {
            setEditingUser(null);
            setIsAddUserModalOpen(true);
          }}
          data-testid="button-add-user"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Role Filters */}
      <Tabs value={activeRole} onValueChange={setActiveRole} data-testid="role-filters">
        <TabsList className="bg-white border border-gray-200">
          {roleFilters.map((filter) => (
            <TabsTrigger
              key={filter.value}
              value={filter.value}
              className={`data-[state=active]:bg-green-500 data-[state=active]:text-white`}
              data-testid={`filter-${filter.value}`}
            >
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search and Filters Bar */}
      <div className="flex items-center justify-between">
        <div className="search-input max-w-lg">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-users"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" data-testid="button-filters">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" data-testid="button-date-range">
            <Calendar className="w-4 h-4 mr-2" />
            April 11 - April 24
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable 
        users={paginatedUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(newItemsPerPage) => {
          setItemsPerPage(newItemsPerPage);
          setCurrentPage(1);
        }}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => {
          setIsAddUserModalOpen(false);
          setEditingUser(null);
        }}
        editingUser={editingUser}
      />
    </div>
  );
}
