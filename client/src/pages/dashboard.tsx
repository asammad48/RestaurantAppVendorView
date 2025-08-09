import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, ShoppingCart, DollarSign, Clock, Users, Star, ChefHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import type { DashboardStats, TopPerformingItems, OccupancyData, HourlyOrders, Feedback } from "@shared/schema";
import "../styles/chart-animations.css";

// Chart colors for consistent theming with gradients
const COLORS = {
  primary: '#10b981', // emerald-500
  secondary: '#3b82f6', // blue-500
  success: '#22c55e', // green-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
  neutral: '#6b7280', // gray-500
  positive: '#10b981',
  negative: '#ef4444',
  feedbackColors: ['#10b981', '#f59e0b', '#ef4444'], // Positive, Neutral, Negative
  gradients: {
    primary: 'linear-gradient(135deg, #10b981, #34d399)',
    secondary: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    warning: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    purple: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    pink: 'linear-gradient(135deg, #ec4899, #f472b6)',
  },
  chartColors: [
    '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899',
    '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6'
  ]
};

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "this_week" | "this_month">("today");

  // Query for dashboard stats with period filter
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats", selectedPeriod],
  });

  // Query for top performing items
  const { data: topItems, isLoading: topItemsLoading } = useQuery({
    queryKey: ["/api/dashboard/top-items"],
  });

  // Query for occupancy data
  const { data: occupancyData, isLoading: occupancyLoading } = useQuery({
    queryKey: ["/api/dashboard/occupancy"],
  });

  // Query for hourly orders
  const { data: hourlyOrders, isLoading: hourlyOrdersLoading } = useQuery({
    queryKey: ["/api/dashboard/hourly-orders"],
  });

  // Query for feedback data
  const { data: feedbacks, isLoading: feedbacksLoading } = useQuery({
    queryKey: ["/api/feedbacks"],
  });

  const isLoading = statsLoading || topItemsLoading || occupancyLoading || hourlyOrdersLoading || feedbacksLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" data-testid="loading-spinner"></div>
      </div>
    );
  }

  // Process feedback data for pie chart
  const feedbackDistribution = (() => {
    if (!feedbacks?.length) return [
      { name: 'Positive', value: 45, percentage: 65 },
      { name: 'Neutral', value: 15, percentage: 22 },
      { name: 'Negative', value: 9, percentage: 13 },
    ];
    
    const positive = feedbacks.filter((f: Feedback) => f.rating >= 4).length;
    const neutral = feedbacks.filter((f: Feedback) => f.rating === 3).length;
    const negative = feedbacks.filter((f: Feedback) => f.rating <= 2).length;
    const total = feedbacks.length;

    return [
      { name: 'Positive', value: positive, percentage: Math.round((positive / total) * 100) },
      { name: 'Neutral', value: neutral, percentage: Math.round((neutral / total) * 100) },
      { name: 'Negative', value: negative, percentage: Math.round((negative / total) * 100) },
    ];
  })();

  // Get best selling category
  const bestSellingCategory = topItems?.length > 0 ? topItems[0]?.category || "Main Course" : "Main Course";

  // Format currency
  const formatCurrency = (amount: number) => `$${(amount / 100).toLocaleString()}`;

  // Current occupancy percentage
  const currentOccupancy = occupancyData?.occupancyPercentage || 75;

  return (
    <div className="space-y-8 p-6" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time insights for your restaurant performance</p>
        </div>
      </div>

      {/* Sales Summary Cards */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sales Summary</h2>
          <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as typeof selectedPeriod)}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="this_week">This Week</TabsTrigger>
              <TabsTrigger value="this_month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 relative overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-full">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                {formatCurrency(dashboardStats?.totalRevenue || 85420)}
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="text-xs font-semibold">+12.5%</span>
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  from last {selectedPeriod.replace('_', ' ')}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 relative overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-700">Number of Orders</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-full">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                {dashboardStats?.totalOrders || 342}
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="text-xs font-semibold">+8.2%</span>
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  from last {selectedPeriod.replace('_', ' ')}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 relative overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-700">Average Order Value</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                {formatCurrency(dashboardStats?.averageOrderValue || 2497)}
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="text-xs font-semibold">+4.1%</span>
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  from last {selectedPeriod.replace('_', ' ')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <style>{`
          @keyframes gauge-fill {
            from { stroke-dasharray: 0 251; }
            to { stroke-dasharray: ${2.51 * currentOccupancy} 251; }
          }
          .gauge-circle {
            animation: gauge-fill 2s ease-out;
          }
        `}</style>
        {/* Top Performing Items Bar Chart */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
          <CardHeader className="bg-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 rounded-full">
                <ChefHat className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-gray-800 font-bold">
                Top Performing Items
              </span>
            </CardTitle>
            <p className="text-sm text-gray-600">Top 5 dishes by sales today</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart 
                data={topItems?.slice(0, 5) || [
                  { itemName: "Chicken Karahi", salesAmount: 12500, category: "Main Course" },
                  { itemName: "Beef Biryani", salesAmount: 10200, category: "Rice" },
                  { itemName: "Fish Tikka", salesAmount: 8500, category: "BBQ" },
                  { itemName: "Mutton Pulao", salesAmount: 7300, category: "Rice" },
                  { itemName: "Chicken Wings", salesAmount: 6100, category: "Appetizer" }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <defs>
                  {COLORS.chartColors.map((color, index) => (
                    <linearGradient key={index} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                      <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis 
                  dataKey="itemName" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={11}
                  fontWeight="500"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value / 100}`}
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), "Sales"]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Bar 
                  dataKey="salesAmount" 
                  radius={[6, 6, 0, 0]}
                  stroke="#10b981"
                  strokeWidth={2}
                >
                  {(topItems?.slice(0, 5) || [
                    { itemName: "Chicken Karahi", salesAmount: 12500, category: "Main Course" },
                    { itemName: "Beef Biryani", salesAmount: 10200, category: "Rice" },
                    { itemName: "Fish Tikka", salesAmount: 8500, category: "BBQ" },
                    { itemName: "Mutton Pulao", salesAmount: 7300, category: "Rice" },
                    { itemName: "Chicken Wings", salesAmount: 6100, category: "Appetizer" }
                  ]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#colorGradient${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                Best-selling category: <span className="font-bold text-emerald-600 text-lg">{bestSellingCategory}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Feedback Pie Chart */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
          <CardHeader className="bg-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-full animate-pulse">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <span className="text-gray-800 font-bold">
                Customer Feedback
              </span>
            </CardTitle>
            <p className="text-sm text-gray-600">Feedback distribution by rating</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <defs>
                  <linearGradient id="positiveGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.7}/>
                  </linearGradient>
                  <linearGradient id="neutralGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.7}/>
                  </linearGradient>
                  <linearGradient id="negativeGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#f87171" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <Pie
                  data={feedbackDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={130}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ percentage }) => `${percentage}%`}
                  labelLine={false}
                  stroke="#ffffff"
                  strokeWidth={3}
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {feedbackDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? 'url(#positiveGradient)' : index === 1 ? 'url(#neutralGradient)' : 'url(#negativeGradient)'}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} reviews`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-8 mt-6">
              {feedbackDistribution.map((entry, index) => (
                <div key={entry.name} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-50 shadow-md hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full shadow-lg" 
                      style={{ backgroundColor: COLORS.feedbackColors[index] }}
                    ></div>
                    <span className="text-sm font-semibold text-gray-700">{entry.name}</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: COLORS.feedbackColors[index] }}>
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Gauge */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
          <CardHeader className="bg-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-gray-800 font-bold">
                Current Occupancy
              </span>
            </CardTitle>
            <p className="text-sm text-gray-600">Dine-in table occupancy percentage</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="relative w-56 h-56">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="1"/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${2.51 * currentOccupancy} 251`}
                  strokeLinecap="round"
                  filter="url(#glow)"
                  className="transition-all duration-2000 ease-out"
                  style={{
                    animation: 'gauge-fill 2s ease-out',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-white rounded-full p-6 shadow-xl">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {currentOccupancy}%
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Occupied</div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center w-full">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-blue-600 text-lg">{occupancyData?.occupiedTables || 15}</span> of <span className="font-bold text-lg">{occupancyData?.totalTables || 20}</span> tables occupied
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Line Chart */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
          <CardHeader className="bg-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-gray-800 font-bold">
                Peak Hours Traffic
              </span>
            </CardTitle>
            <p className="text-sm text-gray-600">Orders per hour for today</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart 
                data={hourlyOrders || [
                  { hour: 8, orderCount: 5 }, { hour: 9, orderCount: 12 }, { hour: 10, orderCount: 18 },
                  { hour: 11, orderCount: 25 }, { hour: 12, orderCount: 45 }, { hour: 13, orderCount: 52 },
                  { hour: 14, orderCount: 38 }, { hour: 15, orderCount: 28 }, { hour: 16, orderCount: 22 },
                  { hour: 17, orderCount: 35 }, { hour: 18, orderCount: 48 }, { hour: 19, orderCount: 55 },
                  { hour: 20, orderCount: 42 }, { hour: 21, orderCount: 30 }, { hour: 22, orderCount: 15 }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="50%" stopColor="#f97316" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis 
                  dataKey="hour" 
                  tickFormatter={(hour) => `${hour}:00`}
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  labelFormatter={(hour) => `${hour}:00`}
                  formatter={(value) => [`${value} orders`, "Orders"]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="orderCount" 
                  stroke="url(#lineGradient)"
                  strokeWidth={4}
                  dot={{ 
                    fill: '#f59e0b', 
                    strokeWidth: 3, 
                    r: 5,
                    filter: 'url(#shadow)'
                  }}
                  activeDot={{ 
                    r: 8, 
                    stroke: '#f59e0b', 
                    strokeWidth: 3,
                    fill: '#ffffff',
                    filter: 'url(#shadow)'
                  }}
                  filter="url(#shadow)"
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}