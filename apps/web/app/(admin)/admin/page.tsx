'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    activeGuests: 0,
  });

  const [chartData, setChartData] = useState<{ month: string; bookings: number; revenue: number; }[]>([]);

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchData = async () => {
      // Placeholder data - in real app, this would come from API
      setStats({
        totalBookings: 124,
        totalRevenue: 8450,
        occupancyRate: 78,
        activeGuests: 42,
      });

      setChartData([
        { month: 'Jan', bookings: 28, revenue: 1900 },
        { month: 'Feb', bookings: 32, revenue: 2100 },
        { month: 'Mar', bookings: 25, revenue: 1700 },
        { month: 'Apr', bookings: 35, revenue: 2300 },
        { month: 'May', bookings: 40, revenue: 2600 },
        { month: 'Jun', bookings: 38, revenue: 2450 },
      ]);
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <div>
                      <CardTitle className="text-sm font-medium">
                        Total Bookings
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                  <p className="text-sm text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <div>
                      <CardTitle className="text-sm font-medium">
                        Total Revenue
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <p className="text-2xl font-bold">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-purple-500" />
                    <div>
                      <CardTitle className="text-sm font-medium">
                        Occupancy Rate
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <p className="text-2xl font-bold">{stats.occupancyRate}%</p>
                  <p className="text-sm text-muted-foreground">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    <div>
                      <CardTitle className="text-sm font-medium">
                        Active Guests
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <p className="text-2xl font-bold">{stats.activeGuests}</p>
                  <p className="text-sm text-muted-foreground">
                    +3% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Bookings Trend */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <div>
                      <CardTitle className="text-sm font-medium">
                        Monthly Bookings
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      bookings: { label: 'Bookings', color: '#3B82F6' },
                      revenue: { label: 'Revenue (£)', color: '#10B981' },
                    }}
                  >
                    <ResponsiveContainer>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="bookings"
                          stroke="#3B82F6"
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10B981"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Revenue Chart */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <div>
                      <CardTitle className="text-sm font-medium">
                        Revenue Trend
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {/* Simple revenue placeholder */}
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      Revenue Chart Placeholder
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    </div>
  );
}
