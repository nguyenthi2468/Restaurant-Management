# Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ UserRole : "has"
    Role ||--o{ UserRole : "has"

    Role ||--o{ RolePermission : "has"
    Permission ||--o{ RolePermission : "has"

    Permission ||--o{ ApiActionPolicy : "has"
    ApiAction ||--o{ ApiActionPolicy : "has"

    User ||--o{ AuthSession : "has"
    User ||--o{ EmailVerifyToken : "has"
    User ||--o{ PasswordResetToken : "has"

    User ||--o| ImageAsset : "avatar"

    User ||--o{ FolderGallery : "owns"
    FolderGallery ||--o{ ImageGallery : "contains"
    User ||--o{ ImageGallery : "uploads"

    ImageGallery ||--o{ MenuCategory : "image"
    ImageGallery ||--o{ MenuItem : "image"
    ImageGallery ||--o{ News : "image"

    Floor ||--o{ Table : "has"

    User ||--o{ Order : "creates"
    User ||--o{ Order : "customer"
    Order ||--o{ OrderItem : "contains"
    Order ||--o{ OrderTable : "uses"
    Order ||--o{ Payment : "has"
    Order ||--o{ KitchenTicket : "generates"

    Table ||--o{ OrderTable : "in"

    MenuCategory ||--o{ MenuItem : "contains"
    MenuItem ||--o{ OrderItem : "ordered"
    MenuItem ||--o{ MenuItemIngredient : "requires"
    MenuItem ||--o{ BookingMenuItem : "pre-ordered"
    MenuItem ||--o{ KitchenTicketItem : "in"

    User ||--o{ Booking : "makes"
    Booking ||--o{ BookingTable : "reserves"
    Booking ||--o{ BookingMenuItem : "pre-orders"
    Booking ||--o{ Payment : "has"

    Table ||--o{ BookingTable : "reserved"

    KitchenTicket ||--o{ KitchenTicketItem : "contains"

    Shift ||--o{ EmployeeSchedule : "scheduled"
    User ||--o{ EmployeeSchedule : "assigned"

    User ||--o{ TimeOffRequest : "requests"
    User ||--o{ TimeOffRequest : "reviews"

    User ||--o{ Attendance : "records"

    User ||--o{ ContactMessage : "sends"
    User ||--o{ ContactMessage : "handles"

    User ||--o{ News : "creates"
```

## Giải thích các mối quan hệ

### Quản lý người dùng & phân quyền

- **User - UserRole - Role**: Người dùng có nhiều vai trò thông qua bảng trung gian UserRole
- **Role - RolePermission - Permission**: Vai trò có nhiều quyền thông qua bảng trung gian RolePermission
- **Permission - ApiActionPolicy - ApiAction**: Quyền được ánh xạ tới các hành động API

### Xác thực & bảo mật

- **User - AuthSession**: Một người dùng có nhiều phiên đăng nhập
- **User - EmailVerifyToken**: Một người dùng có nhiều token xác thực email
- **User - PasswordResetToken**: Một người dùng có nhiều token đặt lại mật khẩu

### Quản lý hình ảnh

- **User - ImageAsset**: Một người dùng có một ảnh đại diện
- **User - FolderGallery - ImageGallery**: Người dùng tạo thư mục chứa nhiều hình ảnh
- **ImageGallery - MenuCategory/MenuItem/News**: Hình ảnh được sử dụng cho danh mục thực đơn, món ăn và tin tức

### Quản lý bàn & tầng

- **Floor - Table**: Một tầng có nhiều bàn

### Quản lý đơn hàng

- **User - Order**: Người dùng tạo đơn hàng (nhân viên) và là khách hàng
- **Order - OrderItem**: Một đơn hàng có nhiều món
- **Order - OrderTable**: Một đơn hàng sử dụng nhiều bàn (many-to-many)
- **Table - OrderTable**: Một bàn có thể phục vụ nhiều đơn hàng
- **MenuItem - OrderItem**: Món ăn được đặt trong nhiều đơn hàng

### Quản lý thực đơn

- **MenuCategory - MenuItem**: Một danh mục có nhiều món ăn
- **MenuItem - MenuItemIngredient**: Một món ăn có nhiều nguyên liệu

### Quản lý đặt bàn

- **User - Booking**: Người dùng tạo nhiều đặt bàn
- **Booking - BookingTable**: Một đặt bàn có nhiều bàn (many-to-many)
- **Table - BookingTable**: Một bàn có thể được đặt nhiều lần
- **Booking - BookingMenuItem**: Đặt bàn có thể đặt trước món ăn
- **MenuItem - BookingMenuItem**: Món ăn có thể được đặt trước

### Quản lý thanh toán

- **Order - Payment**: Một đơn hàng có nhiều thanh toán
- **Booking - Payment**: Một đặt bàn có nhiều thanh toán

### Quản lý bếp

- **Order - KitchenTicket**: Một đơn hàng tạo nhiều phiếu bếp
- **KitchenTicket - KitchenTicketItem**: Một phiếu bếp có nhiều món
- **MenuItem - KitchenTicketItem**: Món ăn xuất hiện trong nhiều phiếu bếp

### Quản lý nhân viên

- **Shift - EmployeeSchedule**: Một ca làm việc có nhiều lịch nhân viên
- **User - EmployeeSchedule**: Một nhân viên có nhiều lịch làm việc
- **User - TimeOffRequest**: Nhân viên tạo yêu cầu nghỉ phép và người khác duyệt
- **User - Attendance**: Một nhân viên có nhiều bản ghi chấm công

### Quản lý liên hệ & tin tức

- **User - ContactMessage**: Người dùng gửi và xử lý tin nhắn liên hệ
- **User - News**: Người dùng tạo tin tức
