import { useQuery } from "@tanstack/react-query";
import { Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DonutChart from "@/components/charts/donut-chart";
import RevenueChart from "@/components/charts/revenue-chart";

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
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
    expense: Math.floor(item.revenue * 0.2),
  }));

  return (
    <div className="space-y-8" data-testid="analytics-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800" data-testid="page-title">Analytics</h2>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" data-testid="button-filters">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" data-testid="button-date-range">
            <Calendar className="w-4 h-4 mr-2" />
            April 11 - April 24
          </Button>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="space-y-8">
        {/* Customer Analytics */}
        <Card data-testid="customer-analytics-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900" data-testid="customers-title">Customers</h3>
                <p className="text-sm text-gray-500" data-testid="customers-subtitle">Customers that buy our products</p>
              </div>
              <Button variant="ghost" size="icon" data-testid="button-customer-more">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-12">
              {/* Donut Chart */}
              <div className="flex-shrink-0">
                <DonutChart 
                  data={[
                    { name: "Current", value: 82.3, color: "#5CB85C" },
                    { name: "New", value: 17.7, color: "#A7F3D0" }
                  ]}
                  centerText="82.3%"
                  centerSubtext="Total"
                  size={280}
                />
                
                <div className="flex items-center justify-center space-x-8 mt-6 text-sm">
                  <div className="flex items-center" data-testid="legend-current-customers">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Current customers</span>
                  </div>
                  <div className="flex items-center" data-testid="legend-new-customers">
                    <div className="w-3 h-3 bg-green-300 rounded-full mr-2"></div>
                    <span className="text-gray-600">New customers</span>
                  </div>
                </div>
              </div>

              {/* Growth Metrics */}
              <div className="space-y-6 lg:ml-12 mt-8 lg:mt-0">
                <div className="flex items-center" data-testid="daily-customers-metric">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">+ 18%</p>
                    <p className="text-gray-500">Daily customers</p>
                  </div>
                </div>
                
                <div className="flex items-center" data-testid="weekly-customers-metric">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">+ 14%</p>
                    <p className="text-gray-500">Weekly new customers</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Analytics */}
        <Card data-testid="revenue-analytics-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900" data-testid="revenue-analytics-title">Revenue</h3>
              <Button variant="ghost" size="icon" data-testid="button-revenue-more">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </Button>
            </div>
            
            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-900" data-testid="revenue-analytics-total">$112,340</p>
            </div>
            
            <div className="h-80" data-testid="revenue-analytics-chart">
              <RevenueChart data={chartData} />
            </div>
            
            <div className="flex items-center justify-center space-x-8 mt-6 text-sm">
              <div className="flex items-center" data-testid="legend-pending-analytics">
                <div className="w-3 h-3 bg-green-300 rounded-full mr-2"></div>
                <span className="text-gray-600">Pending (10%)</span>
              </div>
              <div className="flex items-center" data-testid="legend-income-analytics">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Income</span>
              </div>
              <div className="flex items-center" data-testid="legend-expense-analytics">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                <span className="text-gray-600">Expense</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
