import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBooking,
  updateBooking,
  deleteBooking,
  createVnpayPayment,
  approveDeposit,
  refundDeposit,
  markArrived,
  completeBooking,
  cancelBooking,
} from './api';
import { toast } from 'react-hot-toast';
import { CreateBookingData, UpdateBookingData } from './types';

export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookingData) => createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Đặt bàn thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể đặt bàn');
      console.error(error);
    },
  });
};

export const useUpdateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingData }) =>
      updateBooking(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      toast.success('Cập nhật đặt bàn thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể cập nhật đặt bàn',
      );
      console.error(error);
    },
  });
};

export const useDeleteBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Xóa đặt bàn thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể xóa đặt bàn');
      console.error(error);
    },
  });
};

export const useCreateVnpayPaymentMutation = () => {
  return useMutation({
    mutationFn: (bookingId: string) => createVnpayPayment(bookingId),
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể tạo thanh toán');
      console.error(error);
    },
  });
};

export const useApproveDepositMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => approveDeposit(bookingId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
      toast.success('Duyệt cọc thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể duyệt cọc');
      console.error(error);
    },
  });
};

export const useRefundDepositMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => refundDeposit(bookingId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
      toast.success('Hoàn cọc thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể hoàn cọc');
      console.error(error);
    },
  });
};

export const useMarkArrivedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => markArrived(bookingId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
      toast.success('Đánh dấu đã đến thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể đánh dấu đã đến',
      );
      console.error(error);
    },
  });
};

export const useCompleteBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => completeBooking(bookingId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
      toast.success('Hoàn thành đặt bàn thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể hoàn thành đặt bàn',
      );
      console.error(error);
    },
  });
};

export const useCancelBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
      toast.success('Hủy đặt bàn thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể hủy đặt bàn');
      console.error(error);
    },
  });
};
