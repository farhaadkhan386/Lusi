export type Category = 'Men' | 'Women' | 'Kids';

export interface CategoryData {
  id: string;
  category: Category;
  title: string;
  subheading: string;
  description: string;
  buttonText: string;
  image: string;
  bannerImage: string;
  subcategories: string[];
  displayOrder: number;
  isActive: boolean;
}

export type Subcategory =
  | 'T-Shirts'
  | 'Shirts'
  | 'Jeans'
  | 'Trousers'
  | 'Cargo Pants'
  | 'Hoodies'
  | 'Jackets'
  | 'Co-ord Sets'
  | 'Tops'
  | 'Dresses'
  | 'Shorts'
  | 'Boys'
  | 'Girls';

export type KidsAgeGroup =
  | '0–2 Years'
  | '2–5 Years'
  | '6–9 Years'
  | '10–13 Years'
  | '14+ Years';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  city?: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  subcategory: Subcategory;
  genderTag: 'Men' | 'Women' | 'Kids' | 'Unisex';
  price: number;
  originalPrice: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  colors: ProductColor[];
  sizes: string[];
  ageGroup?: KidsAgeGroup;
  images: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  description: string;
  fabric: string;
  fit: string;
  care: string;
  inStock: boolean;
  tags?: string[];
  reviews?: Review[];
}

export interface CartItem {
  id: string; // composite: productId-color-size
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export type SortOption =
  | 'recommended'
  | 'newest'
  | 'price-low'
  | 'price-high'
  | 'best-selling';

export interface FilterState {
  category?: Category | 'All';
  subcategory?: string;
  size?: string;
  color?: string;
  minPrice: number;
  maxPrice: number;
  ageGroup?: KidsAgeGroup;
  inStockOnly?: boolean;
  rating?: number;
  sortBy: SortOption;
  searchQuery?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'upi' | 'card' | 'cod';
  upiId?: string;
}

export type OrderStatus =
  | 'New'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderConfirmation {
  orderId: string;
  items: CartItem[];
  address: ShippingAddress;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  date: string;
  estimatedDelivery: string;
  rewardsEarned?: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  timeline?: { status: OrderStatus; timestamp: string; note?: string }[];
  trackingNumber?: string;
  courier?: string;
  currentLocation?: string;
}

export interface RewardVoucher {
  id: string;
  code: string;
  rupeeDiscount: number;
  pointsCost: number;
  title: string;
  minSpend: number;
}

export interface RewardTransaction {
  id: string;
  type: 'earned' | 'redeemed';
  title: string;
  points: number;
  date: string;
}

// ================= ADMIN TYPES =================

export type ProductStatus = 'Active' | 'Draft' | 'Out of Stock' | 'Archived';

export interface AdminProduct extends Product {
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  status: ProductStatus;
  isFeatured?: boolean;
  publishedAt?: string;
}

export interface AdminInventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: Category;
  size: string;
  color: string;
  currentStock: number;
  lowStockThreshold: number;
  image: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'Active' | 'VIP' | 'Inactive';
  rewardPoints: number;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  applicableCategory?: 'All' | 'Men' | 'Women' | 'Kids';
  applicableGender?: 'All' | 'Men' | 'Women' | 'Kids';
  isActive: boolean;
}

export interface AdminBanner {
  id: string;
  title: string;
  heading: string;
  description: string;
  type: 'Homepage Hero' | 'Promotion Banner' | 'Category Banner' | 'Desktop Banner' | 'Mobile Banner';
  image: string;
  buttonText: string;
  buttonLink: string;
  displayOrder: number;
  isActive: boolean;
}

export interface AdminCollection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productIds: string[];
  isActive: boolean;
}

export interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Hidden';
  verified: boolean;
}

export interface AdminSubscriber {
  id: string;
  email: string;
  dateJoined: string;
  status: 'Subscribed' | 'Unsubscribed';
}

export interface AdminNotification {
  id: string;
  type: 'order' | 'low_stock' | 'out_of_stock' | 'customer' | 'review' | 'payment';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface StoreSettings {
  brandName: string;
  logoText: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  storeAddress: string;
  country: string;
  currency: string;
  currencySymbol: string;
  shippingCharge: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  upiEnabled: boolean;
  cardEnabled: boolean;
  returnPolicyDays: number;
  noticeBarText: string;
  secondaryNoticeText: string;
}
