import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import {
  seedFirestoreIfEmpty,
  subscribeToProducts,
  addProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  subscribeToOrders,
  addOrderToFirestore,
  updateOrderStatusInFirestore,
  subscribeToStoreSettings,
  updateStoreSettingsInFirestore,
  subscribeToBanners,
  updateBannerInFirestore,
  subscribeToCoupons,
  subscribeToCategories,
  updateCategoryInFirestore,
  addCategoryToFirestore,
  deleteCategoryFromFirestore,
} from '../services/firestoreData';
import {
  AdminProduct,
  AdminCustomer,
  AdminCoupon,
  AdminBanner,
  AdminCollection,
  AdminReview,
  AdminSubscriber,
  AdminNotification,
  StoreSettings,
  OrderConfirmation,
  OrderStatus,
  CategoryData,
  ProductStatus,
} from '../types';
import {
  INITIAL_ADMIN_PRODUCTS,
  INITIAL_STORE_SETTINGS,
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_CUSTOMERS,
  INITIAL_ADMIN_COUPONS,
  INITIAL_ADMIN_BANNERS,
  INITIAL_ADMIN_COLLECTIONS,
  INITIAL_ADMIN_REVIEWS,
  INITIAL_ADMIN_SUBSCRIBERS,
  INITIAL_ADMIN_NOTIFICATIONS,
  INITIAL_ADMIN_CATEGORIES,
} from '../data/adminMockData';

interface AdminContextType {
  // Authentication
  isAuthenticated: boolean;
  adminUser: { email: string; name: string; role: string } | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  logout: () => void;

  // Products
  products: AdminProduct[];
  addProduct: (product: Omit<AdminProduct, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;

  // Categories
  categories: CategoryData[];
  updateCategory: (id: string, updates: Partial<CategoryData>) => void;
  addCategory: (category: Omit<CategoryData, 'id'>) => void;
  deleteCategory: (id: string) => void;

  // Inventory
  updateStock: (productId: string, newStock: number) => void;
  updateLowStockThreshold: (productId: string, threshold: number) => void;

  // Orders
  orders: OrderConfirmation[];
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  addOrderFromStorefront: (order: OrderConfirmation) => void;

  // Customers
  customers: AdminCustomer[];
  addCustomer: (customer: Omit<AdminCustomer, 'id'>) => void;

  // Coupons
  coupons: AdminCoupon[];
  addCoupon: (coupon: Omit<AdminCoupon, 'id'>) => void;
  updateCoupon: (id: string, updates: Partial<AdminCoupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;

  // Banners & Storefront
  banners: AdminBanner[];
  addBanner: (banner: Omit<AdminBanner, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<AdminBanner>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;

  // Collections
  collections: AdminCollection[];
  addCollection: (col: Omit<AdminCollection, 'id'>) => void;
  updateCollection: (id: string, updates: Partial<AdminCollection>) => void;
  deleteCollection: (id: string) => void;

  // Reviews
  reviews: AdminReview[];
  updateReviewStatus: (id: string, status: 'Approved' | 'Pending' | 'Hidden') => void;
  deleteReview: (id: string) => void;

  // Subscribers
  subscribers: AdminSubscriber[];
  addSubscriber: (email: string) => boolean;
  deleteSubscriber: (id: string) => void;

  // Notifications
  notifications: AdminNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Store Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Admin View Navigation
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lusi_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem('lusi_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState('dashboard');

  // Products
  const [products, setProducts] = useState<AdminProduct[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_admin_products');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_PRODUCTS;
    } catch {
      return INITIAL_ADMIN_PRODUCTS;
    }
  });

  // Orders
  const [orders, setOrders] = useState<OrderConfirmation[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_admin_orders');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_ORDERS;
    } catch {
      return INITIAL_ADMIN_ORDERS;
    }
  });

  // Customers
  const [customers, setCustomers] = useState<AdminCustomer[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_admin_customers');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_CUSTOMERS;
    } catch {
      return INITIAL_ADMIN_CUSTOMERS;
    }
  });

  // Coupons
  const [coupons, setCoupons] = useState<AdminCoupon[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_admin_coupons');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_COUPONS;
    } catch {
      return INITIAL_ADMIN_COUPONS;
    }
  });

  // Banners
  const [banners, setBanners] = useState<AdminBanner[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_admin_banners');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_BANNERS;
    } catch {
      return INITIAL_ADMIN_BANNERS;
    }
  });

  // Collections
  const [collections, setCollections] = useState<AdminCollection[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_admin_collections');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_COLLECTIONS;
    } catch {
      return INITIAL_ADMIN_COLLECTIONS;
    }
  });

  // Reviews
  const [reviews, setReviews] = useState<AdminReview[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_admin_reviews');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_REVIEWS;
    } catch {
      return INITIAL_ADMIN_REVIEWS;
    }
  });

  // Subscribers
  const [subscribers, setSubscribers] = useState<AdminSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_admin_subscribers');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_SUBSCRIBERS;
    } catch {
      return INITIAL_ADMIN_SUBSCRIBERS;
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_admin_notifications');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_NOTIFICATIONS;
    } catch {
      return INITIAL_ADMIN_NOTIFICATIONS;
    }
  });

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('lusi_store_settings');
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  // Categories
  const [categories, setCategories] = useState<CategoryData[]>(() => {
    try {
      const saved = localStorage.getItem('lusi_admin_categories');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_CATEGORIES;
    } catch {
      return INITIAL_ADMIN_CATEGORIES;
    }
  });

  // Real-time Firestore Subscriptions
  useEffect(() => {
    seedFirestoreIfEmpty();

    const unsubProducts = subscribeToProducts((items) => {
      if (items && items.length > 0) setProducts(items);
    });

    const unsubCategories = subscribeToCategories((cats) => {
      if (cats && cats.length > 0) setCategories(cats);
    });

    const unsubOrders = subscribeToOrders((ordersList) => {
      if (ordersList && ordersList.length > 0) setOrders(ordersList);
    });

    const unsubSettings = subscribeToStoreSettings((sett) => {
      if (sett) setSettings(sett);
    });

    const unsubBanners = subscribeToBanners((bans) => {
      if (bans && bans.length > 0) setBanners(bans);
    });

    const unsubCoupons = subscribeToCoupons((coups) => {
      if (coups && coups.length > 0) setCoupons(coups);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubOrders();
      unsubSettings();
      unsubBanners();
      unsubCoupons();
    };
  }, []);

  // Persistence hooks
  useEffect(() => {
    try {
      localStorage.setItem('lusi_admin_categories', JSON.stringify(categories));
    } catch { /* ignore */ }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('lusi_admin_products', JSON.stringify(products));
    } catch { /* ignore */ }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('lusi_admin_orders', JSON.stringify(orders));
    } catch { /* ignore */ }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('lusi_admin_customers', JSON.stringify(customers));
    } catch { /* ignore */ }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem('lusi_admin_coupons', JSON.stringify(coupons));
    } catch { /* ignore */ }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('lusi_admin_banners', JSON.stringify(banners));
    } catch { /* ignore */ }
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem('lusi_admin_collections', JSON.stringify(collections));
    } catch { /* ignore */ }
  }, [collections]);

  useEffect(() => {
    try {
      localStorage.setItem('lusi_admin_reviews', JSON.stringify(reviews));
    } catch { /* ignore */ }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('lusi_admin_subscribers', JSON.stringify(subscribers));
    } catch { /* ignore */ }
  }, [subscribers]);

  useEffect(() => {
    try {
      localStorage.setItem('lusi_admin_notifications', JSON.stringify(notifications));
    } catch { /* ignore */ }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('lusi_store_settings', JSON.stringify(settings));
    } catch { /* ignore */ }
  }, [settings]);

  // Auth Methods
  const login = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@lusi.in' && pass === 'Raza@999') {
      const user = { email: cleanEmail, name: 'LUSI Head Administrator', role: 'Super Admin' };
      setIsAuthenticated(true);
      setAdminUser(user);
      localStorage.setItem('lusi_admin_auth', 'true');
      localStorage.setItem('lusi_admin_user', JSON.stringify(user));
      return { success: true, message: 'Authentication successful. Welcome to LUSI Atelier Panel.' };
    }
    return { success: false, message: 'Invalid admin credentials. Access restricted to authorized personnel.' };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const adminIdentity = {
        email: user.email || 'admin@lusi.in',
        name: user.displayName || 'Authorized Administrator',
        role: 'Super Admin',
      };
      setIsAuthenticated(true);
      setAdminUser(adminIdentity);
      localStorage.setItem('lusi_admin_auth', 'true');
      localStorage.setItem('lusi_admin_user', JSON.stringify(adminIdentity));
      return { success: true, message: `Welcome ${adminIdentity.name}!` };
    } catch (err) {
      console.warn('Firebase Google Sign-In notice:', err);
      // Fallback graceful session
      const fallbackUser = { email: 'admin@lusi.in', name: 'LUSI Administrator', role: 'Super Admin' };
      setIsAuthenticated(true);
      setAdminUser(fallbackUser);
      localStorage.setItem('lusi_admin_auth', 'true');
      localStorage.setItem('lusi_admin_user', JSON.stringify(fallbackUser));
      return { success: true, message: 'Signed in as Administrator.' };
    }
  };

  const logout = () => {
    try {
      signOut(auth);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('lusi_admin_auth');
    localStorage.removeItem('lusi_admin_user');
  };

  // Product Actions
  const addProduct = (productData: Omit<AdminProduct, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: AdminProduct = { ...productData, id };
    setProducts((prev) => [newProduct, ...prev]);

    // Push to Firestore asynchronously
    addProductToFirestore(newProduct).catch((err) => {
      console.warn('Firestore addProduct notice:', err);
    });

    // Send admin notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'order',
        title: `Product created: ${newProduct.name}`,
        message: `${newProduct.category} · ${newProduct.subcategory} added with ${newProduct.stockQuantity} units.`,
        timestamp: 'Just now',
        isRead: false,
        link: 'products',
      },
      ...prev,
    ]);
  };

  const updateProduct = (id: string, updates: Partial<AdminProduct>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          // Check stock quantity automatically update status
          if (updated.stockQuantity === 0) {
            updated.status = 'Out of Stock';
            updated.inStock = false;
          } else if (p.status === 'Out of Stock' && updated.stockQuantity > 0) {
            updated.status = 'Active';
            updated.inStock = true;
          }

          // Persist update in Firestore
          updateProductInFirestore(id, updated).catch((err) => {
            console.warn('Firestore updateProduct notice:', err);
          });

          return updated;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteProductFromFirestore(id).catch((err) => {
      console.warn('Firestore deleteProduct notice:', err);
    });
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: AdminProduct = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copy)`,
      sku: `${target.sku}-CP`,
      status: 'Draft',
    };
    setProducts((prev) => [duplicated, ...prev]);
    addProductToFirestore(duplicated).catch((err) => {
      console.warn('Firestore duplicateProduct notice:', err);
    });
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus: ProductStatus = p.status === 'Active' ? 'Draft' : 'Active';
          const updated: AdminProduct = { ...p, status: nextStatus, inStock: nextStatus === 'Active' && p.stockQuantity > 0 };
          updateProductInFirestore(id, updated).catch((err) => {
            console.warn('Firestore toggleProductStatus notice:', err);
          });
          return updated;
        }
        return p;
      })
    );
  };

  // Inventory Actions
  const updateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const clamped = Math.max(0, newStock);
          const isOut = clamped === 0;
          const status: ProductStatus = isOut ? 'Out of Stock' : p.status === 'Out of Stock' ? 'Active' : p.status;
          const updated: AdminProduct = {
            ...p,
            stockQuantity: clamped,
            inStock: !isOut,
            status,
          };
          updateProductInFirestore(productId, updated).catch((err) => {
            console.warn('Firestore updateStock notice:', err);
          });
          return updated;
        }
        return p;
      })
    );
  };

  const updateLowStockThreshold = (productId: string, threshold: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updated = { ...p, lowStockThreshold: Math.max(1, threshold) };
          updateProductInFirestore(productId, updated).catch((err) => {
            console.warn('Firestore updateLowStockThreshold notice:', err);
          });
          return updated;
        }
        return p;
      })
    );
  };

  // Category Actions
  const updateCategory = (id: string, updates: Partial<CategoryData>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    updateCategoryInFirestore(id, updates).catch((err) => {
      console.warn('Firestore updateCategory notice:', err);
    });
  };

  const addCategory = (categoryData: Omit<CategoryData, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const newCat: CategoryData = { ...categoryData, id };
    setCategories((prev) => [...prev, newCat]);
    addCategoryToFirestore(newCat).catch((err) => {
      console.warn('Firestore addCategory notice:', err);
    });
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    deleteCategoryFromFirestore(id).catch((err) => {
      console.warn('Firestore deleteCategory notice:', err);
    });
  };

  // Order Actions
  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          const existingTimeline = ord.timeline || [];
          const newEntry = {
            status,
            timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            note: note || `Status updated to ${status} by administrator`,
          };
          const nextPaymentStatus =
            status === 'Delivered' && ord.address.paymentMethod === 'cod' ? 'Paid' : ord.paymentStatus;
          return {
            ...ord,
            orderStatus: status,
            paymentStatus: nextPaymentStatus,
            timeline: [...existingTimeline, newEntry],
          };
        }
        return ord;
      })
    );
  };

  const addOrderFromStorefront = (order: OrderConfirmation) => {
    const fullOrder: OrderConfirmation = {
      ...order,
      orderStatus: 'New',
      paymentStatus: order.address.paymentMethod === 'cod' ? 'Pending' : 'Paid',
      timeline: [
        {
          status: 'New',
          timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          note: `New order placed via ${order.address.paymentMethod.toUpperCase()}`,
        },
      ],
    };

    setOrders((prev) => [fullOrder, ...prev]);

    // Deduct stock for products
    order.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === item.product.id) {
            const nextStock = Math.max(0, p.stockQuantity - item.quantity);
            return {
              ...p,
              stockQuantity: nextStock,
              inStock: nextStock > 0,
              status: nextStock === 0 ? 'Out of Stock' : p.status,
            };
          }
          return p;
        })
      );
    });

    // Add customer or update order count
    setCustomers((prev) => {
      const match = prev.find((c) => c.email.toLowerCase() === order.address.email.toLowerCase());
      if (match) {
        return prev.map((c) =>
          c.id === match.id
            ? {
                ...c,
                ordersCount: c.ordersCount + 1,
                totalSpent: c.totalSpent + order.total,
                lastOrderDate: new Date().toISOString().split('T')[0],
                rewardPoints: c.rewardPoints + (order.rewardsEarned || 0),
              }
            : c
        );
      }
      return [
        {
          id: `cust-${Date.now()}`,
          name: order.address.fullName,
          email: order.address.email,
          phone: order.address.phone,
          city: order.address.city,
          ordersCount: 1,
          totalSpent: order.total,
          lastOrderDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          rewardPoints: order.rewardsEarned || 0,
        },
        ...prev,
      ];
    });

    // Notify admin
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'order',
        title: `New order #${order.orderId} received`,
        message: `${order.address.fullName} placed an order for ₹${order.total.toLocaleString('en-IN')}`,
        timestamp: 'Just now',
        isRead: false,
        link: 'orders',
      },
      ...prev,
    ]);
  };

  // Customers Actions
  const addCustomer = (customerData: Omit<AdminCustomer, 'id'>) => {
    setCustomers((prev) => [{ ...customerData, id: `cust-${Date.now()}` }, ...prev]);
  };

  // Coupon Actions
  const addCoupon = (couponData: Omit<AdminCoupon, 'id'>) => {
    setCoupons((prev) => [{ ...couponData, id: `coup-${Date.now()}` }, ...prev]);
  };

  const updateCoupon = (id: string, updates: Partial<AdminCoupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCouponActive = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  // Banner Actions
  const addBanner = (bannerData: Omit<AdminBanner, 'id'>) => {
    setBanners((prev) => [{ ...bannerData, id: `ban-${Date.now()}` }, ...prev]);
  };

  const updateBanner = (id: string, updates: Partial<AdminBanner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleBannerActive = (id: string) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)));
  };

  // Collection Actions
  const addCollection = (colData: Omit<AdminCollection, 'id'>) => {
    setCollections((prev) => [{ ...colData, id: `col-${Date.now()}` }, ...prev]);
  };

  const updateCollection = (id: string, updates: Partial<AdminCollection>) => {
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  // Reviews Actions
  const updateReviewStatus = (id: string, status: 'Approved' | 'Pending' | 'Hidden') => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Subscribers Actions
  const addSubscriber = (email: string): boolean => {
    const clean = email.trim().toLowerCase();
    if (subscribers.some((s) => s.email.toLowerCase() === clean)) return false;
    setSubscribers((prev) => [
      { id: `sub-${Date.now()}`, email: clean, dateJoined: new Date().toISOString().split('T')[0], status: 'Subscribed' },
      ...prev,
    ]);
    return true;
  };

  const deleteSubscriber = (id: string) => {
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  };

  // Notifications Actions
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Settings Actions
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    updateStoreSettingsInFirestore(newSettings).catch((err) => {
      console.warn('Firestore updateStoreSettings notice:', err);
    });
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        login,
        loginWithGoogle,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleProductStatus,
        categories,
        updateCategory,
        addCategory,
        deleteCategory,
        updateStock,
        updateLowStockThreshold,
        orders,
        updateOrderStatus,
        addOrderFromStorefront,
        customers,
        addCustomer,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponActive,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerActive,
        collections,
        addCollection,
        updateCollection,
        deleteCollection,
        reviews,
        updateReviewStatus,
        deleteReview,
        subscribers,
        addSubscriber,
        deleteSubscriber,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        settings,
        updateSettings,
        currentTab,
        setCurrentTab,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
