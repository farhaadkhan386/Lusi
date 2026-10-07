import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  ProductColor,
  ShippingAddress,
  OrderConfirmation,
  FilterState,
  RewardTransaction,
  CategoryData,
} from '../types';
import { PRODUCTS } from '../data/products';
import { INITIAL_ADMIN_CATEGORIES, INITIAL_ADMIN_ORDERS } from '../data/adminMockData';
import {
  seedFirestoreIfEmpty,
  subscribeToProducts,
  subscribeToCategories,
  addOrderToFirestore,
  updateOrderStatusInFirestore,
} from '../services/firestoreData';

interface ShopContextType {
  products: Product[];
  categories: CategoryData[];
  cart: CartItem[];
  wishlist: string[]; // product IDs
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  accountInitialTab: 'track' | 'history' | 'orders' | 'profile' | 'rewards';
  trackingOrderId: string | null;
  setTrackingOrderId: (orderId: string | null) => void;
  openAccountModal: (tab?: 'track' | 'history' | 'orders' | 'profile' | 'rewards', orderId?: string) => void;
  rewardPoints: number;
  rewardHistory: RewardTransaction[];
  redeemRewardVoucher: (pointsCost: number, rupeeDiscount: number, code: string, title: string) => { success: boolean; message: string };
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  activeView: 'home' | 'catalog' | 'pdp' | 'about' | 'admin';
  setActiveView: (view: 'home' | 'catalog' | 'pdp' | 'about' | 'admin') => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  addToCart: (product: Product, color: ProductColor, size: string, quantity?: number) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  cartTotal: number;
  discountAmount: number;
  couponCode: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  recentOrders: OrderConfirmation[];
  placeOrder: (address: ShippingAddress) => OrderConfirmation;
  cancelOrder: (orderId: string, reason?: string) => Promise<{ success: boolean; message: string }>;
  navigateToCategory: (category: 'Men' | 'Women' | 'Kids' | 'All', subcategory?: string) => void;
  openProductPage: (product: Product) => void;
  openAdminPanel: () => void;
}

const defaultFilters: FilterState = {
  category: 'All',
  subcategory: '',
  size: '',
  color: '',
  minPrice: 500,
  maxPrice: 6000,
  inStockOnly: false,
  sortBy: 'recommended',
  searchQuery: '',
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Dynamically synchronize products with Firestore collection in real-time
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedAdmin = localStorage.getItem('lusi_admin_products');
      if (savedAdmin) {
        const parsed = JSON.parse(savedAdmin);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return PRODUCTS;
  });

  // Dynamically synchronize categories with Firestore collection in real-time
  const [categories, setCategories] = useState<CategoryData[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_admin_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_ADMIN_CATEGORIES;
  });

  // Seed Firestore if empty, then attach real-time Firestore listeners
  useEffect(() => {
    seedFirestoreIfEmpty();

    const unsubscribeProducts = subscribeToProducts((firestoreProducts) => {
      if (firestoreProducts && firestoreProducts.length > 0) {
        setProducts(firestoreProducts);
      }
    });

    const unsubscribeCategories = subscribeToCategories((firestoreCategories) => {
      if (firestoreCategories && firestoreCategories.length > 0) {
        setCategories(firestoreCategories);
      }
    });

    // Also support cross-tab local fallback
    const handleStorageChange = () => {
      try {
        const savedAdmin = localStorage.getItem('lusi_admin_products');
        if (savedAdmin) {
          const parsed = JSON.parse(savedAdmin);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        }
        const savedCats = localStorage.getItem('lusi_admin_categories');
        if (savedCats) {
          const parsedCats = JSON.parse(savedCats);
          if (Array.isArray(parsedCats) && parsedCats.length > 0) {
            setCategories(parsedCats);
          }
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentOrders, setRecentOrders] = useState<OrderConfirmation[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountInitialTab, setAccountInitialTab] = useState<'track' | 'history' | 'orders' | 'profile' | 'rewards'>('track');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'catalog' | 'pdp' | 'about' | 'admin'>('home');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [couponFixedDiscount, setCouponFixedDiscount] = useState<number>(0);

  // Rewards State
  const [rewardPoints, setRewardPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('lusi_reward_points');
      return saved ? parseInt(saved, 10) : 750;
    } catch {
      return 750;
    }
  });

  const [rewardHistory, setRewardHistory] = useState<RewardTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_reward_history');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'tx-1',
          type: 'earned',
          title: 'Welcome Privilege Gift',
          points: 250,
          date: '10 days ago',
        },
        {
          id: 'tx-2',
          type: 'earned',
          title: 'Lusi Family Profile Activation',
          points: 100,
          date: '7 days ago',
        },
        {
          id: 'tx-3',
          type: 'earned',
          title: 'Spring Drop Purchase (#LUSI-IN-84129)',
          points: 400,
          date: '3 days ago',
        },
      ];
    } catch {
      return [];
    }
  });

  // Sync rewards to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('lusi_reward_points', rewardPoints.toString());
    } catch {
      // ignore
    }
  }, [rewardPoints]);

  useEffect(() => {
    try {
      localStorage.setItem('lusi_reward_history', JSON.stringify(rewardHistory));
    } catch {
      // ignore
    }
  }, [rewardHistory]);

  const openAccountModal = (
    tab: 'track' | 'history' | 'orders' | 'profile' | 'rewards' = 'track',
    orderId?: string
  ) => {
    setAccountInitialTab(tab);
    if (orderId) {
      setTrackingOrderId(orderId);
    }
    setIsAccountOpen(true);
  };

  // Sync cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('lusi_cart', JSON.stringify(cart));
    } catch {
      // storage unavailable
    }
  }, [cart]);

  // Sync wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('lusi_wishlist', JSON.stringify(wishlist));
    } catch {
      // storage unavailable
    }
  }, [wishlist]);

  // Sync orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('lusi_orders', JSON.stringify(recentOrders));
    } catch {
      // storage unavailable
    }
  }, [recentOrders]);

  const addToCart = (product: Product, color: ProductColor, size: string, quantity = 1) => {
    const itemId = `${product.id}-${color.name}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: itemId, product, selectedColor: color, selectedSize: size, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Free shipping over ₹1,999 in India, otherwise ₹99
  const shippingFee = cartSubtotal > 0 && cartSubtotal >= 1999 ? 0 : cartSubtotal > 0 ? 99 : 0;
  const discountAmount = Math.min(
    cartSubtotal,
    Math.round(cartSubtotal * (couponDiscountPercent / 100)) + couponFixedDiscount
  );
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'LUSIFIRST' || clean === 'WELCOME10') {
      setCouponCode(clean);
      setCouponDiscountPercent(10);
      setCouponFixedDiscount(0);
      return { success: true, message: 'Coupon applied! 10% privilege discount added to your bag.' };
    }
    if (clean === 'FESTIVE15') {
      setCouponCode(clean);
      setCouponDiscountPercent(15);
      setCouponFixedDiscount(0);
      return { success: true, message: 'Festive offer applied! 15% discount granted.' };
    }
    if (clean === 'LUSIREWARD150' || clean === 'REWARD150') {
      setCouponCode('LUSIREWARD150');
      setCouponDiscountPercent(0);
      setCouponFixedDiscount(150);
      return { success: true, message: 'Lusi Rewards Voucher applied! ₹150 privilege discount deducted.' };
    }
    if (clean === 'LUSIREWARD300' || clean === 'REWARD300') {
      setCouponCode('LUSIREWARD300');
      setCouponDiscountPercent(0);
      setCouponFixedDiscount(300);
      return { success: true, message: 'Lusi Rewards Voucher applied! ₹300 privilege discount deducted.' };
    }
    if (clean === 'LUSIREWARD500' || clean === 'REWARD500') {
      setCouponCode('LUSIREWARD500');
      setCouponDiscountPercent(0);
      setCouponFixedDiscount(500);
      return { success: true, message: 'Lusi Rewards Voucher applied! ₹500 privilege discount deducted.' };
    }
    return { success: false, message: 'Invalid promo code. Try "LUSIFIRST" or redeem a Lusi Rewards voucher.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscountPercent(0);
    setCouponFixedDiscount(0);
  };

  const redeemRewardVoucher = (
    pointsCost: number,
    rupeeDiscount: number,
    code: string,
    title: string
  ) => {
    if (rewardPoints < pointsCost) {
      return {
        success: false,
        message: `Insufficient points. You need ${pointsCost - rewardPoints} more points to unlock this voucher.`,
      };
    }

    setRewardPoints((prev) => Math.max(0, prev - pointsCost));
    const newTx: RewardTransaction = {
      id: `tx-${Date.now()}`,
      type: 'redeemed',
      title: `Redeemed ${title} Voucher (${code})`,
      points: pointsCost,
      date: 'Just now',
    };
    setRewardHistory((prev) => [newTx, ...prev]);

    // Automatically apply voucher to shopping bag
    setCouponCode(code);
    setCouponDiscountPercent(0);
    setCouponFixedDiscount(rupeeDiscount);

    return {
      success: true,
      message: `Congratulations! ${title} voucher redeemed and applied (₹${rupeeDiscount} off)!`,
    };
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const navigateToCategory = (category: 'Men' | 'Women' | 'Kids' | 'All', subcategory?: string) => {
    setFilters((prev) => ({
      ...defaultFilters,
      category,
      subcategory: subcategory || '',
    }));
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductPage = (product: Product) => {
    setSelectedProductForModal(product);
    setActiveView('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const placeOrder = (address: ShippingAddress): OrderConfirmation => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `LUSI-IN-${randomSuffix}`;

    const today = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(today.getDate() + 4);

    // Calculate loyalty points earned (1 point per ₹10 spent, minimum 50)
    const pointsEarned = Math.max(50, Math.floor(cartTotal / 10));

    const confirmation: OrderConfirmation = {
      orderId,
      items: [...cart],
      address,
      subtotal: cartSubtotal,
      shipping: shippingFee,
      discount: discountAmount,
      total: cartTotal,
      date: today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      rewardsEarned: pointsEarned,
    };

    // Credit rewards points
    setRewardPoints((prev) => prev + pointsEarned);
    const earnTx: RewardTransaction = {
      id: `tx-order-${orderId}`,
      type: 'earned',
      title: `Points for Order #${orderId}`,
      points: pointsEarned,
      date: 'Just now',
    };
    setRewardHistory((prev) => [earnTx, ...prev]);

    setRecentOrders((prev) => [confirmation, ...prev]);

    // Automatically sync with Firestore and Admin Orders
    try {
      const adminOrderRecord: OrderConfirmation = {
        ...confirmation,
        orderStatus: 'New',
        paymentStatus: address.paymentMethod === 'cod' ? 'Pending' : 'Paid',
        timeline: [
          {
            status: 'New',
            timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            note: `Order submitted by customer via ${address.paymentMethod.toUpperCase()}`,
          },
        ],
      };

      // Push to live Firestore database
      addOrderToFirestore(adminOrderRecord).catch((err) => {
        console.warn('Firestore order save notice:', err);
      });

      const existingAdmin = localStorage.getItem('lusi_admin_orders');
      const parsedOrders = existingAdmin ? JSON.parse(existingAdmin) : [];
      localStorage.setItem('lusi_admin_orders', JSON.stringify([adminOrderRecord, ...parsedOrders]));
    } catch {
      // ignore
    }

    clearCart();
    return confirmation;
  };

  const cancelOrder = async (
    orderId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    let currentOrder = recentOrders.find((o) => o.orderId === orderId);

    if (!currentOrder) {
      try {
        const saved = localStorage.getItem('lusi_orders');
        const parsed: OrderConfirmation[] = saved ? JSON.parse(saved) : [];
        currentOrder = parsed.find((o) => o.orderId === orderId);
      } catch {
        // ignore
      }
    }

    if (!currentOrder) {
      try {
        const savedAdmin = localStorage.getItem('lusi_admin_orders');
        const parsedAdmin: OrderConfirmation[] = savedAdmin ? JSON.parse(savedAdmin) : [];
        currentOrder = parsedAdmin.find((o) => o.orderId === orderId);
      } catch {
        // ignore
      }
    }

    if (!currentOrder) {
      currentOrder = INITIAL_ADMIN_ORDERS.find((o) => o.orderId === orderId);
    }

    const currentStatus = currentOrder?.orderStatus || 'New';
    const nonCancellable = ['Shipped', 'Out for Delivery', 'Delivered'];

    if (nonCancellable.includes(currentStatus)) {
      return {
        success: false,
        message: `Order #${orderId} is already ${currentStatus.toLowerCase()} and cannot be cancelled online. Please contact Atelier Concierge at +91-7248596540.`,
      };
    }

    if (currentStatus === 'Cancelled') {
      return {
        success: false,
        message: `Order #${orderId} is already cancelled.`,
      };
    }

    const cancellationTimestamp = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const newTimelineEntry = {
      status: 'Cancelled' as const,
      timestamp: cancellationTimestamp,
      note: reason ? `Customer cancellation: ${reason}` : 'Cancelled by customer before dispatch',
    };

    // Update state
    setRecentOrders((prev) => {
      const exists = prev.some((o) => o.orderId === orderId);
      if (exists) {
        return prev.map((ord) => {
          if (ord.orderId === orderId) {
            const updatedTimeline = ord.timeline
              ? [...ord.timeline, newTimelineEntry]
              : [newTimelineEntry];
            return {
              ...ord,
              orderStatus: 'Cancelled',
              paymentStatus: ord.paymentStatus === 'Paid' ? 'Refunded' : ord.paymentStatus,
              timeline: updatedTimeline,
            };
          }
          return ord;
        });
      } else if (currentOrder) {
        const updatedTimeline = currentOrder.timeline
          ? [...currentOrder.timeline, newTimelineEntry]
          : [newTimelineEntry];
        return [
          {
            ...currentOrder,
            orderStatus: 'Cancelled',
            paymentStatus: currentOrder.paymentStatus === 'Paid' ? 'Refunded' : currentOrder.paymentStatus,
            timeline: updatedTimeline,
          },
          ...prev,
        ];
      }
      return prev;
    });

    // Sync admin orders in localStorage
    try {
      const savedAdmin = localStorage.getItem('lusi_admin_orders');
      if (savedAdmin) {
        const parsedAdmin: OrderConfirmation[] = JSON.parse(savedAdmin);
        const updatedAdmin = parsedAdmin.map((ord) => {
          if (ord.orderId === orderId) {
            const updatedTimeline = ord.timeline
              ? [...ord.timeline, newTimelineEntry]
              : [newTimelineEntry];
            return {
              ...ord,
              orderStatus: 'Cancelled' as const,
              paymentStatus: ord.paymentStatus === 'Paid' ? ('Refunded' as const) : ord.paymentStatus,
              timeline: updatedTimeline,
            };
          }
          return ord;
        });
        localStorage.setItem('lusi_admin_orders', JSON.stringify(updatedAdmin));
      }
    } catch {
      // ignore
    }

    // Update Firestore if present
    try {
      await updateOrderStatusInFirestore(orderId, {
        orderStatus: 'Cancelled',
        paymentStatus: currentOrder?.paymentStatus === 'Paid' ? 'Refunded' : currentOrder?.paymentStatus,
      });
    } catch (err) {
      console.warn('Firestore cancel sync notice:', err);
    }

    return {
      success: true,
      message: `Order #${orderId} has been successfully cancelled. ${
        currentOrder?.address.paymentMethod !== 'cod'
          ? 'Any settled amount will be refunded within 24–48 hours.'
          : ''
      }`,
    };
  };

  const openAdminPanel = () => {
    setActiveView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountOpen,
        setIsAccountOpen,
        accountInitialTab,
        trackingOrderId,
        setTrackingOrderId,
        openAccountModal,
        rewardPoints,
        rewardHistory,
        redeemRewardVoucher,
        selectedProductForModal,
        setSelectedProductForModal,
        activeView,
        setActiveView,
        filters,
        setFilters,
        resetFilters,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
        discountAmount,
        couponCode,
        applyCoupon,
        removeCoupon,
        recentOrders,
        placeOrder,
        cancelOrder,
        navigateToCategory,
        openProductPage,
        openAdminPanel,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
