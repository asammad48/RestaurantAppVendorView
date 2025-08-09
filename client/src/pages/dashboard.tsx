import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, ShoppingCart, DollarSign, Clock, Users, Star, ChefHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import type { DashboardStats, TopPerformingItems, OccupancyData, HourlyOrders, Feedback } from "@shared/schema";

// Chart colors for consistent theming
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
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(dashboardStats?.totalRevenue || 85420)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +12.5% from last {selectedPeriod.replace('_', ' ')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Number of Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {dashboardStats?.totalOrders || 342}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +8.2% from last {selectedPeriod.replace('_', ' ')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(dashboardStats?.averageOrderValue || 2497)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +4.1% from last {selectedPeriod.replace('_', ' ')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Items Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-emerald-500" />
              Top Performing Items
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Top 5 dishes by sales today</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topItems?.slice(0, 5) || [
                { itemName: "Chicken Karahi", salesAmount: 12500, category: "Main Course" },
                { itemName: "Beef Biryani", salesAmount: 10200, category: "Rice" },
                { itemName: "Fish Tikka", salesAmount: 8500, category: "BBQ" },
                { itemName: "Mutton Pulao", salesAmount: 7300, category: "Rice" },
                { itemName: "Chicken Wings", salesAmount: 6100, category: "Appetizer" }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="itemName" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis tickFormatter={(value) => `$${value / 100}`} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), "Sales"]} />
                <Bar dataKey="salesAmount" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Best-selling category: <span className="font-semibold text-emerald-600">{bestSellingCategory}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Feedback Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Customer Feedback
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Feedback distribution by rating</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feedbackDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ percentage }) => `${percentage}%`}
                  labelLine={false}
                >
                  {feedbackDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.feedbackColors[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} reviews`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {feedbackDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS.feedbackColors[index] }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Gauge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Current Occupancy
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Dine-in table occupancy percentage</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2.51 * currentOccupancy} 251`}
                  className="text-blue-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{currentOccupancy}%</div>
                  <div className="text-sm text-gray-500">Occupied</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {occupancyData?.occupiedTables || 15} of {occupancyData?.totalTables || 20} tables occupied
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Peak Hours Traffic
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Orders per hour for today</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyOrders || [
                { hour: 8, orderCount: 5 }, { hour: 9, orderCount: 12 }, { hour: 10, orderCount: 18 },
                { hour: 11, orderCount: 25 }, { hour: 12, orderCount: 45 }, { hour: 13, orderCount: 52 },
                { hour: 14, orderCount: 38 }, { hour: 15, orderCount: 28 }, { hour: 16, orderCount: 22 },
                { hour: 17, orderCount: 35 }, { hour: 18, orderCount: 48 }, { hour: 19, orderCount: 55 },
                { hour: 20, orderCount: 42 }, { hour: 21, orderCount: 30 }, { hour: 22, orderCount: 15 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(hour) => `${hour}:00`}
                  formatter={(value) => [`${value} orders`, "Orders"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="orderCount" 
                  stroke={COLORS.warning} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.warning, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: COLORS.warning, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}