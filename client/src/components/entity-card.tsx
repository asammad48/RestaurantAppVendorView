import { Building2, Hotel, MapPin, Phone, Settings, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import type { Entity } from "@shared/schema";

interface EntityCardProps {
  entity: Entity;
  onEdit: (entity: Entity) => void;
  onDelete: (entity: Entity) => void;
  onManage: (entity: Entity) => void;
}

export default function EntityCard({ entity, onEdit, onDelete, onManage }: EntityCardProps) {
  const isHotel = entity.entityType === "hotel";

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800" data-testid={`card-entity-${entity.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isHotel ? (
                <Hotel className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <Building2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              )}
              <Badge 
                variant={isHotel ? "secondary" : "default"}
                className="text-xs"
                data-testid={`badge-type-${entity.id}`}
              >
                {entity.entityType.toUpperCase()}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white leading-tight" data-testid={`text-name-${entity.id}`}>
              {entity.name}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-menu-${entity.id}`}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onManage(entity)} data-testid={`menu-manage-${entity.id}`}>
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(entity)} data-testid={`menu-edit-${entity.id}`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(entity)} 
                className="text-red-600 dark:text-red-400"
                data-testid={`menu-delete-${entity.id}`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={entity.profilePicture}
            alt={entity.name}
            className="w-full h-full object-cover"
            data-testid={`img-profile-${entity.id}`}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate" data-testid={`text-address-${entity.id}`}>
              {entity.address}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
            <span data-testid={`text-phone-${entity.id}`}>
              {entity.phone}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onManage(entity)}
            className="flex-1 text-sm"
            data-testid={`button-manage-${entity.id}`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onEdit(entity)}
            className="flex-1 text-sm"
            data-testid={`button-edit-${entity.id}`}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(entity)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            data-testid={`button-delete-${entity.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}