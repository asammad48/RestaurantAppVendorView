import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Edit, Trash2, MapPin, Phone, Mail, Building } from "lucide-react";
import type { Entity } from "@shared/schema";

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
          src={entity.profilePicture || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
          alt={`${entity.name} profile`} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`entity-image-${entity.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4">
          <Badge 
            className={entity.status === 'active' 
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg' 
              : 'bg-gray-500 hover:bg-gray-600 text-white shadow-lg'
            }
            data-testid={`entity-status-${entity.id}`}
          >
            {entity.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <div className="absolute top-4 left-4">
          <Badge 
            variant="secondary"
            className="bg-white/90 text-gray-800 font-medium shadow-lg"
            data-testid={`entity-type-${entity.id}`}
          >
            <Building className="w-3 h-3 mr-1" />
            {entity.entityType.toUpperCase()}
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
            <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{entity.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Building className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className="line-clamp-1">{entity.entityType.charAt(0).toUpperCase() + entity.entityType.slice(1)} Business</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:ring-4 hover:ring-green-300/50 ripple-effect relative overflow-hidden"
            onClick={() => onManage(entity)}
            data-testid={`button-manage-${entity.id}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 shimmer-effect"></div>
            <Settings className="w-4 h-4 mr-2 animate-pulse relative z-10" />
            <span className="relative z-10 whitespace-nowrap">Manage</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-2 border-emerald-400 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-green-100 hover:border-emerald-500 hover:shadow-xl transform hover:scale-110 transition-all duration-300 hover:ring-4 hover:ring-emerald-300/50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-900/30 pulse-grow relative overflow-hidden group"
            onClick={() => onEdit(entity)}
            data-testid={`button-edit-${entity.id}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Edit className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
            <span className="relative z-10 font-semibold">Edit</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="px-3 border-2 border-rose-400 text-rose-600 hover:bg-gradient-to-r hover:from-rose-100 hover:to-red-100 hover:border-rose-500 hover:shadow-xl transform hover:scale-110 transition-all duration-300 hover:ring-4 hover:ring-rose-300/50 dark:border-rose-500 dark:text-rose-400 dark:hover:bg-rose-900/30 group relative overflow-hidden"
            onClick={() => onDelete(entity)}
            data-testid={`button-delete-${entity.id}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Trash2 className="w-4 h-4 group-hover:animate-pulse group-hover:scale-125 transition-all duration-300 relative z-10" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}