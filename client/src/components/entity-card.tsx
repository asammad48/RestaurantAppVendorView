import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Edit, Trash2, MapPin, Phone, Mail, Building } from "lucide-react";
import type { Entity } from "@/types/schema";
import { getEntityImageUrl } from "@/lib/imageUtils";

interface EntityCardProps {
  entity: Entity;
  onEdit: (entity: Entity) => void;
  onDelete: (entity: Entity) => void;
  onManage: (entity: Entity) => void;
}

export default function EntityCard({ entity, onEdit, onDelete, onManage }: EntityCardProps) {
  return (
    <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" data-testid={`card-entity-${entity.id}`}>
      <div className="relative">
        <img 
          src={getEntityImageUrl(entity.profilePictureUrl)} 
          alt={`${entity.name} profile`} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`entity-image-${entity.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4">
          <Badge 
            className="bg-[#15803d] hover:bg-[#166534] text-white shadow-lg"
            data-testid={`entity-status-${entity.id}`}
          >
            Active
          </Badge>
        </div>
        <div className="absolute top-4 left-4">
          <Badge 
            variant="secondary"
            className="bg-white/90 text-gray-800 font-medium shadow-lg"
            data-testid={`entity-type-${entity.id}`}
          >
            <Building className="w-3 h-3 mr-1" />
            {(entity.entityType || (entity.type === 1 ? 'Hotel' : 'Restaurant')).toUpperCase()}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg" data-testid={`entity-name-${entity.id}`}>
            {entity.name}
          </h3>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="line-clamp-1">{entity.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Phone className="w-4 h-4 text-[#15803d] flex-shrink-0" />
            <span>{entity.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Building className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className="line-clamp-1">{(entity.entityType || (entity.type === 1 ? 'Hotel' : 'Restaurant'))} Business</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 min-w-0 bg-[#15803d] hover:bg-[#166534] text-white font-medium px-3 py-2"
            onClick={() => onManage(entity)}
            data-testid={`button-manage-${entity.id}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">Manage</span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-0 border border-[#15803d] text-[#15803d] hover:bg-[#15803d]/10 px-3 py-2"
            onClick={() => onEdit(entity)}
            data-testid={`button-edit-${entity.id}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Edit className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">Edit</span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-8 p-0 border border-red-500 text-red-600 hover:bg-red-50"
            onClick={() => onDelete(entity)}
            data-testid={`button-delete-${entity.id}`}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}