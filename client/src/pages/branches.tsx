import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Plus, Search, ArrowLeft, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BranchCard from "../components/branch-card";
import AddBranchModal from "@/components/add-branch-modal";
import PricingPlansModal from "@/components/pricing-plans-modal";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";
import type { Branch, Entity } from "@/types/schema";
import { branchApi } from "@/lib/apiRepository";

export default function Branches() {
  const [location, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [isTrialUser, setIsTrialUser] = useState(true); // Assume trial for demo
  
  // Extract entity ID from URL query params
  const rawEntityId = new URLSearchParams(window.location.search).get('entityId');
  const entityType = new URLSearchParams(window.location.search).get('entityType');
  
  // Convert frontend entityId format (entity-X) to backend format (X)
  const entityIdStr = rawEntityId?.startsWith('entity-') ? rawEntityId.replace('entity-', '') : rawEntityId;
  const entityId = entityIdStr ? parseInt(entityIdStr, 10) : null;

  const { data: entity } = useQuery<Entity>({
    queryKey: ["entities", entityId],
    enabled: !!entityId,
  });

  const { data: branches = [], isLoading } = useQuery<Branch[]>({
    queryKey: ["branches", entityId],
    queryFn: () => entityId ? branchApi.getBranchesByEntity(entityId) : Promise.resolve([]),
    enabled: !!entityId,
  });

  useEffect(() => {
    if (entity) {
      setCurrentEntity(entity);
    }
  }, [entity]);

  const filteredBranches = Array.isArray(branches) ? branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (branch.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (branch.restaurantType || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleManage = (branch: Branch) => {
    // Always navigate to the management page - pricing modal will show there for trial users
    const managementPath = entityType === "hotel" ? "/hotel-management" : "/restaurant-management";
    const queryParams = new URLSearchParams({
      entityId: rawEntityId || "",
      branchId: branch.id.toString(),
      entityType: entityType || "restaurant",
      showPricing: isTrialUser ? "true" : "false"
    });
    navigate(`${managementPath}?${queryParams.toString()}`);
  };

  const handleAddBranch = () => {
    // Show add branch modal directly - pricing modal should show after branch creation or when accessing management
    setShowAddModal(true);
  };

  const handlePricingModalClose = () => {
    setShowPricingModal(false);
  };

  const handleBack = () => {
    navigate("/entities");
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowEditModal(true);
  };

  const handleDelete = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading branches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Entities
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {currentEntity?.name} Branches
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage branches for your {entityType}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate("/appearance")}
            variant="outline"
            className="w-full md:w-auto"
            data-testid="button-appearance"
          >
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </Button>
          <Button 
            onClick={handleAddBranch}
            className="w-full md:w-auto"
            data-testid="button-add-branch"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
          </div>
          <Input
            placeholder="Search branches by name, type, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white shadow-sm group-focus-within:shadow-md"
            data-testid="input-search-branches"
          />
        </div>
        <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Badge variant="outline" data-testid="badge-total-branches">
            Total Branches: {Array.isArray(branches) ? branches.length : 0}
          </Badge>
          <Badge variant="outline" data-testid="badge-active-branches">
            Active: {Array.isArray(branches) ? branches.filter(b => b.status === "active").length : 0}
          </Badge>
        </div>
      </div>

      {filteredBranches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? "No branches found" : "No branches yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first branch"}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddBranch} data-testid="button-add-first-branch">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Branch
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBranches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onManage={handleManage}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showAddModal && entityId && (
        <AddBranchModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          entityId={entityId}
        />
      )}

      {showEditModal && selectedBranch && (
        <AddBranchModal
          open={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBranch(null);
          }}
          entityId={currentEntity?.id || 0}
        />
      )}

      {showDeleteModal && selectedBranch && (
        <Dialog open={showDeleteModal} onOpenChange={(open) => {
          if (!open) {
            setShowDeleteModal(false);
            setSelectedBranch(null);
          }
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Branch</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedBranch.Name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedBranch(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  // Handle delete logic here
                  console.log("Deleting branch:", selectedBranch.id);
                  setShowDeleteModal(false);
                  setSelectedBranch(null);
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showPricingModal && (
        <PricingPlansModal
          open={showPricingModal}
          onOpenChange={(open) => setShowPricingModal(open)}
          onPlanSelect={(plan) => {
            console.log("Selected plan:", plan);
            setShowPricingModal(false);
            // In real app, you would upgrade user's subscription here
          }}
        />
      )}
    </div>
  );
}