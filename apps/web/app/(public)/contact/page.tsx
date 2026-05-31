'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Phone, Clock, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCreateContactMutation } from '@/features/contact/mutations';
import {
  createContactSchema,
  CreateContactFormValues,
} from '@/features/contact/validator';
import { PageTitle } from '@/components/common/PageTitle';

export default function ContactPage() {
  const mutation = useCreateContactMutation();

  const form = useForm<CreateContactFormValues>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = (data: CreateContactFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PageTitle
        title="Liên Hệ"
        description="Chúng tôi rất mong nhận được tin từ bạn. Hãy liên hệ với chúng tôi ngay hôm nay!"
      />

      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Information Cards */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Địa Chỉ</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                123 Luxury Avenue
                <br />
                Times Square
                <br />
                New York, NY 10036
                <br />
                United States
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Điện Thoại & Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Điện thoại:</strong>
                <br />
                +1 (555) 123-4567
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Email:</strong>
                <br />
                reservations@hotelo.com
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Giờ Hoạt Động</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Thứ Hai - Thứ Sáu:</strong>{' '}
                9:00 sáng - 6:00 tối
                <br />
                <strong className="text-foreground">Thứ Bảy:</strong> 10:00 sáng
                - 4:00 chiều
                <br />
                <strong className="text-foreground">Chủ Nhật:</strong> Đóng cửa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">
                Gửi Tin Nhắn Cho Chúng Tôi
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Điền vào biểu mẫu dưới đây và chúng tôi sẽ liên hệ lại với bạn
                càng sớm càng tốt. Vui lòng cung cấp email hoặc số điện thoại để
                chúng tôi có thể liên hệ.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup>
                    <Controller
                      name="name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="name" className="text-base">
                            Họ và Tên{' '}
                            <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Input
                            id="name"
                            placeholder="Nguyễn Văn A"
                            className="h-11"
                            {...field}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <span className="text-xs text-destructive mt-1 block">
                              {fieldState.error?.message}
                            </span>
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Controller
                      name="subject"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="subject" className="text-base">
                            Chủ Đề
                          </FieldLabel>
                          <Input
                            id="subject"
                            placeholder="Vấn đề này là gì?"
                            className="h-11"
                            {...field}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <span className="text-xs text-destructive mt-1 block">
                              {fieldState.error?.message}
                            </span>
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup>
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="email" className="text-base">
                            Địa Chỉ Email
                          </FieldLabel>
                          <Input
                            id="email"
                            type="email"
                            placeholder="nguyenvana@example.com"
                            className="h-11"
                            {...field}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <span className="text-xs text-destructive mt-1 block">
                              {fieldState.error?.message}
                            </span>
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Controller
                      name="phone"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="phone" className="text-base">
                            Số Điện Thoại
                          </FieldLabel>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+84 123 456 789"
                            className="h-11"
                            {...field}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <span className="text-xs text-destructive mt-1 block">
                              {fieldState.error?.message}
                            </span>
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </div>

                <FieldGroup>
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="message" className="text-base">
                          Tin Nhắn <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Textarea
                          id="message"
                          placeholder="Hãy cho chúng tôi biết thêm về yêu cầu, câu hỏi hoặc phản hồi của bạn..."
                          rows={6}
                          className="resize-none"
                          {...field}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <span className="text-xs text-destructive mt-1 block">
                            {fieldState.error?.message}
                          </span>
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-destructive">*</span> Các trường bắt
                    buộc
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto min-w-[200px] gap-2"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Gửi Tin Nhắn
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map Section (Optional) */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">Tìm Chúng Tôi Tại Đây</CardTitle>
              <CardDescription>
                Ghé thăm văn phòng của chúng tôi trong giờ làm việc hoặc đặt
                lịch hẹn
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[400px] bg-muted relative">
                {/* Placeholder for map - you can integrate Google Maps or other map services */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.6174339374953!2d-73.98823492346468!3d40.75797097138558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1703234567890!5m2!1sen!2sus"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location Map"
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
