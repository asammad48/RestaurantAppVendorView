import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import UsersTable from "@/components/users-table";
import AddUserModal from "@/components/add-user-modal";
import DeleteUserModal from "@/components/delete-user-modal";
import { PaginationRequest, PaginationResponse, DEFAULT_PAGINATION_CONFIG, buildPaginationQuery } from "@/types/pagination";
import { UserListItem } from "@/types/user";

export default function Users() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_CONFIG.defaultPageSize);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: usersResponse, isLoading } = useQuery<PaginationResponse<UserListItem>>({
    queryKey: ["users", currentPage, pageSize, nameSearchTerm],
    queryFn: async () => {
      const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
      const paginationRequest: PaginationRequest = {
        pageNumber: currentPage,
        pageSize: pageSize,
        sortBy: 'name',
        isAscending: true,
        searchTerm: nameSearchTerm || undefined,
      };

      const queryString = buildPaginationQuery(paginationRequest);
      const response = await fetch(`https://l5246g5z-7261.inc1.devtunnels.ms/api/User/users?${queryString}`, {
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return response.json();
    },
  });

  const users = usersResponse?.items || [];
  const totalPages = usersResponse?.totalPages || 0;

  const handleEditUser = (user: UserListItem) => {
    setEditingUser(user);
    setIsAddUserModalOpen(true);
  };

  const handleDeleteUser = (user: UserListItem) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
      const response = await fetch(`https://l5246g5z-7261.inc1.devtunnels.ms/api/User/user/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`);
      }

      // Show success toast
      toast({
        title: "Success",
        description: `User "${userToDelete.name}" has been deleted successfully.`,
      });

      // Refresh the users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading-spinner" data-testid="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900" data-testid="page-title">User Management</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant users</p>
        </div>
        <Button 
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
          data-testid="button-add-user"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <UsersTable
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={pageSize}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setPageSize}
        onNameSearch={setNameSearchTerm}
        onNameSearchClear={() => setNameSearchTerm("")}
        nameSearchValue={nameSearchTerm}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => {
          setIsAddUserModalOpen(false);
          setEditingUser(null);
        }}
        editingUser={editingUser}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }
        }}
        user={userToDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}