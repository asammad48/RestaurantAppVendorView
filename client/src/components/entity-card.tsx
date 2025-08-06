import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Edit, Trash2 } from "lucide-react";
import type { Entity } from "@shared/schema";

interface EntityCardProps {
  entity: Entity;
  onEdit: (entity: Entity) => void;
  onDelete: (entity: Entity) => void;
  onManage: (entity: Entity) => void;
}

export default function EntityCard({ entity, onEdit, onDelete, onManage }: EntityCardProps) {
  return (
    <Card className="bg-white border border-gray-100 overflow-hidden" data-testid={`card-entity-${entity.id}`}>
      <div className="relative">
        <img 
          src={entity.profilePicture || "/api/placeholder/400/200"} 
          alt={`${entity.name} profile`} 
          className="w-full h-48 object-cover"
          data-testid={`entity-image-${entity.id}`}
        />
        <div className="absolute top-3 right-3">
          <Badge 
            className={entity.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}
            data-testid={`entity-status-${entity.id}`}
          >
            {entity.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary"
            className="bg-white/90 text-gray-800"
            data-testid={`entity-type-${entity.id}`}
          >
            {entity.entityType.toUpperCase()}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid={`entity-name-${entity.id}`}>
          {entity.name}
        </h3>
        
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            size="sm"
            className="action-button action-button-manage"
            onClick={() => onManage(entity)}
            data-testid={`button-manage-${entity.id}`}
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-sm">Manage</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="action-button action-button-edit"
            onClick={() => onEdit(entity)}
            data-testid={`button-edit-${entity.id}`}
          >
            <Edit className="w-5 h-5 mb-1" />
            <span className="text-sm">Edit</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="action-button action-button-delete"
            onClick={() => onDelete(entity)}
            data-testid={`button-delete-${entity.id}`}
          >
            <Trash2 className="w-5 h-5 mb-1" />
            <span className="text-sm">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}