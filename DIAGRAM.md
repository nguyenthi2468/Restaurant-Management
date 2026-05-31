# Sơ Đồ Chức Năng Hệ Thống Quản Lý Nhà Hàng

## Sơ Đồ Tổng Quan

```mermaid
graph TD
    A[HỆ THỐNG QUẢN LÝ NHÀ HÀNG]

    A --> B[Quản Trị Hệ Thống]
    A --> C[Quản Lý Vận Hành]
    A --> D[Nhân Viên Phục Vụ]
    A --> E[Bếp]
    A --> F[Thu Ngân]
    A --> G[Khách Hàng]

    B --> B1[Quản lý người dùng]
    B --> B2[Quản lý vai trò]
    B --> B3[Quản lý quyền hạn]
    B --> B4[Quản lý hành động]
    B --> B5[Báo cáo thống kê]

    C --> C1[Quản lý tầng/khu vực]
    C --> C2[Quản lý bàn ăn]
    C --> C3[Quản lý danh mục món]
    C --> C4[Quản lý món ăn]
    C --> C5[Quản lý lịch làm việc]
    C --> C6[Quản lý tin tức]
    C --> C7[Quản lý liên hệ]
    C --> C8[Quản lý thư viện ảnh]

    D --> D1[Quản lý đặt bàn]
    D --> D2[Quản lý đơn hàng]
    D --> D3[Quản lý món trong đơn]
    D --> D4[Chấm công]

    E --> E1[Xem phiếu bếp]
    E --> E2[Cập nhật trạng thái món]
    E --> E3[Quản lý món cần làm]

    F --> F1[Xử lý thanh toán]
    F --> F2[In hóa đơn]
    F --> F3[Báo cáo doanh thu]

    G --> G1[Đăng ký/Đăng nhập]
    G --> G2[Đặt bàn online]
    G --> G3[Xem thực đơn]
    G --> G4[Chat hỗ trợ]
    G --> G5[Liên hệ]
    G --> G6[Xem tin tức]
```

## Sơ Đồ Chi Tiết Theo Module

### 1. Module Xác Thực & Người Dùng

```mermaid
graph LR
    A[Xác Thực & Người Dùng]
    A --> B[Đăng ký]
    A --> C[Đăng nhập]
    A --> D[Đăng nhập Google]
    A --> E[Quên mật khẩu]
    A --> F[Đổi mật khẩu]
    A --> G[Quản lý hồ sơ]
    A --> H[Quản lý avatar]
```

### 2. Module Phân Quyền

```mermaid
graph TD
    A[Hệ Thống Phân Quyền]
    A --> B[Vai Trò]
    A --> C[Quyền Hạn]
    A --> D[Hành Động]

    B --> B1[Admin]
    B --> B2[Manager]
    B --> B3[Staff]
    B --> B4[Kitchen]
    B --> B5[Cashier]
    B --> B6[Waiter]

    C --> C1[Create]
    C --> C2[Read]
    C --> C3[Update]
    C --> C4[Delete]
```

### 3. Module Quản Lý Bàn & Tầng

```mermaid
graph LR
    A[Quản Lý Bàn & Tầng]
    A --> B[Quản lý tầng]
    A --> C[Quản lý bàn]

    B --> B1[Thêm tầng]
    B --> B2[Sửa tầng]
    B --> B3[Xóa tầng]

    C --> C1[Thêm bàn]
    C --> C2[Sửa bàn]
    C --> C3[Xóa bàn]
    C --> C4[Kiểm tra bàn trống]
    C --> C5[Xem trạng thái bàn]
```

### 4. Module Thực Đơn

```mermaid
graph LR
    A[Quản Lý Thực Đơn]
    A --> B[Danh mục món]
    A --> C[Món ăn]

    B --> B1[Thêm danh mục]
    B --> B2[Sửa danh mục]
    B --> B3[Xóa danh mục]

    C --> C1[Thêm món]
    C --> C2[Sửa món]
    C --> C3[Xóa món]
    C --> C4[Tìm kiếm món]
    C --> C5[Quản lý giá]
    C --> C6[Upload ảnh món]
```

### 5. Module Đặt Bàn

```mermaid
graph TD
    A[Quản Lý Đặt Bàn]
    A --> B[Tạo đặt bàn]
    A --> C[Xác nhận đặt bàn]
    A --> D[Hủy đặt bàn]
    A --> E[Cập nhật đặt bàn]

    B --> B1[Chọn thời gian]
    B --> B2[Chọn bàn]
    B --> B3[Đặt món trước]
    B --> B4[Đặt cọc VNPay]

    E --> E1[Gửi email xác nhận]
    E --> E2[Thông báo real-time]
```

### 6. Module Đơn Hàng

```mermaid
graph TD
    A[Quản Lý Đơn Hàng]
    A --> B[Tạo đơn hàng]
    A --> C[Thêm món vào đơn]
    A --> D[Cập nhật trạng thái]
    A --> E[Hoàn thành đơn]
    A --> F[Hủy đơn]

    C --> C1[Chọn món]
    C --> C2[Số lượng]
    C --> C3[Ghi chú món]

    D --> D1[PENDING]
    D --> D2[SERVED]
    D --> D3[COMPLETED]
    D --> D4[CANCELLED]
```

### 7. Module Bếp

```mermaid
graph LR
    A[Quản Lý Bếp]
    A --> B[Nhận phiếu bếp]
    A --> C[Danh sách món cần làm]
    A --> D[Cập nhật trạng thái]
    A --> E[Hoàn thành món]

    D --> D1[Đang chờ]
    D --> D2[Đang làm]
    D --> D3[Hoàn thành]
```

### 8. Module Thu Ngân & Thanh Toán

```mermaid
graph TD
    A[Thu Ngân & Thanh Toán]
    A --> B[Xem đơn cần thanh toán]
    A --> C[Xử lý thanh toán]
    A --> D[In hóa đơn]
    A --> E[Báo cáo doanh thu]

    C --> C1[Tiền mặt]
    C --> C2[VNPay]
    C --> C3[Lịch sử thanh toán]
```

### 9. Module Nhân Viên

```mermaid
graph LR
    A[Quản Lý Nhân Viên]
    A --> B[Lịch làm việc]
    A --> C[Chấm công]
    A --> D[Nghỉ phép]
    A --> E[Báo cáo]

    B --> B1[Tạo ca làm]
    B --> B2[Phân công]

    C --> C1[Clock In]
    C --> C2[Clock Out]

    D --> D1[Yêu cầu nghỉ]
    D --> D2[Duyệt nghỉ]
```

### 10. Module Nội Dung & Truyền Thông

```mermaid
graph LR
    A[Nội Dung & Truyền Thông]
    A --> B[Tin tức]
    A --> C[Liên hệ]
    A --> D[Thư viện ảnh]
    A --> E[Chat]

    B --> B1[Thêm tin]
    B --> B2[Sửa tin]
    B --> B3[Xóa tin]

    C --> C1[Nhận liên hệ]
    C --> C2[Trả lời]

    D --> D1[Upload ảnh]
    D --> D2[Quản lý ảnh]

    E --> E1[Chat real-time]
    E --> E2[AI hỗ trợ]
```

## Luồng Hoạt Động Chính

### Luồng Đặt Bàn

```mermaid
sequenceDiagram
    participant K as Khách Hàng
    participant S as Hệ Thống
    participant NV as Nhân Viên
    participant E as Email

    K->>S: Chọn thời gian & số người
    S->>S: Kiểm tra bàn trống
    S->>K: Hiển thị bàn available
    K->>S: Chọn bàn & đặt món (optional)
    K->>S: Thanh toán đặt cọc (VNPay)
    S->>NV: Thông báo đặt bàn mới
    NV->>S: Xác nhận đặt bàn
    S->>E: Gửi email xác nhận
    E->>K: Nhận email xác nhận
```

### Luồng Đơn Hàng

```mermaid
sequenceDiagram
    participant NV as Nhân Viên
    participant S as Hệ Thống
    participant B as Bếp
    participant TN as Thu Ngân
    participant K as Khách

    NV->>S: Tạo đơn cho bàn
    NV->>S: Thêm món vào đơn
    S->>B: Gửi phiếu bếp
    B->>S: Cập nhật trạng thái món
    B->>S: Hoàn thành món
    S->>NV: Thông báo món sẵn sàng
    NV->>S: Phục vụ món
    K->>NV: Yêu cầu thanh toán
    NV->>TN: Chuyển đơn thanh toán
    TN->>S: Xử lý thanh toán
    TN->>K: In hóa đơn
    S->>S: Đóng đơn & giải phóng bàn
```

### Luồng Chấm Công

```mermaid
sequenceDiagram
    participant NV as Nhân Viên
    participant S as Hệ Thống
    participant QL as Quản Lý

    NV->>S: Clock In (bắt đầu ca)
    S->>S: Ghi nhận thời gian vào
    NV->>S: Làm việc...
    NV->>S: Clock Out (kết thúc ca)
    S->>S: Tính giờ làm việc
    S->>QL: Tạo báo cáo chấm công
    QL->>S: Xem & duyệt báo cáo
```

## Kiến Trúc Phân Quyền (RBAC)

```mermaid
graph TD
    A[User - Người Dùng]
    B[Role - Vai Trò]
    C[Permission - Quyền Hạn]
    D[Action - Hành Động]

    A -->|has| B
    B -->|has| C
    C -->|controls| D

    B1[Admin]
    B2[Manager]
    B3[Staff]
    B4[Kitchen]
    B5[Cashier]
    B6[Waiter]

    B --> B1
    B --> B2
    B --> B3
    B --> B4
    B --> B5
    B --> B6

    C1[Create]
    C2[Read]
    C3[Update]
    C4[Delete]

    C --> C1
    C --> C2
    C --> C3
    C --> C4
```

## Công Nghệ & Tích Hợp

```mermaid
graph TD
    A[Hệ Thống Quản Lý Nhà Hàng]

    A --> B[Backend - NestJS]
    A --> C[Frontend - Next.js]
    A --> D[Database - PostgreSQL]

    B --> B1[Authentication - JWT]
    B --> B2[Payment - VNPay]
    B --> B3[Upload - Cloudinary]
    B --> B4[Real-time - Pusher]
    B --> B5[Email - NodeMailer]
    B --> B6[ORM - Prisma]

    C --> C1[UI - Shadcn/Radix]
    C --> C2[Styling - Tailwind CSS]
    C --> C3[State - React Query]
    C --> C4[Forms - React Hook Form]
    C --> C5[Validation - Zod]
```

## Tổng Quan Các Module Theo Vai Trò

| Vai Trò          | Modules Được Phép Truy Cập                                                                                            |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Admin**        | Tất cả modules                                                                                                        |
| **Manager**      | Người dùng, Vai trò, Quyền hạn, Tầng/Bàn, Thực đơn, Đặt bàn, Đơn hàng, Nhân viên, Tin tức, Liên hệ, Thư viện, Báo cáo |
| **Staff/Waiter** | Đặt bàn, Đơn hàng, Món trong đơn, Bàn ăn, Thực đơn (xem), Chấm công                                                   |
| **Kitchen**      | Bếp, Phiếu bếp, Món cần làm, Chấm công                                                                                |
| **Cashier**      | Thu ngân, Thanh toán, Hóa đơn, Báo cáo doanh thu, Chấm công                                                           |
| **Customer**     | Đăng ký/Đăng nhập, Đặt bàn, Xem thực đơn, Chat, Liên hệ, Tin tức                                                      |

## Ghi Chú

- Sơ đồ được tạo bằng Mermaid để dễ dàng chỉnh sửa và bảo trì
- Các module được tổ chức theo vai trò người dùng
- Luồng hoạt động thể hiện tương tác giữa các thành phần
- Kiến trúc RBAC đảm bảo phân quyền linh hoạt và bảo mật
