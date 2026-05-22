import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import {
  Booking,
  BookingQueryParams,
  CreateBookingData,
  PaginatedBookingResponse,
  UpdateBookingData,
  VnpayPaymentResponse,
} from './types';

export const getBookings = async () => {
  const response = await api.get<Booking[]>(API_ENDPOINTS.BOOKINGS.BASE);
  return response.data;
};

export const getBookingsWithPagination = async (
  params?: BookingQueryParams,
) => {
  const response = await api.get<PaginatedBookingResponse>(
    API_ENDPOINTS.BOOKINGS.BASE,
    { params },
  );
  return response.data;
};

export const getBookingById = async (id: string) => {
  const response = await api.get<Booking>(
    `${API_ENDPOINTS.BOOKINGS.BASE}/${id}`,
  );
  return response.data;
};

export const createBooking = async (data: CreateBookingData) => {
  const response = await api.post<Booking>(API_ENDPOINTS.BOOKINGS.BASE, data);
  return response.data;
};

export const updateBooking = async (id: string, data: UpdateBookingData) => {
  const response = await api.patch<Booking>(
    `${API_ENDPOINTS.BOOKINGS.BASE}/${id}`,
    data,
  );
  return response.data;
};

export const deleteBooking = async (id: string) => {
  const response = await api.delete<Booking>(
    `${API_ENDPOINTS.BOOKINGS.BASE}/${id}`,
  );
  return response.data;
};

export const createVnpayPayment = async (bookingId: string) => {
  const response = await api.post<VnpayPaymentResponse>(
    `${API_ENDPOINTS.BOOKINGS.BASE}/${bookingId}/pay`,
  );
  return response.data;
};

export const handleVnpayReturn = async (query: Record<string, any>) => {
  const response = await api.get<Booking>(API_ENDPOINTS.BOOKINGS.VNPAY_RETURN, {
    params: query,
  });
  return response.data;
};

export const approveDeposit = async (bookingId: string) => {
  const response = await api.post<Booking>(
    `${API_ENDPOINTS.BOOKINGS.BASE}/${bookingId}/approve-deposit`,
  );
  return response.data;
};

export const refundDeposit = async (bookingId: string) => {
  const response = await api.post<Booking>(
    `${API_ENDPOINTS.BOOKINGS.BASE}/${bookingId}/refund-deposit`,
  );
  return response.data;
};

export const markArrived = async (bookingId: string) => {
  const response = await api.post<Booking>(
    `${API_ENDPOINTS.BOOKINGS.BASE}/${bookingId}/arrive`,
  );
  return response.data;
};

export const completeBooking = async (bookingId: string) => {
  const response = await api.post<Booking>(
    `${API_ENDPOINTS.BOOKINGS.BASE}/${bookingId}/complete`,
  );
  return response.data;
};

export const cancelBooking = async (bookingId: string) => {
  const response = await api.post<Booking>(
    `${API_ENDPOINTS.BOOKINGS.BASE}/${bookingId}/cancel`,
  );
  return response.data;
};
