import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  TimeOffRequest,
  TimeOffRequestStatus,
} from '@/features/employee-schedules/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { statusColors, statusLabels, typeLabels } from './constants';

interface TimeOffRequestListProps {
  requests: TimeOffRequest[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onApprove: (request: TimeOffRequest) => void;
  onReject: (request: TimeOffRequest) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
  } catch {
    return dateString;
  }
};

const calculateDays = (startDate: string, endDate: string) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  } catch {
    return 0;
  }
};

export function TimeOffRequestList({
  requests,
  totalPages,
  currentPage,
  onPageChange,
  onApprove,
  onReject,
  onDelete,
}: TimeOffRequestListProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Loại nghỉ phép</TableHead>
                <TableHead>Từ ngày</TableHead>
                <TableHead>Đến ngày</TableHead>
                <TableHead>Số ngày</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người duyệt</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Không có yêu cầu nghỉ phép nào
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {request.employee?.firstName}{' '}
                          {request.employee?.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.employee?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {typeLabels[request.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(request.startDate)}</TableCell>
                    <TableCell>{formatDate(request.endDate)}</TableCell>
                    <TableCell>
                      {calculateDays(request.startDate, request.endDate)} ngày
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-xs truncate"
                        title={request.reason || '-'}
                      >
                        {request.reason || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[request.status]}>
                        {statusLabels[request.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.reviewedBy ? (
                        <div className="text-sm">
                          <div>
                            {request.reviewedBy.firstName}{' '}
                            {request.reviewedBy.lastName}
                          </div>
                          {request.reviewedAt && (
                            <div className="text-muted-foreground">
                              {formatDate(request.reviewedAt)}
                            </div>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {request.status === TimeOffRequestStatus.PENDING && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onApprove(request)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onReject(request)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(request.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <div className="flex items-center px-4">
              Trang {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
