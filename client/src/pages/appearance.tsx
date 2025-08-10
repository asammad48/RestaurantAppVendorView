import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Palette, Edit } from "lucide-react";
import { Link } from "wouter";

export default function Appearance() {
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");
  const [selectedColor, setSelectedColor] = useState("#E89623");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const colorPalettes = [
    { id: 1, primary: "#4ade80", secondary: "#000000", name: "Green & Black" },
    { id: 2, primary: "#3b82f6", secondary: "#1e40af", name: "Blue Gradient" },
    { id: 3, primary: "#ef4444", secondary: "#dc2626", name: "Red Gradient" },
    { id: 4, primary: "#8b5cf6", secondary: "#7c3aed", name: "Purple Gradient" },
    { id: 5, primary: "#f59e0b", secondary: "#d97706", name: "Orange Gradient" },
    { id: 6, primary: "#10b981", secondary: "#059669", name: "Emerald Gradient" },
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
        {/* Left Panel - Appearance Settings */}
        <div className="space-y-6">
          {/* Theme Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold" data-testid="text-appearance-title">
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={selectedTheme === "light" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setSelectedTheme("light")}
                  data-testid="button-theme-light"
                >
                  Light
                </Button>
                <Button
                  variant={selectedTheme === "dark" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setSelectedTheme("dark")}
                  data-testid="button-theme-dark"
                >
                  Dark
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold" data-testid="text-color-palette-title">
                Color Palette
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Colors Display */}
              <div className="flex gap-3">
                {colorPalettes.find(p => p.primary === selectedColor) && (
                  <>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
                        style={{ backgroundColor: colorPalettes.find(p => p.primary === selectedColor)?.primary }}
                        data-testid="color-preview-primary"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center"
                        style={{ backgroundColor: colorPalettes.find(p => p.primary === selectedColor)?.secondary }}
                        data-testid="color-preview-secondary"
                      >
                        <Edit className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Color Picker Area */}
              <div className="relative">
                <div className="h-48 w-full rounded-lg bg-gradient-to-br from-orange-400 via-orange-500 to-black relative overflow-hidden border">
                  {/* Color picker circle */}
                  <div 
                    className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg cursor-pointer"
                    style={{ 
                      top: '45%', 
                      left: '25%',
                      transform: 'translate(-50%, -50%)'
                    }}
                    data-testid="color-picker-handle"
                  />
                </div>
                
                {/* Color values */}
                <div className="flex gap-4 mt-4 text-sm">
                  <div className="flex flex-col" data-testid="color-hex-section">
                    <span className="text-gray-500">Hex</span>
                    <span className="font-mono">#E89623</span>
                  </div>
                  <div className="flex flex-col" data-testid="color-rgb-section">
                    <span className="text-gray-500">R</span>
                    <span>232</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">G</span>
                    <span>150</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">B</span>
                    <span>35</span>
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
              <div className="relative h-24 rounded-lg overflow-hidden bg-gradient-to-r from-green-600 to-green-700">
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
                            <span className="text-sm font-semibold text-green-600" data-testid={`text-item-price-${item.id}`}>
                              {item.price}
                            </span>
                            <span className="text-xs text-gray-400 line-through" data-testid={`text-item-original-price-${item.id}`}>
                              {item.originalPrice}
                            </span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
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
                            <span className="font-semibold text-green-600" data-testid={`text-list-item-price-${item.id}`}>
                              {item.price}
                            </span>
                            <span className="text-sm text-gray-400 line-through" data-testid={`text-list-item-original-price-${item.id}`}>
                              {item.originalPrice}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
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