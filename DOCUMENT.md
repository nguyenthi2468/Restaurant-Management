# Bảng Chức Năng Hệ Thống Quản Lý Nhà Hàng

## Danh Sách Các Chức Năng Đã Triển Khai

| STT | Kết quả cần đạt được              | Tiêu chí đánh giá                                                                                                                                                                         |
| --- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Quản lý người dùng                | Hỗ trợ các chức năng: thêm, xóa, cập nhật, tìm kiếm người dùng, quản lý hồ sơ cá nhân, phân quyền người dùng, quản lý avatar người dùng                                                   |
| 2   | Quản lý vai trò                   | Hỗ trợ các chức năng: thêm, xóa, cập nhật, tìm kiếm vai trò, gán quyền cho vai trò, gán vai trò cho người dùng                                                                            |
| 3   | Quản lý quyền hạn                 | Hỗ trợ các chức năng: thêm, xóa, cập nhật, tìm kiếm quyền hạn, phân quyền chi tiết cho từng vai trò                                                                                       |
| 4   | Quản lý hành động                 | Hỗ trợ các chức năng: thêm, xóa, cập nhật, tìm kiếm hành động hệ thống, gán quyền cho hành động                                                                                           |
| 5   | Đăng ký và đăng nhập              | Cho phép người dùng tạo tài khoản, đăng nhập, đăng xuất, xác thực email, quên mật khẩu, đặt lại mật khẩu, đổi mật khẩu, làm mới token, đăng nhập bằng Google                              |
| 6   | Quản lý tầng/khu vực              | Hỗ trợ các chức năng: thêm, xóa, cập nhật, tìm kiếm tầng/khu vực nhà hàng                                                                                                                 |
| 7   | Quản lý bàn ăn                    | Hỗ trợ các chức năng: thêm, xóa, cập nhật, tìm kiếm bàn ăn, kiểm tra bàn trống, xem trạng thái bàn, phân trang danh sách bàn                                                              |
| 8   | Quản lý danh mục món ăn           | Hỗ trợ các chức năng: thêm, xóa, cập nhật, tìm kiếm danh mục thực đơn                                                                                                                     |
| 9   | Quản lý món ăn                    | Hỗ trợ các chức năng: thêm, xóa, cập nhật, tìm kiếm món ăn trong thực đơn, phân trang danh sách món ăn, quản lý giá và mô tả món                                                          |
| 10  | Quản lý đặt bàn                   | Hỗ trợ các chức năng: tạo đặt bàn, hủy đặt bàn, xác nhận đặt bàn, cập nhật thông tin đặt bàn, xem danh sách đặt bàn, quản lý đặt cọc, thanh toán đặt bàn qua VNPay, đặt món trước khi đến |
| 11  | Quản lý đơn hàng                  | Hỗ trợ các chức năng: tạo đơn hàng, cập nhật trạng thái đơn, hoàn thành đơn hàng, hủy đơn hàng, xem danh sách đơn hàng, thêm ghi chú đơn hàng, quản lý thông tin khách hàng               |
| 12  | Quản lý món trong đơn             | Hỗ trợ các chức năng: thêm món vào đơn, xóa món khỏi đơn, cập nhật số lượng món, cập nhật ghi chú món ăn                                                                                  |
| 13  | Quản lý bếp                       | Hỗ trợ các chức năng: tạo phiếu bếp, cập nhật trạng thái món ăn đang chế biến, xem danh sách món cần làm, đánh dấu món hoàn thành                                                         |
| 14  | Quản lý thu ngân                  | Hỗ trợ các chức năng: xem danh sách đơn hàng cần thanh toán, xử lý thanh toán, in hóa đơn                                                                                                 |
| 15  | Quản lý thanh toán                | Hỗ trợ các chức năng: thanh toán tiền mặt, thanh toán qua VNPay, xem lịch sử thanh toán, quản lý trạng thái thanh toán                                                                    |
| 16  | Quản lý lịch làm việc nhân viên   | Hỗ trợ các chức năng: tạo lịch làm việc, cập nhật lịch làm việc, quản lý ca làm việc, chấm công nhân viên (clock in/out), quản lý yêu cầu nghỉ phép, xem báo cáo chấm công                |
| 17  | Quản lý tin tức                   | Hỗ trợ các chức năng: thêm, xóa, cập nhật, tìm kiếm tin tức, hiển thị tin tức trên website                                                                                                |
| 18  | Quản lý liên hệ                   | Hỗ trợ các chức năng: nhận thông tin liên hệ từ khách hàng, xem danh sách liên hệ, cập nhật trạng thái xử lý, trả lời liên hệ                                                             |
| 19  | Quản lý thư viện ảnh              | Hỗ trợ các chức năng: upload ảnh, xóa ảnh, xem thư viện ảnh, quản lý ảnh món ăn và nhà hàng                                                                                               |
| 20  | Chat                              | Hỗ trợ các chức năng: chat trực tuyến giữa nhân viên và khách hàng, lưu trữ lịch sử chat                                                                                                  |
| 21  | AI hỗ trợ                         | Hỗ trợ các chức năng: tích hợp AI để hỗ trợ tư vấn khách hàng, gợi ý món ăn                                                                                                               |
| 22  | Upload ảnh (Cloudinary)           | Hỗ trợ các chức năng: upload ảnh lên cloud, tối ưu hóa ảnh, quản lý storage                                                                                                               |
| 23  | Thông báo thời gian thực (Pusher) | Hỗ trợ các chức năng: gửi thông báo real-time cho đơn hàng mới, cập nhật trạng thái bàn, thông báo đặt bàn                                                                                |
| 24  | Gửi email                         | Hỗ trợ các chức năng: gửi email xác thực tài khoản, gửi email đặt lại mật khẩu, gửi email xác nhận đặt bàn, gửi email thông báo                                                           |

## Mô Tả Chi Tiết Các Module

### 1. Module Xác Thực (Authentication)

- **Đăng ký**: Tạo tài khoản mới với email, mật khẩu
- **Đăng nhập**: Xác thực người dùng bằng email/password hoặc Google OAuth
- **Xác thực email**: Gửi và xác nhận email kích hoạt tài khoản
- **Quên mật khẩu**: Gửi link đặt lại mật khẩu qua email
- **Đặt lại mật khẩu**: Cho phép người dùng tạo mật khẩu mới
- **Đổi mật khẩu**: Thay đổi mật khẩu khi đã đăng nhập
- **Làm mới token**: Refresh access token khi hết hạn
- **Đăng xuất**: Hủy session và token

### 2. Module Quản Lý Người Dùng (Users)

- **CRUD người dùng**: Tạo, đọc, cập nhật, xóa thông tin người dùng
- **Quản lý hồ sơ**: Cập nhật thông tin cá nhân (tên, email, số điện thoại)
- **Quản lý avatar**: Upload và cập nhật ảnh đại diện
- **Phân quyền**: Gán vai trò và quyền hạn cho người dùng
- **Tìm kiếm và lọc**: Tìm kiếm người dùng theo nhiều tiêu chí

### 3. Module Vai Trò và Quyền Hạn (Roles & Permissions)

- **Quản lý vai trò**: Tạo, cập nhật, xóa vai trò (Admin, Manager, Staff, Cashier, Kitchen, Waiter)
- **Quản lý quyền hạn**: Định nghĩa các quyền chi tiết (create, read, update, delete)
- **Gán quyền cho vai trò**: Phân quyền linh hoạt cho từng vai trò
- **Gán vai trò cho người dùng**: Phân quyền người dùng theo vai trò
- **Kiểm tra quyền**: Guard và decorator để bảo vệ API endpoints

### 4. Module Quản Lý Hành Động (Actions)

- **Định nghĩa hành động**: Quản lý các hành động hệ thống
- **Gán quyền cho hành động**: Phân quyền chi tiết cho từng hành động
- **Kiểm soát truy cập**: Action guard để bảo vệ các chức năng

### 5. Module Quản Lý Tầng và Bàn (Floor & Tables)

- **Quản lý tầng**: Tạo, cập nhật, xóa tầng/khu vực nhà hàng
- **Quản lý bàn**: CRUD bàn ăn với thông tin số ghế, vị trí
- **Kiểm tra bàn trống**: API kiểm tra bàn available theo thời gian
- **Trạng thái bàn**: Theo dõi trạng thái bàn (trống, đang sử dụng, đã đặt)
- **Phân trang**: Hỗ trợ phân trang danh sách bàn

### 6. Module Thực Đơn (Menu)

- **Quản lý danh mục**: CRUD danh mục món ăn (Khai vị, Món chính, Tráng miệng, Đồ uống)
- **Quản lý món ăn**: CRUD món ăn với thông tin chi tiết (tên, giá, mô tả, ảnh)
- **Tìm kiếm món**: Tìm kiếm và lọc món ăn theo danh mục, giá, tên
- **Phân trang**: Hỗ trợ phân trang danh sách món ăn

### 7. Module Đặt Bàn (Booking)

- **Tạo đặt bàn**: Khách hàng đặt bàn với thông tin (tên, SĐT, email, thời gian, số người)
- **Chọn bàn**: Chọn bàn cụ thể khi đặt
- **Đặt món trước**: Cho phép đặt món trước khi đến nhà hàng
- **Quản lý đặt cọc**: Yêu cầu và quản lý tiền đặt cọc
- **Thanh toán VNPay**: Tích hợp VNPay để thanh toán đặt cọc online
- **Trạng thái đặt bàn**: PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
- **Xác nhận/Hủy**: Nhân viên xác nhận hoặc hủy đặt bàn
- **Tìm kiếm**: Tìm kiếm đặt bàn theo thời gian, trạng thái, khách hàng

### 8. Module Đơn Hàng (Orders)

- **Tạo đơn hàng**: Tạo đơn cho bàn với thông tin khách hàng
- **Thêm món**: Thêm món vào đơn hàng
- **Cập nhật trạng thái**: PENDING, SERVED, COMPLETED, CANCELLED
- **Ghi chú đơn**: Thêm ghi chú cho đơn hàng
- **Tính tổng tiền**: Tự động tính tổng tiền đơn hàng
- **Hoàn thành đơn**: Xử lý hoàn thành và thanh toán đơn
- **Lịch sử đơn**: Xem lịch sử đơn hàng

### 9. Module Món Trong Đơn (Order Items)

- **Thêm món**: Thêm món vào đơn hàng đang mở
- **Cập nhật số lượng**: Thay đổi số lượng món
- **Xóa món**: Xóa món khỏi đơn hàng
- **Ghi chú món**: Thêm ghi chú đặc biệt cho món (ít cay, không hành, v.v.)
- **Cập nhật giá**: Quản lý giá món tại thời điểm đặt

### 10. Module Bếp (Kitchen)

- **Phiếu bếp**: Tạo phiếu bếp từ đơn hàng
- **Danh sách món cần làm**: Hiển thị các món đang chờ chế biến
- **Cập nhật trạng thái**: Đánh dấu món đang làm, hoàn thành
- **Ưu tiên món**: Sắp xếp thứ tự ưu tiên chế biến

### 11. Module Thu Ngân (Cashier)

- **Danh sách đơn cần thanh toán**: Xem các đơn đã hoàn thành chờ thanh toán
- **Xử lý thanh toán**: Nhận thanh toán tiền mặt hoặc online
- **In hóa đơn**: Tạo và in hóa đơn cho khách
- **Báo cáo doanh thu**: Xem báo cáo doanh thu theo ca, ngày

### 12. Module Thanh Toán (Payments)

- **Thanh toán tiền mặt**: Xử lý thanh toán bằng tiền mặt
- **Thanh toán VNPay**: Tích hợp cổng thanh toán VNPay
- **Lịch sử thanh toán**: Lưu trữ và xem lịch sử giao dịch
- **Trạng thái thanh toán**: Theo dõi trạng thái (pending, paid, refunded)

### 13. Module Lịch Làm Việc Nhân Viên (Employee Schedules)

- **Quản lý ca làm việc**: Tạo và quản lý các ca làm việc (sáng, chiều, tối)
- **Phân công lịch**: Phân công nhân viên vào các ca
- **Chấm công**: Clock in/out tự động hoặc thủ công
- **Yêu cầu nghỉ phép**: Nhân viên gửi yêu cầu nghỉ, quản lý duyệt/từ chối
- **Báo cáo chấm công**: Xem báo cáo giờ làm việc, nghỉ phép

### 14. Module Tin Tức (News)

- **CRUD tin tức**: Tạo, đọc, cập nhật, xóa bài viết tin tức
- **Hiển thị website**: Hiển thị tin tức trên trang web công khai
- **Phân loại**: Phân loại tin tức theo chủ đề
- **Tìm kiếm**: Tìm kiếm tin tức theo tiêu đề, nội dung

### 15. Module Liên Hệ (Contact)

- **Form liên hệ**: Nhận thông tin liên hệ từ khách hàng
- **Quản lý liên hệ**: Xem danh sách, cập nhật trạng thái xử lý
- **Trả lời**: Gửi email trả lời khách hàng
- **Phân loại**: Phân loại liên hệ theo loại (góp ý, khiếu nại, hỏi đáp)

### 16. Module Thư Viện Ảnh (Gallery)

- **Upload ảnh**: Upload ảnh nhà hàng, món ăn
- **Quản lý ảnh**: Xem, xóa, sắp xếp ảnh
- **Tích hợp Cloudinary**: Lưu trữ ảnh trên cloud
- **Tối ưu ảnh**: Tự động tối ưu kích thước và chất lượng

### 17. Module Chat

- **Chat real-time**: Chat trực tuyến giữa khách và nhân viên
- **Lưu trữ tin nhắn**: Lưu lịch sử chat
- **Thông báo**: Thông báo tin nhắn mới

### 18. Module AI

- **Tư vấn tự động**: AI chatbot tư vấn khách hàng
- **Gợi ý món**: Gợi ý món ăn dựa trên sở thích

### 19. Module Thông Báo Real-time (Pusher)

- **Đơn hàng mới**: Thông báo real-time khi có đơn mới
- **Cập nhật trạng thái**: Thông báo khi trạng thái đơn/bàn thay đổi
- **Đặt bàn mới**: Thông báo khi có đặt bàn mới

### 20. Module Email (Mail)

- **Email xác thực**: Gửi email xác thực tài khoản
- **Email đặt lại mật khẩu**: Gửi link reset password
- **Email xác nhận đặt bàn**: Gửi email xác nhận booking
- **Email thông báo**: Gửi các email thông báo khác

## Công Nghệ Sử Dụng

### Backend (API)

- **Framework**: NestJS
- **Database**: PostgreSQL với Prisma ORM
- **Authentication**: JWT, Passport, Google OAuth
- **Payment**: VNPay
- **Upload**: Cloudinary
- **Real-time**: Pusher
- **Email**: NodeMailer
- **Validation**: class-validator, class-transformer

### Frontend (Web)

- **Framework**: Next.js 16.2.6 (App Router)
- **UI Library**: React 19, Shadcn UI, Radix UI
- **Styling**: Tailwind CSS 4
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form với Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Kiến Trúc Hệ Thống

### Phân Quyền (RBAC - Role-Based Access Control)

Hệ thống sử dụng mô hình phân quyền dựa trên vai trò với 3 lớp:

1. **User** - Người dùng
2. **Role** - Vai trò (Admin, Manager, Staff, Cashier, Kitchen, Waiter)
3. **Permission** - Quyền hạn chi tiết (create, read, update, delete)
4. **Action** - Hành động hệ thống

### Luồng Hoạt Động Chính

#### Luồng Đặt Bàn

1. Khách hàng chọn thời gian, số người
2. Hệ thống kiểm tra bàn trống
3. Khách chọn bàn và đặt món (tùy chọn)
4. Thanh toán đặt cọc qua VNPay (nếu yêu cầu)
5. Nhân viên xác nhận đặt bàn
6. Gửi email xác nhận cho khách

#### Luồng Đơn Hàng

1. Nhân viên tạo đơn cho bàn
2. Thêm món vào đơn
3. Bếp nhận phiếu và chế biến
4. Phục vụ món cho khách
5. Khách yêu cầu thanh toán
6. Thu ngân xử lý thanh toán
7. Hoàn thành và đóng đơn

#### Luồng Chấm Công

1. Nhân viên clock in khi bắt đầu ca
2. Hệ thống ghi nhận thời gian
3. Nhân viên clock out khi kết thúc ca
4. Tính toán giờ làm việc
5. Tạo báo cáo chấm công

## Tính Năng Nổi Bật

1. **Quản lý toàn diện**: Từ đặt bàn, order, bếp, thu ngân đến nhân sự
2. **Phân quyền linh hoạt**: RBAC với nhiều cấp độ quyền hạn
3. **Thanh toán đa dạng**: Tiền mặt và VNPay
4. **Real-time**: Cập nhật trạng thái đơn hàng, bàn ăn tức thời
5. **AI hỗ trợ**: Chatbot tư vấn khách hàng
6. **Responsive**: Giao diện thân thiện trên mọi thiết bị
7. **Bảo mật**: JWT authentication, phân quyền chi tiết
8. **Tối ưu hiệu suất**: React Query caching, image optimization
