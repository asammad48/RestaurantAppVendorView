import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, ArrowUpDown, Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { SearchTooltip } from "@/components/SearchTooltip";
import { FilterTooltip } from "@/components/FilterTooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  assignedTable: string | null;
  assignedBranch: string | null;
  status: string;
}

interface UsersTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onNameSearch?: (value: string) => void;
  onNameSearchClear?: () => void;
  onRoleFilter?: (roles: string[]) => void;
  onRoleFilterClear?: () => void;
  onBranchFilter?: (branch: string) => void;
  onBranchFilterClear?: () => void;
  onStatusFilter?: (statuses: string[]) => void;
  onStatusFilterClear?: () => void;
  nameSearchValue?: string;
  roleFilterValues?: string[];
  branchFilterValue?: string;
  statusFilterValues?: string[];
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
}

export default function UsersTable({
  users,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onNameSearch = () => {},
  onNameSearchClear = () => {},
  onRoleFilter = () => {},
  onRoleFilterClear = () => {},
  onBranchFilter = () => {},
  onBranchFilterClear = () => {},
  onStatusFilter = () => {},
  onStatusFilterClear = () => {},
  nameSearchValue = '',
  roleFilterValues = [],
  branchFilterValue = '',
  statusFilterValues = [],
  onEditUser = () => {},
  onDeleteUser = () => {},
}: UsersTableProps) {
  
  const roleOptions = [
    { value: 'manager', label: 'Manager' },
    { value: 'waiter', label: 'Waiter' },
    { value: 'chef', label: 'Chef' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];
  return (
    <Card className="bg-white border border-gray-100 overflow-hidden" data-testid="users-table-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" data-testid="users-table">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-testid="header-name">
                <div className="flex items-center space-x-2">
                  <span>Name</span>
                  <SearchTooltip
                    placeholder="Search by name..."
                    onSearch={onNameSearch}
                    onClear={onNameSearchClear}
                    currentValue={nameSearchValue}
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-testid="header-role">
                <div className="flex items-center space-x-2">
                  <span>Role</span>
                  <FilterTooltip
                    filterType="checkbox"
                    title="Role"
                    options={roleOptions}
                    onApply={onRoleFilter}
                    onClear={onRoleFilterClear}
                    currentValue={roleFilterValues}
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-testid="header-table">
                Assign Table
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-testid="header-branch">
                <div className="flex items-center space-x-2">
                  <span>Assign Branch</span>
                  <FilterTooltip
                    filterType="input"
                    title="Branch"
                    placeholder="Filter by branch..."
                    onApply={onBranchFilter}
                    onClear={onBranchFilterClear}
                    currentValue={branchFilterValue}
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-testid="header-status">
                <div className="flex items-center space-x-2">
                  <span>Status</span>
                  <FilterTooltip
                    filterType="checkbox"
                    title="Status"
                    options={statusOptions}
                    onApply={onStatusFilter}
                    onClear={onStatusFilterClear}
                    currentValue={statusFilterValues}
                  />
                </div>
              </th>

              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" data-testid="header-actions">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="table-row" data-testid={`user-row-${user.id}`}>
                <td className="px-6 py-4 whitespace-nowrap" data-testid={`user-name-${user.id}`}>
                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap" data-testid={`user-role-${user.id}`}>
                  <div className="text-sm text-gray-900 capitalize">{user.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap" data-testid={`user-table-${user.id}`}>
                  <div className="text-sm text-gray-900">{user.assignedTable || "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap" data-testid={`user-branch-${user.id}`}>
                  <div className="text-sm text-gray-900">{user.assignedBranch || "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap" data-testid={`user-status-${user.id}`}>
                  <Badge 
                    className={user.status === 'active' ? 'status-active' : 'status-inactive'}
                  >
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-800"
                        data-testid={`user-actions-${user.id}`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEditUser(user)}
                        data-testid={`edit-user-${user.id}`}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDeleteUser(user)}
                        data-testid={`delete-user-${user.id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Pagination */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6" data-testid="table-pagination">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Show result:</span>
            <select 
              className="border border-gray-300 rounded px-3 py-1 text-sm"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              data-testid="select-table-items-per-page"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>
          
          <div className="pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              data-testid="button-table-prev"
            >
              ←
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className={currentPage === page ? "bg-green-500 hover:bg-green-600" : ""}
                  onClick={() => onPageChange(page)}
                  data-testid={`button-table-page-${page}`}
                >
                  {page}
                </Button>
              );
            })}
            
            {totalPages > 5 && (
              <>
                <span className="px-3 py-1 text-gray-500">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  data-testid={`button-table-page-${totalPages}`}
                >
                  {totalPages}
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              data-testid="button-table-next"
            >
              →
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
