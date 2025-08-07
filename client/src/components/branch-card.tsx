import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, Phone } from "lucide-react";
import type { Branch } from "@shared/schema";

interface BranchCardProps {
  branch: Branch;
  onManage: (branch: Branch) => void;
}

export default function BranchCard({ branch, onManage }: BranchCardProps) {
  return (
    <Card className="bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow" data-testid={`card-branch-${branch.id}`}>
      <div className="relative">
        <img 
          src={branch.restaurantLogo || "/api/placeholder/400/200"} 
          alt={`${branch.name} logo`} 
          className="w-full h-48 object-cover bg-gray-100"
          data-testid={`branch-image-${branch.id}`}
        />
        <div className="absolute top-3 right-3">
          <Badge 
            className={branch.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}
            data-testid={`branch-status-${branch.id}`}
          >
            {branch.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary"
            className="bg-white/90 text-gray-800"
            data-testid={`branch-type-${branch.id}`}
          >
            {branch.restaurantType.toUpperCase()}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid={`branch-name-${branch.id}`}>
          {branch.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{branch.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{branch.contactNo}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={() => onManage(branch)}
            data-testid={`button-manage-${branch.id}`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Branch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}