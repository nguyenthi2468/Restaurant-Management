'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { User } from '@/features/user';
import Link from 'next/link';
import { ROUTES } from '@/constants';

interface ScheduleTableProps {
  users: User[];
  onViewSchedule?: (user: User) => void;
}

function ScheduleTable({ users, onViewSchedule }: ScheduleTableProps) {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="text-foreground">Name</TableHead>
            <TableHead className="text-foreground">Email</TableHead>
            <TableHead className="text-foreground">Role</TableHead>
            <TableHead className="text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="border-b border-border hover:bg-secondary/30 transition-colors"
            >
              <TableCell className="text-foreground font-medium">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                  {user.roles.map((role) => role.name).join(', ')}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                    <Link href={`${ROUTES.ADMIN_EMPLOYEE_SCHEDULES}/employee/${user.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Calendar size={18} />
                    </Button>
                    </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Users size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No employees found</p>
        </div>
      )}
    </Card>
  );
}

export default ScheduleTable;
