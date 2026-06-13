# Hoạt Đồ Hệ Thống Quản Lý Nhà Hàng

## 1. Luồng Xác Thực Người Dùng

```mermaid
flowchart TD
    A[Bắt đầu] --> B[Truy cập trang web]
    B --> C{Đã đăng nhập?}
    C -->|Có| D[Vào dashboard]
    C -->|Không| E[Hiển thị form đăng nhập/đăng ký]
    E --> F{Chọn đăng nhập/đăng ký}
    F -->|Đăng nhập| G[Nhập email/mật khẩu]
    F -->|Đăng ký| H[Nhập thông tin đăng ký]
    G --> I{Xác thực thành công?}
    H --> J{Email hợp lệ?}
    I -->|Có| K[Tạo JWT token]
    I -->|Không| L[Hiển thị lỗi]
    J -->|Có| M[Gửi email xác thực]
    J -->|Không| N[Hiển thị lỗi]
    M --> O[Xác thực email]
    O --> P{Kết quả xác thực?}
    P -->|Thành công| Q[Chuyển đến đăng nhập]
    P -->|Thất bại| R[Hiển thị lỗi]
    Q --> G
    K --> S[Làm mới token tự động]
    S --> D
    L --> E
    N --> E
    R --> E
```

## 2. Luồng Đặt Bàn

```mermaid
flowchart TD
    A[Bắt đầu đặt bàn] --> B[Chọn ngày giờ]
    B --> C[Nhập số lượng người]
    C --> D[Nhập thông tin liên hệ]
    D --> E[Chọn bàn khả dụng]
    E --> F{Có đặt món trước?}
    F -->|Có| G[Chọn món ăn trước]
    F -->|Không| H[Tiếp tục]
    G --> H
    H --> I{Thanh toán đặt cọc?}
    I -->|Có| J[Chọn phương thức thanh toán]
    I -->|Không| K[Xác nhận đặt bàn]
    J --> L{Thanh toán thành công?}
    L -->|Có| M[Ghi nhận đặt cọc]
    L -->|Không| N[Hiển thị lỗi thanh toán]
    M --> K
    N --> J
    K --> O[Gửi email xác nhận]
    O --> P[Hoàn thành đặt bàn]
```

## 3. Luồng Quản Lý Đơn Hàng

```mermaid
flowchart TD
    A[Bắt đầu tạo đơn] --> B[Chọn bàn]
    B --> C[Thêm món ăn vào đơn]
    C --> D{Thêm thêm món?}
    D -->|Có| C
    D -->|Không| E[Nhập ghi chú đơn hàng]
    E --> F[Tính tổng tiền]
    F --> G{Trạng thái đơn?}
    G -->|Mới tạo| H[PENDING]
    G -->|Đã phục vụ| I[SERVED]
    G -->|Hoàn thành| J[COMPLETED]
    G -->|Hủy| K[CANCELLED]
    H --> L[Chờ chế biến]
    I --> M[Chờ thanh toán]
    J --> N[Hoàn thành]
    K --> O[Đã hủy]
    L --> P[Bếp xem ticket]
    P --> Q{Cập nhật trạng thái món?}
    Q -->|Hoàn thành| R[Cập nhật bếp]
    Q -->|Chờ| P
    R --> S[Tất cả món hoàn thành?]
    S -->|Có| T[Chuyển sang SERVED]
    S -->|Không| P
    T --> U[Thông báo phục vụ]
    U --> V[Khách hàng kiểm tra]
    V --> W{Thanh toán?}
    W -->|Có| X[Chuyển sang COMPLETED]
    W -->|Không| V
    X --> Y[Thanh toán]
    Y --> Z[Hoàn thành đơn]
```

## 4. Luồng Quản Lý Bếp

```mermaid
flowchart TD
    A[Bắt đầu ca làm việc] --> B[Bếp đăng nhập hệ thống]
    B --> C[Xem danh sách票 bếp]
    C --> D{Có票 mới?}
    D -->|Có| E[Hiển thị ticket mới nhất]
    D -->|Không| C
    E --> F[Xem chi tiết món ăn]
    F --> G[Chế biến món ăn]
    G --> H{Hoàn thành món?}
    H -->|Có| I[Đánh dấu hoàn thành]
    H -->|Không| G
    I --> J{Cập nhật trạng thái ticket?}
    J -->|Có| K[Cập nhật票 trạng thái]
    J -->|Không| I
    K --> L{Tất cả món trong票 hoàn thành?}
    L -->|Có| M[Đánh dấu票 hoàn thành]
    L -->|Không| C
    M --> N[Thông báo phục vụ lênfloor]
    N --> C
```

## 5. Luồng Thanh Toán

```mermaid
flowchart TD
    A[Bắt đầu thanh toán] --> B[Chon thanh toán tiền mặt/VNPay]
    B -->|Tiền mặt| C[Nhận tiền từ khách]
    B -->|VNPay| D[Chuyển hướng sang VNPay]
    C --> E[Tính tiền thối lại]
    E --> F[In hóa đơn]
    F --> G[Hoàn thành thanh toán]
    D --> H{Thanh toán VNPay thành công?}
    H -->|Có| I[Xác nhận thanh toán]
    H -->|Không| J[Hiển thị lỗi thanh toán]
    I --> K[Gửi email xác nhận]
    K --> L[In hóa đơn]
    L --> G
    G --> M[Cập nhật trạng thái đơn hàng]
    M --> N[Hoàn thành quy trình]
```

## 6. Luồng Quản lý Nhân Viên

```mermaid
flowchart TD
    A[Quản lý nhân viên] --> B{Chọn chức năng}
    B -->|Tạo lịch| C[Tạo ca làm việc]
    B -->|Chấm công| D[Nhân viên chấm công]
    B -->|Yêu cầu nghỉ| E[Nhân viên gửi yêu cầu nghỉ]
    B -->|Xem báo cáo| F[Xem báo cáo chấm công]
    C --> G[Định dạng ca làm việc]
    G --> H[Phân ca cho nhân viên]
    H --> I[Lưu lịch làm việc]
    D --> J{Chọn công việc?}
    J -->|Clock in| K[Ghi nhận giờ vào]
    J -->|Clock out| L[Ghi nhận giờ ra]
    K --> M[Tính giờ làm việc]
    L --> M
    E --> N[Quản lý duyệt yêu cầu]
    N --> O{Phê duyệt?}
    O -->|Có| P[Cập nhật trạng thái nghỉ]
    O -->|Không| Q[Ghi chú lý do từ chối]
    P --> R[Cập nhật lịch làm việc]
    Q --> E
    F --> S[Tạo báo cáo theo期間]
    S --> T[Xuất báo cáo]
    T --> U[Hoàn thành]
```

## Luồng Toàn Diện: Khách hàng đến trả món

```mermaid
flowchart TD
    A[Khách hàng đến nhà hàng] --> B{Có đặt trước?}
    B -->|Có| C[Xác nhận đặt bàn]
    B -->|Không| D[Chọn bàn trống]
    C --> E[Đưa khách đến bàn]
    D --> E
    E --> F[Thực đơn]
    F --> G[Đặt món ăn]
    G --> H[Tạo đơn hàng]
    H --> I[Gửi ticket bếp]
    I --> J[Bếp chế biến]
    J --> K[Món ăn hoàn thành]
    K --> L[Phục vụ khách]
    L --> M{Khách hàng thanh toán?}
    M -->|Có| N[Thanh toán]
    M -->|Không| L
    N --> O[In hóa đơn]
    O --> P[Khách hàng đi]
    P --> Q[Kết thúc bữa ăn]
```

## Luồng Quản Lý Hệ Thống (Admin)

```mermaid
flowchart TD
    A[Admin đăng nhập] --> B{Truy cập module?}
    B -->|Người dùng| C[Quản lý người dùng]
    B -->|Vai trò| D[Quản lý vai trò]
    B -->|Quyền hạn| E[Quản lý quyền hạn]
    B -->|Hành động| F[Quản lý hành động]
    B -->|Thực đơn| G[Quản lý thực đơn]
    B -->|Đặt bàn| H[Quản lý đặt bàn]
    B -->|Đơn hàng| I[Quản lý đơn hàng]
    B -->|Tin tức| J[Quản lý tin tức]
    B -->|Liên hệ| K[Quản lý liên hệ]
    B -->|Thư viện ảnh| L[Quản lý thư viện ảnh]
    C --> M[CRUD người dùng]
    D --> N[CRUD vai trò]
    E --> O[CRUD quyền hạn]
    F --> P[CRUD hành động]
    G --> Q[CRUD danh mục/món ăn]
    H --> R[CRUD đặt bàn]
    I --> S[CRUD đơn hàng]
    J --> T[CRUD tin tức]
    K --> U[CRUD liên hệ]
    L --> V[CRUD ảnh]
    M --> W[Phân quyền người dùng]
    N --> X[Gán quyền cho vai trò]
    O --> Y[Kiểm tra truy cập]
    P --> Z[Bảo vệ API]
    Q --> AA[Cập nhật giá món]
    R --> AB[Kiểm tra bàn trống]
    S --> AC[Theo dõi trạng thái đơn]
    T --> AD[Hiển thị trên website]
    U --> AE[Phản hồi khách hàng]
    V --> AF[Tối ưu ảnh]
    W --> AG[Hoàn thành quản lý]
    X --> AG
    Y --> AG
    Z --> AG
    AA --> AG
    AB --> AG
    AC --> AG
    AD --> AG
    AE --> AG
    AF --> AG
```

## Luồng Tích Hợp Thiết Bị Dịch Vụ

```mermaid
flowchart TD
    A[Tích hợp VNPay] --> B[Tạo order code]
    B --> C[Tạo URL thanh toán]
    C --> D[Chuyển hướng khách hàng]
    D --> E{VNPay callback?}
    E -->|Thành công| F[Xác nhận thanh toán]
    E -->|Thất bại| G[Hiển thị lỗi]
    F --> H[Cập nhật trạng thái đơn]
    H --> I[Gửi email xác nhận]
    I --> J[Hoàn thành]
    G --> K[Thông báo lỗi]
    K --> L[Thử lại thanh toán]
    L --> D

    A2[Tích hợp Pusher] --> B3[Kết nối WebSocket]
    B3 --> C3[Đăng ký kênh]
    C3 --> D3{Lắng nghe sự kiện?}
    D3 -->|Đơn hàng mới| E3[Thông báo floor]
    D3 -->|Cập nhật bàn| F3[Cập nhật trạng thái bàn]
    D3 -->|Đặt bàn| G3[Thông báo đặt bàn mới]
    E3 --> H3[Cập nhật UI realtime]
    F3 --> H3
    G3 --> H3
    H3 --> I3[Hoàn thành]

    A4[Tích hợp Cloudinary] --> B4[Upload ảnh]
    B4 --> C4[Tối ưu ảnh]
    C4 --> D4[Lưu URL ảnh]
    D4 --> E4[Trả về kết upload]
    E4 --> F4[Hoàn thành]

    A5[Tích hợp Mail] --> B5[Tạo nội dung email]
    B5 --> C5[Gửi qua SMTP]
    C5 --> D5{Email gửi thành công?}
    D5 -->|Có| E5[Xác nhận gửi]
    D5 -->|Không| F5[Ghi log lỗi]
    E5 --> G5[Hoàn thành]
    F5 --> G5
```

## Luồng AI Hỗ Trợ

```mermaid
flowchart TD
    A[Khách hàng bắt đầu chat] --> B[Gửi tin nhắn]
    B --> C{AI được kích hoạt?}
    C -->|Có| D[Phân tích ý định]
    C -->|Không| E[Chuyển sang nhân viên]
    D --> F{Loại ý định?}
    F -->|Tư vấn món| G[Gợi ý món ăn dựa trên sở thích]
    F -->|Thông tin nhà hàng| H[Cung cấp thông tin vị trí/giờ mở]
    F -->|Đặt bàn| I[Hướng dẫn đặt bàn]
    F -->|Khác| J[Chuyển sang nhân viên]
    G --> K[Hiển thị gợi ý]
    H --> L[Hiển thị thông tin]
    I --> M[Hướng dẫn quy trình đặt bàn]
    J --> N[Chuyển cuộc trò chuyện sang nhân viên]
    K --> O[Khách hàng phản hồi]
    L --> O
    M --> O
    O --> P{Đóng cuộc trò chuyện?}
    P -->|Có| Q[Kết thúc chat]
    P -->|Không| B
    N --> R[Nhân viên tiếp nhận]
    R --> S[Xử lý yêu cầu]
    S --> T{Phân loại lại?}
    T -->|Có| U[Chuyển lại AI]
    T -->|Không| V[Giải quyết yêu cầu]
    V --> W[Khách hàng hài lòng?]
    W -->|Có| Q
    W -->|Không| S
```

> **Lưu ý**: Đây là sơ đồ hoạt động dựa trên các chức năng đã triển khai trong hệ thống quản lý nhà hàng. Mỗi luồng thể hiện các bước xử lý chính từ góc độ người dùng và quản trị viên.
