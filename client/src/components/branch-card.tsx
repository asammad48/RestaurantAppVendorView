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
            className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:ring-2 hover:ring-[#15803d]/30 relative overflow-hidden group"
            onClick={() => onManage(branch)}
            data-testid={`button-manage-${branch.id}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300 flex-shrink-0" />
              <span className="text-sm font-medium">Manage</span>
            </div>
          </Button>
          
          {/* Secondary Actions - Grid Layout */}
          <div className="flex gap-1.5">
            {onConfigure && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-2 border-[#15803d]/30 text-[#15803d] hover:bg-[#15803d]/5 hover:border-[#15803d] hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:ring-2 hover:ring-[#15803d]/20 relative overflow-hidden group"
                onClick={() => onConfigure(branch)}
                data-testid={`button-configure-${branch.id}`}
              >
                <div className="absolute inset-0 bg-[#15803d]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-center gap-1 relative z-10">
                  <Cog className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300 flex-shrink-0" />
                  <span className="text-xs font-medium hidden sm:inline">Config</span>
                </div>
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-2 border-[#15803d]/30 text-[#15803d] hover:bg-[#15803d]/5 hover:border-[#15803d] hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:ring-2 hover:ring-[#15803d]/20 relative overflow-hidden group"
                onClick={() => onEdit(branch)}
                data-testid={`button-edit-${branch.id}`}
              >
                <div className="absolute inset-0 bg-[#15803d]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-center gap-1 relative z-10">
                  <Edit className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
                  <span className="text-xs font-medium hidden sm:inline">Edit</span>
                </div>
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-2 border-red-400 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:border-red-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:ring-2 hover:ring-red-300/50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-900/30 group relative overflow-hidden"
                onClick={() => onDelete(branch)}
                data-testid={`button-delete-${branch.id}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-center gap-1 relative z-10">
                  <Trash2 className="w-3 h-3 group-hover:animate-bounce group-hover:scale-110 transition-all duration-300" />
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