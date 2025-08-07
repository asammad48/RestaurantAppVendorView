import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EntityCard from "@/components/entity-card";
import AddEntityModal from "@/components/add-entity-modal";
import EditEntityModal from "@/components/edit-entity-modal";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal";
import PricingPlansModal from "@/components/pricing-plans-modal";
import type { Entity } from "@shared/schema";

export default function Entities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const { data: entities = [], isLoading } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const filteredEntities = entities.filter((entity) =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (entity: Entity) => {
    setSelectedEntity(entity);
    setShowEditModal(true);
  };

  const handleDelete = (entity: Entity) => {
    setSelectedEntity(entity);
    setShowDeleteModal(true);
  };

  const handleManage = (entity: Entity) => {
    // Navigate to branches page for this entity
    window.location.href = `/branches?entityId=${entity.id}&entityType=${entity.entityType}`;
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading entities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Entities
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your hotels and restaurants
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto"
          data-testid="button-add-entity"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entity
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search entities by name, type, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-entities"
          />
        </div>
        <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Badge variant="outline" data-testid="badge-total-entities">
            Total: {entities.length}
          </Badge>
          <Badge variant="outline" data-testid="badge-hotels">
            Hotels: {entities.filter(e => e.entityType === "hotel").length}
          </Badge>
          <Badge variant="outline" data-testid="badge-restaurants">
            Restaurants: {entities.filter(e => e.entityType === "restaurant").length}
          </Badge>
        </div>
      </div>

      {filteredEntities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? "No entities found" : "No entities yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first entity"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowAddModal(true)} data-testid="button-add-first-entity">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Entity
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEntities.map((entity) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onManage={handleManage}
            />
          ))}
        </div>
      )}

      <AddEntityModal
        open={showAddModal}
        onOpenChange={(open) => {
          setShowAddModal(open);
          // Show pricing modal after successfully adding entity
          if (!open && showAddModal) {
            setTimeout(() => setShowPricingModal(true), 500);
          }
        }}
      />

      <PricingPlansModal
        open={showPricingModal}
        onOpenChange={setShowPricingModal}
        onPlanSelect={(plan) => {
          console.log(`Selected plan: ${plan}`);
          // Handle plan selection logic here
        }}
      />

      {selectedEntity && (
        <>
          <EditEntityModal
            entity={selectedEntity}
            open={showEditModal}
            onOpenChange={setShowEditModal}
          />
          <DeleteConfirmationModal
            entity={selectedEntity}
            open={showDeleteModal}
            onOpenChange={setShowDeleteModal}
          />
        </>
      )}
    </div>
  );
}