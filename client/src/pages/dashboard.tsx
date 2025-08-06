import { useQuery } from "@tanstack/react-query";
import { Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatsCard from "@/components/stats-card";
import RevenueChart from "@/components/charts/revenue-chart";
import DonutChart from "@/components/charts/donut-chart";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const usersList = [
  {
    id: "1",
    name: "Ana Black",
    email: "ana@gmail.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: "2",
    name: "George Litz",
    email: "georgelitz@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: "3",
    name: "John Miller",
    email: "jmiller@gmail.com",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: "4",
    name: "Jane Johnson",
    email: "jj@gmail.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: "5",
    name: "Mezel Agnes",
    email: "fefekartika@gmail.com",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  },
  {
    id: "6",
    name: "Katona Beatrix",
    email: "edoeram@gmail.com",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });

  if (statsLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading-spinner" data-testid="loading-spinner"></div>
      </div>
    );
  }

  const chartData = (analytics || []).map((item: any) => ({
    name: new Date(item.date).toLocaleString('default', { month: 'short' }),
    income: item.revenue,
    pending: Math.floor(item.revenue * 0.1),
  }));

  return (
    <div className="space-y-8" data-testid="dashboard-page">
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Menu"
          value={(stats as any)?.totalMenuItems?.toString() || "0"}
          icon="menu"
          data-testid="stat-total-menu"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${(stats as any)?.totalRevenue?.toLocaleString() || "0"}`}
          icon="revenue"
          data-testid="stat-total-revenue"
        />
        <StatsCard
          title="Total Customer"
          value={(stats as any)?.totalCustomers?.toLocaleString() || "0"}
          icon="customers"
          data-testid="stat-total-customers"
        />
        <StatsCard
          title="Total Orders"
          value={(stats as any)?.totalOrders?.toLocaleString() || "0"}
          icon="orders"
          data-testid="stat-total-orders"
        />
      </div>

      {/* Charts Row */}
      <div className="analytics-grid">
        {/* Revenue Chart */}
        <Card data-testid="revenue-chart-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900" data-testid="revenue-chart-title">Revenue</h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" data-testid="button-filters">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" data-testid="button-date-range">
                  <Calendar className="h-4 w-4 mr-2" />
                  April 11 - April 24
                </Button>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900" data-testid="revenue-total">$112,340</p>
            </div>
            <RevenueChart data={chartData} />
          </CardContent>
        </Card>

        {/* Customers Chart */}
        <Card data-testid="customers-chart-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900" data-testid="customers-chart-title">Customers</h3>
                <p className="text-sm text-gray-500" data-testid="customers-subtitle">Customers that buy our products</p>
              </div>
              <Button variant="ghost" size="icon" data-testid="button-more">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </Button>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <DonutChart 
                  data={[
                    { name: "Current", value: 82.3, color: "#5CB85C" },
                    { name: "New", value: 17.7, color: "#A7F3D0" }
                  ]}
                  centerText="82.3%"
                  centerSubtext="Total"
                />
              </div>
              
              <div className="ml-8 space-y-4">
                <div className="flex items-center" data-testid="daily-customers">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">+ 18%</p>
                    <p className="text-sm text-gray-500">Daily customers</p>
                  </div>
                </div>
                
                <div className="flex items-center" data-testid="weekly-customers">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">+ 14%</p>
                    <p className="text-sm text-gray-500">Weekly new customers</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Current customers</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-300 rounded-full mr-2"></div>
                <span className="text-gray-600">New customers</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card data-testid="users-list-card">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900" data-testid="users-list-title">Users List</h3>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            {usersList.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                data-testid={`user-${user.id}`}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900" data-testid={`user-name-${user.id}`}>{user.name}</p>
                  <p className="text-sm text-gray-500" data-testid={`user-email-${user.id}`}>{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
