'use client';

import { useState } from 'react';
import { useUsersQuery } from '@/features/user';
import { useRolesQuery } from '@/features/roles';
import { useDebounce } from '@/hooks/useDebounce';
import ScheduleTable from '@/components/employee-schedules/ScheduleTable';
import { User } from '@/features/user';
import { Input } from '@/components/ui/input';
import { Search, Calendar } from 'lucide-react';
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

function EmployeeSchedulesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 10;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const offset = (page - 1) * limit;

  const { data, isLoading, isError } = useUsersQuery({
    limit,
    offset,
    q: debouncedSearchTerm || undefined,
    role: filterRole !== 'all' ? filterRole : undefined,
  });

  const { data: rolesData } = useRolesQuery();

  const users = data?.data || [];
  const totalPages = data?.meta ? Math.ceil(data.meta.total / limit) : 0;

  const availableRoles = [
    'all',
    ...(rolesData?.map((role) => role.name) || []),
  ];

  const handleViewSchedule = (user: User) => {
    console.log('View schedule for user:', user);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Employee Schedules
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and view employee work schedules
          </p>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={filterRole}
              onValueChange={(value) => {
                setFilterRole(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role === 'all' ? 'All Roles' : role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {isError && (
        <Card className="p-6">
          <div className="text-center text-destructive">
            <p>Failed to load employees. Please try again.</p>
          </div>
        </Card>
      )}

      {!isLoading && !isError && (
        <>
          <ScheduleTable users={users} onViewSchedule={handleViewSchedule} />

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <EllipsisPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EmployeeSchedulesPage;
