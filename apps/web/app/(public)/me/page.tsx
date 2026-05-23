'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Camera, Key, EyeOff, Eye, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  changePasswordFormSchema,
  ChangePasswordFormValues,
  useChangePasswordMutation,
  userFormSchema,
  UserFormValues,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from '@/features/user';
import { MESSAGES } from '@/constants/message';
import { ApiError } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
const Profile = () => {
  const { user, loadUser, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Inside ProfileSection component, after the updateProfileMutation
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const profileForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      phone: user?.phone || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });
  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const changePasswordMutation = useChangePasswordMutation();
  const updateProfileMutation = useUpdateProfileMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Choose image only');
      return;
    }

    uploadAvatarMutation.mutate(file, {
      onSuccess: () => {
        toast.success(MESSAGES.USER.UPDATE_PROFILE_SUCCESS);
        loadUser();
      },
      onError: (err) => {
        const error = err as ApiError;
        console.error('Edit user error:', error);
        toast.error(
          error?.response?.data.message || MESSAGES.USER.UPDATE_PROFILE_FAILED,
        );
      },
    });
  };
  const onProfileSubmit = async (data: UserFormValues) => {
    if (!user) {
      toast.error(MESSAGES.USER.UPDATE_PROFILE_FAILED);
      return;
    }
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        toast.success(MESSAGES.USER.UPDATE_PROFILE_SUCCESS);
        loadUser();
      },
      onError: (err) => {
        const error = err as ApiError;
        console.error('Edit user error:', error);
        toast.error(
          error?.response?.data.message || MESSAGES.USER.UPDATE_PROFILE_FAILED,
        );
      },
    });
  };
  const onChangePasswordSubmit = async (data: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        toast.success(MESSAGES.USER.UPDATE_PROFILE_SUCCESS);
      },
      onError: (err) => {
        const error = err as ApiError;
        console.error('Edit user error:', error);
        toast.error(
          error?.response?.data.message || MESSAGES.USER.UPDATE_PROFILE_FAILED,
        );
      },
    });
  };
  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              {uploadAvatarMutation.isPending || loading ? (
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user?.avatar?.url || undefined}
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {user?.firstName?.[0] || ''}
                    {user?.lastName?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
              )}
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-2 border-background"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadAvatarMutation.isPending}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={handleFileChange}
              />
            </div>
            <div>
              <h3 className="text-xl mb-1">
                {user?.firstName || ''} {user?.lastName || ''}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                {user?.email || ''}
              </p>
              <p className="text-sm text-muted-foreground">
                Member since {user?.createdAt?.substring(0, 10) || ''}
              </p>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Profile Form */}
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FieldGroup>
                <Controller
                  name="firstName"
                  control={profileForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>First Name</FieldLabel>
                      <div className="col-span-3">
                        <Input {...field} placeholder="Enter first name" />
                        {fieldState.invalid && (
                          <FieldError>{fieldState.error?.message}</FieldError>
                        )}
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>
              <FieldGroup>
                <Controller
                  name="lastName"
                  control={profileForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Last Name</FieldLabel>
                      <div className="col-span-3">
                        <Input {...field} placeholder="Enter last name" />
                        {fieldState.invalid && (
                          <FieldError>{fieldState.error?.message}</FieldError>
                        )}
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>
                   
            <Separator />

            <div className="flex justify-end gap-4 mt-5">
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={changePasswordForm.handleSubmit(onChangePasswordSubmit)}
            className="space-y-4"
          >
            <FieldGroup>
              <Controller
                name="currentPassword"
                control={changePasswordForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Current password</FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPassword.current ? 'text' : 'password'}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                      >
                        {showPassword.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="newPassword"
                control={changePasswordForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>New password</FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPassword.new ? 'text' : 'password'}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                      >
                        {showPassword.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="confirmPassword"
                control={changePasswordForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Confirm password</FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPassword.confirm ? 'text' : 'password'}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              className="w-full"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Đổi mật khẩu
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
