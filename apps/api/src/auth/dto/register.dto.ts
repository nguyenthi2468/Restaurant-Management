import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/[a-z]/, { message: 'Password must contain a lowercase letter' })
  @Matches(/[A-Z]/, { message: 'Password must contain an uppercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain a number' })
  @Matches(/[!@#$%^&*]/, {
    message: 'Password must contain a special character',
  })
  password: string;

  @IsString()
  confirmPassword: string;
}
