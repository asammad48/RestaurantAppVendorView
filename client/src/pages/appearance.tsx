import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import { Link } from "wouter";

export default function Appearance() {
  const [selectedColor, setSelectedColor] = useState("rgb(22, 163, 74)"); // Green default
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const colorPalettes = [
    { id: 1, color: "rgb(22, 163, 74)", name: "Green", hex: "#16a34a" },
    { id: 2, color: "rgb(59, 130, 246)", name: "Blue", hex: "#3b82f6" },
    { id: 3, color: "rgb(239, 68, 68)", name: "Red", hex: "#ef4444" },
    { id: 4, color: "rgb(139, 92, 246)", name: "Purple", hex: "#8b5cf6" },
    { id: 5, color: "rgb(245, 158, 11)", name: "Orange", hex: "#f59e0b" },
    { id: 6, color: "rgb(16, 185, 129)", name: "Emerald", hex: "#10b981" },
    { id: 7, color: "rgb(236, 72, 153)", name: "Pink", hex: "#ec4899" },
    { id: 8, color: "rgb(20, 184, 166)", name: "Teal", hex: "#14b8a6" },
    { id: 9, color: "rgb(132, 204, 22)", name: "Lime", hex: "#84cc16" },
    { id: 10, color: "rgb(168, 85, 247)", name: "Violet", hex: "#a855f7" },
    { id: 11, color: "rgb(244, 63, 94)", name: "Rose", hex: "#f43f5e" },
    { id: 12, color: "rgb(6, 182, 212)", name: "Cyan", hex: "#06b6d4" },
  ];

  const previewItems = [
    {
      id: 1,
      name: "Pizza Combo",
      description: "Delicious pizza with your choice of toppings, served with garlic bread and a side of marinara sauce.",
      price: "Rs. 550.00",
      originalPrice: "Rs. 600.00"
    },
    {
      id: 2,
      name: "Pizza Combo",
      description: "Delicious pizza with your choice of toppings, served with garlic bread and a side of marinara sauce.",
      price: "Rs. 550.00",
      originalPrice: "Rs. 600.00"
    },
    {
      id: 3,
      name: "Pizza Combo",
      description: "Delicious pizza with your choice of toppings, served with garlic bread and a side of marinara sauce.",
      price: "Rs. 550.00",
      originalPrice: "Rs. 600.00"
    },
    {
      id: 4,
      name: "Pizza Combo",
      description: "Delicious pizza with your choice of toppings, served with garlic bread and a side of marinara sauce.",
      price: "Rs. 550.00",
      originalPrice: "Rs. 600.00"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/branches">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
          Appearance
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Color Palette */}
        <div className="space-y-6">
          {/* Color Palette */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold" data-testid="text-color-palette-title">
                Color Palette
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Color Picker Area */}
              <div className="relative">
                <div className="h-64 w-full rounded-lg bg-gradient-to-br from-orange-400 via-orange-500 to-black relative overflow-hidden border-2 border-gray-200">
                  {/* Color picker circle */}
                  <div 
                    className="absolute w-5 h-5 border-2 border-white rounded-full shadow-lg cursor-pointer bg-white"
                    style={{ 
                      top: '30%', 
                      right: '15%',
                      transform: 'translate(50%, -50%)'
                    }}
                    data-testid="color-picker-handle"
                  >
                    <div className="w-3 h-3 border border-gray-400 rounded-full m-0.5" />
                  </div>
                </div>
              </div>
              
              {/* Color Strip */}
              <div className="space-y-3">
                <div className="h-6 w-full rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-pink-500 border border-gray-200"></div>
                
                {/* Color Values */}
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="space-y-1" data-testid="color-hex-section">
                    <label className="text-gray-500 font-medium">Hex</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="font-mono text-gray-800">#E89623</span>
                    </div>
                  </div>
                  <div className="space-y-1" data-testid="color-rgb-r-section">
                    <label className="text-gray-500 font-medium">R</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="font-mono text-gray-800">232</span>
                    </div>
                  </div>
                  <div className="space-y-1" data-testid="color-rgb-g-section">
                    <label className="text-gray-500 font-medium">G</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="font-mono text-gray-800">150</span>
                    </div>
                  </div>
                  <div className="space-y-1" data-testid="color-rgb-b-section">
                    <label className="text-gray-500 font-medium">B</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="font-mono text-gray-800">35</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold" data-testid="text-preview-title">
              Preview
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={previewMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode("desktop")}
                data-testid="button-preview-desktop"
              >
                Desktop
              </Button>
              <Button
                variant={previewMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode("mobile")}
                data-testid="button-preview-mobile"
              >
                Mobile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`${previewMode === "mobile" ? "max-w-sm mx-auto" : ""} space-y-4`}>
              {/* Restaurant Header Preview */}
              <div 
                className="relative h-24 rounded-lg overflow-hidden"
                style={{ 
                  background: `linear-gradient(to right, ${selectedColor}, ${selectedColor}dd)` 
                }}
              >
                <img 
                  src="/api/placeholder/400/100" 
                  alt="Restaurant" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-2 left-4 text-white">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      You're at TABLE #5
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Recommended Section */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3" data-testid="text-recommended-title">
                  Recommended For You
                </h3>
                <div className={`grid ${previewMode === "desktop" ? "grid-cols-4" : "grid-cols-2"} gap-3`}>
                  {previewItems.slice(0, 4).map((item) => (
                    <Card key={item.id} className="p-3" data-testid={`card-menu-item-${item.id}`}>
                      <div className="aspect-square bg-gray-200 rounded-lg mb-2 relative overflow-hidden">
                        <img 
                          src="/api/placeholder/150/150" 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium line-clamp-1" data-testid={`text-item-name-${item.id}`}>
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2" data-testid={`text-item-description-${item.id}`}>
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span 
                              className="text-sm font-semibold" 
                              style={{ color: selectedColor }}
                              data-testid={`text-item-price-${item.id}`}
                            >
                              {item.price}
                            </span>
                            <span className="text-xs text-gray-400 line-through" data-testid={`text-item-original-price-${item.id}`}>
                              {item.originalPrice}
                            </span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full text-white hover:opacity-90"
                          style={{ backgroundColor: selectedColor }}
                          data-testid={`button-add-item-${item.id}`}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Menu Items List */}
              <div className="space-y-3">
                {previewItems.slice(0, 4).map((item) => (
                  <Card key={`list-${item.id}`} className="p-4" data-testid={`card-menu-list-item-${item.id}`}>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        <img 
                          src="/api/placeholder/64/64" 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white" data-testid={`text-list-item-name-${item.id}`}>
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1" data-testid={`text-list-item-description-${item.id}`}>
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span 
                              className="font-semibold"
                              style={{ color: selectedColor }}
                              data-testid={`text-list-item-price-${item.id}`}
                            >
                              {item.price}
                            </span>
                            <span className="text-sm text-gray-400 line-through" data-testid={`text-list-item-original-price-${item.id}`}>
                              {item.originalPrice}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            className="text-white hover:opacity-90"
                            style={{ backgroundColor: selectedColor }}
                            data-testid={`button-add-list-item-${item.id}`}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}