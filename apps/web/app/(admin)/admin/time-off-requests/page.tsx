'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Calendar } from 'lucide-react';
import { useTimeOffRequestsQuery } from '@/features/employee-schedules/queries';
import {
  useApproveTimeOffRequestMutation,
  useRejectTimeOffRequestMutation,
  useDeleteTimeOffRequestMutation,
} from '@/features/employee-schedules/mutations';
import {
  TimeOffRequest,
  TimeOffRequestStatus,
  TimeOffRequestType,
} from '@/features/employee-schedules/types';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { TimeOffRequestList } from '@/components/time-off-requests/TimeOffRequestList';
import { ApproveRejectDialog } from '@/components/time-off-requests/ApproveRejectDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  statusLabels,
  typeLabels,
} from '@/components/time-off-requests/constants';

export default function TimeOffRequestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(
    null,
  );
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const queryParams = {
    page,
    limit,
    status:
      statusFilter !== 'all'
        ? (statusFilter as TimeOffRequestStatus)
        : undefined,
    type: typeFilter !== 'all' ? (typeFilter as TimeOffRequestType) : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };

  const { data, isLoading, error } = useTimeOffRequestsQuery(queryParams);
  const approveMutation = useApproveTimeOffRequestMutation();
  const rejectMutation = useRejectTimeOffRequestMutation();
  const deleteMutation = useDeleteTimeOffRequestMutation();

  const requests = data?.data || [];
  const totalPages = data?.meta ? Math.ceil(data.meta.total / limit) : 0;

  const handleApprove = (request: TimeOffRequest) => {
    setSelectedRequest(request);
    setReviewNote('');
    setApproveDialogOpen(true);
  };

  const handleReject = (request: TimeOffRequest) => {
    setSelectedRequest(request);
    setReviewNote('');
    setRejectDialogOpen(true);
  };

  const confirmApprove = () => {
    if (selectedRequest) {
      approveMutation.mutate(
        { id: selectedRequest.id, reviewNote: reviewNote || undefined },
        {
          onSuccess: () => {
            setApproveDialogOpen(false);
            setSelectedRequest(null);
            setReviewNote('');
          },
        },
      );
    }
  };

  const confirmReject = () => {
    if (selectedRequest) {
      rejectMutation.mutate(
        { id: selectedRequest.id, reviewNote: reviewNote || undefined },
        {
          onSuccess: () => {
            setRejectDialogOpen(false);
            setSelectedRequest(null);
            setReviewNote('');
          },
        },
      );
    }
  };

  const handleDelete = (id: string) => {
    setDeleteRequestId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteRequestId) {
      deleteMutation.mutate(deleteRequestId, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeleteRequestId(null);
        },
      });
    }
  };

  const filteredRequests = requests.filter((request) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const employeeName =
      `${request.employee?.firstName || ''} ${request.employee?.lastName || ''}`.toLowerCase();
    const employeeEmail = request.employee?.email?.toLowerCase() || '';
    return (
      employeeName.includes(searchLower) || employeeEmail.includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Yêu cầu nghỉ phép
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý yêu cầu nghỉ phép của nhân viên
          </p>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              {Object.entries(typeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            placeholder="Từ ngày"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Đến ngày"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      ) : error ? (
        <Card className="p-6">
          <p className="text-red-500 text-center">
            Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
          </p>
        </Card>
      ) : (
        <TimeOffRequestList
          requests={filteredRequests}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      )}

      <ApproveRejectDialog
        approveDialogOpen={approveDialogOpen}
        rejectDialogOpen={rejectDialogOpen}
        selectedRequest={selectedRequest}
        reviewNote={reviewNote}
        isApproving={approveMutation.isPending}
        isRejecting={rejectMutation.isPending}
        onApproveDialogChange={setApproveDialogOpen}
        onRejectDialogChange={setRejectDialogOpen}
        onReviewNoteChange={setReviewNote}
        onConfirmApprove={confirmApprove}
        onConfirmReject={confirmReject}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Xóa yêu cầu nghỉ phép"
        description="Bạn có chắc chắn muốn xóa yêu cầu nghỉ phép này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
