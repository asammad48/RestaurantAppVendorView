import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, Phone, Edit, Trash2, Store, Clock } from "lucide-react";
import type { Branch } from "@shared/schema";

interface BranchCardProps {
  branch: Branch;
  onManage: (branch: Branch) => void;
  onEdit?: (branch: Branch) => void;
  onDelete?: (branch: Branch) => void;
}

export default function BranchCard({ branch, onManage, onEdit, onDelete }: BranchCardProps) {
  return (
    <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" data-testid={`card-branch-${branch.id}`}>
      <div className="relative">
        <img 
          src={branch.restaurantLogo || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
          alt={`${branch.name} logo`} 
          className="w-full h-48 object-cover bg-gray-100 transition-transform duration-300 group-hover:scale-105"
          data-testid={`branch-image-${branch.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4">
          <Badge 
            className={branch.status === 'active' 
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg' 
              : 'bg-gray-500 hover:bg-gray-600 text-white shadow-lg'
            }
            data-testid={`branch-status-${branch.id}`}
          >
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${branch.status === 'active' ? 'bg-white' : 'bg-gray-300'}`} />
              {branch.status === 'active' ? 'Active' : 'Inactive'}
            </div>
          </Badge>
        </div>
        <div className="absolute top-4 left-4">
          <Badge 
            variant="secondary"
            className="bg-white/90 text-gray-800 font-medium shadow-lg"
            data-testid={`branch-type-${branch.id}`}
          >
            <Store className="w-3 h-3 mr-1" />
            {branch.restaurantType.toUpperCase()}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg" data-testid={`branch-name-${branch.id}`}>
            {branch.name}
          </h3>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <span className="line-clamp-2">{branch.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{branch.contactNo}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span>24/7 Available</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md"
            onClick={() => onManage(branch)}
            data-testid={`button-manage-${branch.id}`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
          
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => onEdit(branch)}
              data-testid={`button-edit-${branch.id}`}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              className="px-3 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={() => onDelete(branch)}
              data-testid={`button-delete-${branch.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}