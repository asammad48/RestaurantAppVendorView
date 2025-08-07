import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BranchCard from "../components/branch-card";
import AddBranchModal from "@/components/add-branch-modal";
import PricingPlansModal from "@/components/pricing-plans-modal";
import type { Branch, Entity } from "@shared/schema";

export default function Branches() {
  const [location, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [isTrialUser, setIsTrialUser] = useState(true); // Assume trial for demo
  
  // Extract entity ID from URL query params
  const entityId = new URLSearchParams(window.location.search).get('entityId');
  const entityType = new URLSearchParams(window.location.search).get('entityType');

  const { data: entity } = useQuery<Entity>({
    queryKey: ["/api/entities", entityId],
    enabled: !!entityId,
  });

  const { data: branches = [], isLoading } = useQuery<Branch[]>({
    queryKey: ["/api/branches", entityId],
    enabled: !!entityId,
  });

  useEffect(() => {
    if (entity) {
      setCurrentEntity(entity);
    }
  }, [entity]);

  const filteredBranches = Array.isArray(branches) ? branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.restaurantType.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleManage = (branch: Branch) => {
    // Check if user is in trial period before navigating
    if (isTrialUser) {
      setShowPricingModal(true);
      return;
    }
    
    // Navigate to the appropriate management page based on entity type
    navigate(entityType === "hotel" ? "/hotel-management" : "/restaurant-management");
  };

  const handleAddBranch = () => {
    // Check if user is in trial period before showing add modal
    if (isTrialUser) {
      setShowPricingModal(true);
      return;
    }
    
    setShowAddModal(true);
  };

  const handlePricingModalClose = () => {
    setShowPricingModal(false);
  };

  const handleBack = () => {
    navigate("/entities");
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
        <Button 
          onClick={handleAddBranch}
          className="w-full md:w-auto"
          data-testid="button-add-branch"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search branches by name, type, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-branches"
          />
        </div>
        <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Badge variant="outline" data-testid="badge-total-branches">
            Total Branches: {branches.length}
          </Badge>
          <Badge variant="outline" data-testid="badge-active-branches">
            Active: {branches.filter(b => b.status === "active").length}
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
            />
          ))}
        </div>
      )}

      {showAddModal && currentEntity && (
        <AddBranchModal
          open={showAddModal}
          onOpenChange={(open) => setShowAddModal(open)}
          restaurantId={currentEntity.id}
        />
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