import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, Phone, Edit, Trash2, Store, Cog } from "lucide-react";
import type { Branch } from "@/types/schema";
import { getBranchImageUrl } from "@/lib/imageUtils";

interface BranchCardProps {
  branch: Branch;
  onManage: (branch: Branch) => void;
  onEdit?: (branch: Branch) => void;
  onDelete?: (branch: Branch) => void;
  onConfigure?: (branch: Branch) => void;
}

export default function BranchCard({ branch, onManage, onEdit, onDelete, onConfigure }: BranchCardProps) {
  return (
    <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" data-testid={`card-branch-${branch.id}`}>
      <div className="relative">
        <img 
          src={getBranchImageUrl(branch.restaurantLogo)} 
          alt={`${branch.name} logo`} 
          className="w-full h-48 object-cover bg-gray-100 transition-transform duration-300 group-hover:scale-105"
          data-testid={`branch-image-${branch.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4">
          <Badge 
            className="bg-[#15803d] hover:bg-[#166534] text-white shadow-lg"
            data-testid={`branch-status-${branch.id}`}
          >
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white" />
              Active
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
            BRANCH
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
            <Phone className="w-4 h-4 text-[#15803d] flex-shrink-0" />
            <span>{branch.contactNumber || 'Phone: N/A'}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            {branch.timeZone && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Timezone:</span>
                <span>{branch.timeZone}</span>
              </div>
            )}
            {branch.currency && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Currency:</span>
                <span>{branch.currency}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          {/* Primary Action - Full Width */}
          <Button
            variant="default"
            size="sm"
            className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-medium"
            onClick={() => onManage(branch)}
            data-testid={`button-manage-${branch.id}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Manage</span>
            </div>
          </Button>
          
          {/* Secondary Actions - Grid Layout */}
          <div className="flex gap-1.5">
            {onConfigure && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border border-[#15803d] text-[#15803d] hover:bg-[#15803d]/10"
                onClick={() => onConfigure(branch)}
                data-testid={`button-configure-${branch.id}`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Cog className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs font-medium hidden sm:inline">Config</span>
                </div>
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border border-[#15803d] text-[#15803d] hover:bg-[#15803d]/10"
                onClick={() => onEdit(branch)}
                data-testid={`button-edit-${branch.id}`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Edit className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs font-medium hidden sm:inline">Edit</span>
                </div>
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => onDelete(branch)}
                data-testid={`button-delete-${branch.id}`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Trash2 className="w-3 h-3" />
                  <span className="text-xs font-medium hidden sm:inline">Delete</span>
                </div>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}