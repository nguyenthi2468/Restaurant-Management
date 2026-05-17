export const restaurantInfo = {
  name: 'Savore',
  cuisine: 'Ẩm thực Á Đông fusion cao cấp',
  description:
    'Một điểm đến ẩm thực tinh tế nơi kỹ thuật Á Đông truyền thống gặp gỡ đổi mới hiện đại. Trải nghiệm những món ăn được chế biến tỉ mỉ từ nguyên liệu cao cấp và trình bày với sự tinh xảo nghệ thuật.',
  tagline: 'Nơi truyền thống gặp gỡ sáng tạo',
  founded: 2018,
  phone: '+1 (555) 123-4567',
  email: 'hello@savore.com',
  address: '456 Culinary Lane, San Francisco, CA 94102',
  website: 'www.savore.com',
  hours: [
    { day: 'Thứ Hai', open: 'Đóng', close: '' },
    { day: 'Thứ Ba - Thứ Năm', open: '5:00 PM', close: '10:00 PM' },
    { day: 'Thứ Sáu - Thứ Bảy', open: '5:00 PM', close: '11:00 PM' },
    { day: 'Chủ Nhật', open: '5:00 PM', close: '9:00 PM' },
  ],
  social: [
    { platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
    { platform: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
    { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  ],
};

export const menuItems = [
  // Khai vị
  {
    id: 'app-1',
    name: 'Combo Hoành Thánh Giòn',
    description: 'Hoành thánh chiên giòn vàng ruộm với nước chấm ngọt cay',
    price: 120000,
    category: 'appetizers',
    image: '/images/wonton.jpg',
    vegetarian: false,
  },
  {
    id: 'app-2',
    name: 'Đậu Edamame muối biển',
    description: 'Đậu tương hấp thấm vị muối nhẹ',
    price: 80000,
    category: 'appetizers',
    image: '/images/edamame.jpg',
    vegetarian: true,
    vegan: true,
  },
  {
    id: 'app-3',
    name: 'Tôm Tempura',
    description: 'Tôm bọc bột giòn, ăn kèm sốt tempura',
    price: 140000,
    category: 'appetizers',
    image: '/images/shrimp-tempura.jpg',
    vegetarian: false,
  },
  {
    id: 'app-4',
    name: 'Gyoza (6 miếng)',
    description: 'Há cảo áp chảo nhân thịt heo và rau',
    price: 100000,
    category: 'appetizers',
    image: '/images/gyoza.jpg',
    vegetarian: false,
  },

  // Món chính
  {
    id: 'main-1',
    name: 'Cá tuyết sốt miso',
    description:
      'Phi lê cá tuyết áp chảo sốt bơ miso, kèm cơm jasmine và rau theo mùa',
    price: 420000,
    category: 'mains',
    image: '/images/miso-cod.jpg',
    vegetarian: false,
  },
  {
    id: 'main-2',
    name: 'Bò Wagyu gia vị Á Đông',
    description: 'Wagyu Nhật cao cấp tẩm năm vị, kèm khoai tây nghiền truffle',
    price: 580000,
    category: 'mains',
    image: '/images/wagyu.jpg',
    vegetarian: false,
  },
  {
    id: 'main-3',
    name: 'Pad Thai Hoàng Gia',
    description: 'Mì xào gạo với tôm, gà và rau theo mùa',
    price: 280000,
    category: 'mains',
    image: '/images/pad-thai.jpg',
    vegetarian: false,
  },
  {
    id: 'main-4',
    name: 'Cà ri chay đậu phụ',
    description: 'Cà ri xanh Thái thơm với đậu phụ mềm, ớt chuông và húng quế',
    price: 240000,
    category: 'mains',
    image: '/images/curry.jpg',
    vegetarian: true,
    vegan: true,
  },
  {
    id: 'main-5',
    name: 'Vịt Bắc Kinh',
    description: 'Vịt quay truyền thống da giòn, kèm bánh mỏng và sốt hoisin',
    price: 520000,
    category: 'mains',
    image: '/images/peking-duck.jpg',
    vegetarian: false,
  },

  // Tráng miệng
  {
    id: 'des-1',
    name: 'Bánh phô mai matcha',
    description: 'Bánh phô mai béo mịn hòa quyện matcha Nhật cao cấp',
    price: 120000,
    category: 'desserts',
    image: '/images/matcha-cake.jpg',
    vegetarian: true,
  },
  {
    id: 'des-2',
    name: 'Xôi xoài',
    description: 'Xôi nếp ngọt với xoài tươi và nước cốt dừa',
    price: 100000,
    category: 'desserts',
    image: '/images/mango-sticky.jpg',
    vegetarian: true,
    vegan: true,
  },
  {
    id: 'des-3',
    name: 'Panna cotta yuzu',
    description: 'Panna cotta mịn màng với sốt chanh yuzu và hoa ăn được',
    price: 110000,
    category: 'desserts',
    image: '/images/panna-cotta.jpg',
    vegetarian: true,
  },

  // Đồ uống
  {
    id: 'bev-1',
    name: 'Thực đơn Sake',
    description: 'Sake Nhật cao cấp theo ly hoặc chai',
    price: 120000,
    category: 'beverages',
    image: '/images/sake.jpg',
    vegetarian: true,
    vegan: true,
  },
  {
    id: 'bev-2',
    name: 'Nước chanh yuzu',
    description: 'Nước chanh yuzu nhà làm tươi mát',
    price: 70000,
    category: 'beverages',
    image: '/images/yuzu-lemonade.jpg',
    vegetarian: true,
    vegan: true,
  },
  {
    id: 'bev-3',
    name: 'Trà nhài',
    description: 'Trà xanh nhài truyền thống',
    price: 50000,
    category: 'beverages',
    image: '/images/jasmine-tea.jpg',
    vegetarian: true,
    vegan: true,
  },
];

export const setMenus = [
  {
    id: 'set-1',
    name: 'Thực đơn thử vị của đầu bếp',
    courses: 8,
    price: 950000,
    description:
      'Hành trình tinh tế qua những sáng tạo hàng đầu của đầu bếp, với nguyên liệu theo mùa và cách trình bày nghệ thuật.',
    items: [
      'Khai vị',
      'Súp',
      'Hải sản vỏ',
      'Cá',
      'Làm sạch vị giác',
      'Thịt',
      'Tráng miệng',
      'Petit Fours',
    ],
    duration: '2.5 giờ',
    popular: true,
  },
  {
    id: 'set-2',
    name: 'Trải nghiệm Omakase',
    courses: 6,
    price: 1200000,
    description:
      'Hãy tin tưởng đầu bếp sushi của chúng tôi lựa chọn riêng cho bạn sashimi và nigiri tinh túy nhất.',
    items: [
      'Khóa học Sashimi',
      'Lựa chọn Nigiri',
      'Cuộn đặc biệt',
      'Món nấu chín',
      'Món trứng',
      'Tráng miệng',
    ],
    duration: '1.5 giờ',
    popular: false,
  },
  {
    id: 'set-3',
    name: 'Thực đơn ăn tối nhẹ nhàng',
    courses: 3,
    price: 450000,
    description:
      'Lựa chọn giản dị hoàn hảo cho buổi tối thư giãn: khai vị, món chính và tráng miệng.',
    items: ['Khai vị', 'Món chính', 'Tráng miệng'],
    duration: '1 giờ',
    popular: false,
  },
];

export const testimonials = [
  {
    id: 'test-1',
    quote:
      'Savoré là một kiệt tác ẩm thực. Mỗi món ăn đều như một tác phẩm nghệ thuật và sự tỉ mỉ đến từng chi tiết thật tuyệt vời.',
    author: 'Sarah Mitchell',
    role: 'Nhà phê bình ẩm thực',
    rating: 5,
    image: '/images/person-1.jpg',
  },
  {
    id: 'test-2',
    quote:
      'Trải nghiệm omakase thật tuyệt vời. Đầu bếp sushi rất hiểu biết và hải sản tươi ngon nhất mà chúng tôi từng thử.',
    author: 'James Chen',
    role: 'Đầu bếp & Chủ nhà hàng',
    rating: 5,
    image: '/images/person-2.jpg',
  },
  {
    id: 'test-3',
    quote:
      'Một trải nghiệm ẩm thực thật đáng nhớ. Sự hòa quyện giữa kỹ thuật truyền thống và hiện đại thật xuất sắc.',
    author: 'Emma Rodriguez',
    role: 'Blogger du lịch',
    rating: 5,
    image: '/images/person-3.jpg',
  },
  {
    id: 'test-4',
    quote:
      'Không gian, dịch vụ và món ăn đều vượt xa mong đợi. Chúng tôi nhất định sẽ quay lại.',
    author: 'Michael Thompson',
    role: 'Khách hàng',
    rating: 5,
    image: '/images/person-4.jpg',
  },
];

export const services = [
  {
    id: 'svc-1',
    name: 'Ăn tại chỗ',
    description:
      'Trải nghiệm phòng ăn thanh lịch với dịch vụ tận tâm và không gian tinh tế',
    icon: 'UtensilsCrossed',
    price: 0,
  },
  {
    id: 'svc-2',
    name: 'Sự kiện riêng',
    description:
      'Tổ chức dịp đặc biệt tại phòng ăn riêng với thực đơn thiết kế riêng',
    icon: 'Users',
    price: 500,
  },
  {
    id: 'svc-3',
    name: 'Tiệc theo yêu cầu',
    description:
      'Mang tinh hoa ẩm thực Savoré đến sự kiện của bạn với dịch vụ tiệc chuyên nghiệp',
    icon: 'Utensils',
    price: 200,
  },
  {
    id: 'svc-4',
    name: 'Kết hợp rượu vang',
    description:
      'Sommelier của chúng tôi chọn lựa rượu vang hoàn hảo để tôn vinh từng món',
    icon: 'Wine',
    price: 45,
  },
];

export const galleryImages = [
  {
    id: 'gal-1',
    title: 'Không gian ẩm thực sang trọng',
    image: '/images/dining-room.jpg',
    category: 'ambiance',
  },
  {
    id: 'gal-2',
    title: 'Món ăn trình bày nghệ thuật',
    image: '/images/plated-dish.jpg',
    category: 'cuisine',
  },
  {
    id: 'gal-3',
    title: 'Bếp của đầu bếp',
    image: '/images/kitchen.jpg',
    category: 'kitchen',
  },
  {
    id: 'gal-4',
    title: 'Quầy bar & lựa chọn rượu vang',
    image: '/images/bar.jpg',
    category: 'ambiance',
  },
  {
    id: 'gal-5',
    title: 'Món đặc trưng',
    image: '/images/signature-dish.jpg',
    category: 'cuisine',
  },
  {
    id: 'gal-6',
    title: 'Phòng ăn riêng',
    image: '/images/private-room.jpg',
    category: 'ambiance',
  },
];

export const menuCategories = [
  {
    id: 'cat-1',
    name: 'Khai vị',
    description: 'Các món nhỏ để mở đầu hành trình',
    icon: '🥢',
    items: menuItems.filter((item) => item.category === 'appetizers'),
  },
  {
    id: 'cat-2',
    name: 'Món chính',
    description: 'Các món đặc trưng và chuyên biệt',
    icon: '🍽️',
    items: menuItems.filter((item) => item.category === 'mains'),
  },
  {
    id: 'cat-3',
    name: 'Tráng miệng',
    description: 'Hương vị ngọt ngào để kết thúc bữa ăn',
    icon: '🍰',
    items: menuItems.filter((item) => item.category === 'desserts'),
  },
  {
    id: 'cat-4',
    name: 'Đồ uống',
    description: 'Rượu vang, sake và đồ uống đặc sắc',
    icon: '🍶',
    items: menuItems.filter((item) => item.category === 'beverages'),
  },
];
