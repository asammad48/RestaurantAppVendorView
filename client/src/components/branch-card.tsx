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
            className="bg-green-500 hover:bg-green-600 text-white shadow-lg"
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
            <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{branch.contactNumber || 'Phone: N/A'}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 min-w-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:ring-2 hover:ring-green-300/50 relative overflow-hidden group px-3 py-2"
            onClick={() => onManage(branch)}
            data-testid={`button-manage-${branch.id}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/30 to-white/10 shimmer-effect opacity-0 group-hover:opacity-100"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center justify-center gap-1 relative z-10">
              <Settings className="w-3 h-3 animate-pulse group-hover:animate-spin flex-shrink-0" />
              <span className="text-xs font-medium truncate">Manage</span>
            </div>
          </Button>
          
          {onConfigure && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-w-0 border-2 border-blue-400 text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:ring-2 hover:ring-blue-300/50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/30 relative overflow-hidden group px-3 py-2"
              onClick={() => onConfigure(branch)}
              data-testid={`button-configure-${branch.id}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center gap-1 relative z-10">
                <Cog className="w-3 h-3 group-hover:rotate-180 group-hover:scale-110 transition-all duration-500 flex-shrink-0" />
                <span className="text-xs font-medium truncate">Config</span>
              </div>
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-w-0 border-2 border-amber-400 text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:border-amber-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:ring-2 hover:ring-amber-300/50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-900/30 relative overflow-hidden group px-3 py-2"
              onClick={() => onEdit(branch)}
              data-testid={`button-edit-${branch.id}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-300/20 to-yellow-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center gap-1 relative z-10">
                <Edit className="w-3 h-3 group-hover:rotate-180 group-hover:scale-110 transition-all duration-500 flex-shrink-0" />
                <span className="text-xs font-medium truncate">Edit</span>
              </div>
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-8 p-0 border-2 border-red-400 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:border-red-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:ring-2 hover:ring-red-300/50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-900/30 group relative overflow-hidden"
              onClick={() => onDelete(branch)}
              data-testid={`button-delete-${branch.id}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Trash2 className="w-3 h-3 group-hover:animate-bounce group-hover:scale-110 transition-all duration-300 relative z-10" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}