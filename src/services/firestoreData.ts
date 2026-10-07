import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  AdminProduct,
  Product,
  OrderConfirmation,
  AdminCustomer,
  AdminCoupon,
  AdminBanner,
  StoreSettings,
  Category,
  CategoryData,
  OrderStatus,
} from '../types';
import {
  INITIAL_ADMIN_PRODUCTS,
  INITIAL_STORE_SETTINGS,
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_CUSTOMERS,
  INITIAL_ADMIN_COUPONS,
  INITIAL_ADMIN_BANNERS,
  INITIAL_ADMIN_CATEGORIES,
} from '../data/adminMockData';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const ORDERS_COLLECTION = 'orders';
const CUSTOMERS_COLLECTION = 'customers';
const COUPONS_COLLECTION = 'coupons';
const BANNERS_COLLECTION = 'banners';
const SETTINGS_COLLECTION = 'settings';

/**
 * Automatically seeds Firestore with the authentic initial apparel catalog,
 * categories, settings, and banners if the collection is empty.
 */
export async function seedFirestoreIfEmpty() {
  try {
    // 1. Seed Categories if empty
    const categoriesSnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (categoriesSnapshot.empty) {
      console.log('Seeding initial LUSI categories into Firestore...');
      const catBatch = writeBatch(db);
      INITIAL_ADMIN_CATEGORIES.forEach((cat) => {
        const catRef = doc(db, CATEGORIES_COLLECTION, cat.id);
        catBatch.set(catRef, cat);
      });
      await catBatch.commit();
      console.log('Categories seeded successfully.');
    }

    // 2. Seed Products if empty
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (productsSnapshot.empty) {
      console.log('Seeding initial LUSI apparel catalog into Firestore...');
      const batch = writeBatch(db);

      // Seed Products
      INITIAL_ADMIN_PRODUCTS.forEach((prod) => {
        const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
        batch.set(docRef, prod);
      });

      // Seed Store Settings
      const settingsRef = doc(db, SETTINGS_COLLECTION, 'global');
      batch.set(settingsRef, INITIAL_STORE_SETTINGS);

      // Seed Coupons
      INITIAL_ADMIN_COUPONS.forEach((coup) => {
        const coupRef = doc(db, COUPONS_COLLECTION, coup.id);
        batch.set(coupRef, coup);
      });

      // Seed Banners
      INITIAL_ADMIN_BANNERS.forEach((ban) => {
        const banRef = doc(db, BANNERS_COLLECTION, ban.id);
        batch.set(banRef, ban);
      });

      // Seed Customers
      INITIAL_ADMIN_CUSTOMERS.forEach((cust) => {
        const custRef = doc(db, CUSTOMERS_COLLECTION, cust.id);
        batch.set(custRef, cust);
      });

      // Seed Orders
      INITIAL_ADMIN_ORDERS.forEach((ord) => {
        const ordRef = doc(db, ORDERS_COLLECTION, ord.orderId);
        batch.set(ordRef, ord);
      });

      await batch.commit();
      console.log('Firestore initialization complete.');
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PRODUCTS_COLLECTION);
  }
}

/**
 * Real-time listener for categories collection from Firestore.
 * Automatically synchronizes department taxonomy, banners, and subcategories.
 */
export function subscribeToCategories(
  onData: (categories: CategoryData[]) => void,
  onError?: (err: any) => void
) {
  const q = collection(db, CATEGORIES_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const items: CategoryData[] = [];
      snapshot.forEach((doc) => {
        items.push({ ...(doc.data() as CategoryData), id: doc.id });
      });
      items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      if (items.length > 0) {
        onData(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, CATEGORIES_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Add or overwrite category in Firestore
 */
export async function addCategoryToFirestore(category: CategoryData) {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
    await setDoc(docRef, category);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${CATEGORIES_COLLECTION}/${category.id}`);
    throw error;
  }
}

/**
 * Update category in Firestore
 */
export async function updateCategoryInFirestore(id: string, updates: Partial<CategoryData>) {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${CATEGORIES_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Delete category from Firestore
 */
export async function deleteCategoryFromFirestore(id: string) {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CATEGORIES_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Real-time listener for products collection from Firestore.
 * Updates both customer storefront and admin panel simultaneously.
 */
export function subscribeToProducts(
  onData: (products: AdminProduct[]) => void,
  onError?: (err: any) => void
) {
  const q = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const items: AdminProduct[] = [];
      snapshot.forEach((doc) => {
        items.push({ ...(doc.data() as AdminProduct), id: doc.id });
      });
      if (items.length > 0) {
        onData(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Add product to Firestore
 */
export async function addProductToFirestore(product: AdminProduct) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, product);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${PRODUCTS_COLLECTION}/${product.id}`);
    throw error;
  }
}

/**
 * Update product in Firestore
 */
export async function updateProductInFirestore(id: string, updates: Partial<AdminProduct>) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PRODUCTS_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Delete product from Firestore
 */
export async function deleteProductFromFirestore(id: string) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Real-time listener for orders from Firestore
 */
export function subscribeToOrders(
  onData: (orders: OrderConfirmation[]) => void,
  onError?: (err: any) => void
) {
  const q = collection(db, ORDERS_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const ordersList: OrderConfirmation[] = [];
      snapshot.forEach((doc) => {
        ordersList.push({ ...(doc.data() as OrderConfirmation), orderId: doc.id });
      });
      // Sort newest first
      ordersList.sort((a, b) => (b.date > a.date ? 1 : -1));
      if (ordersList.length > 0) {
        onData(ordersList);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Add new order to Firestore (called from customer storefront on checkout)
 */
export async function addOrderToFirestore(order: OrderConfirmation) {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.orderId);
    await setDoc(docRef, order);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${ORDERS_COLLECTION}/${order.orderId}`);
    throw error;
  }
}

/**
 * Update order status in Firestore (called from admin panel)
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  updates: Partial<OrderConfirmation>
) {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
    throw error;
  }
}

/**
 * Look up a single order by ID from Firestore (for order tracking)
 */
export async function fetchOrderFromFirestore(orderId: string): Promise<OrderConfirmation | null> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId.trim());
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...(snap.data() as OrderConfirmation), orderId: snap.id };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${ORDERS_COLLECTION}/${orderId}`);
    return null;
  }
}

/**
 * Real-time listener for store settings from Firestore
 */
export function subscribeToStoreSettings(
  onData: (settings: StoreSettings) => void,
  onError?: (err: any) => void
) {
  const docRef = doc(db, SETTINGS_COLLECTION, 'global');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as StoreSettings);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/global`);
      if (onError) onError(error);
    }
  );
}

/**
 * Update store settings in Firestore
 */
export async function updateStoreSettingsInFirestore(updates: Partial<StoreSettings>) {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'global');
    await setDoc(docRef, updates, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_COLLECTION}/global`);
    throw error;
  }
}

/**
 * Real-time listener for promotional banners from Firestore
 */
export function subscribeToBanners(
  onData: (banners: AdminBanner[]) => void,
  onError?: (err: any) => void
) {
  const q = collection(db, BANNERS_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const bannersList: AdminBanner[] = [];
      snapshot.forEach((doc) => {
        bannersList.push({ ...(doc.data() as AdminBanner), id: doc.id });
      });
      bannersList.sort((a, b) => a.displayOrder - b.displayOrder);
      if (bannersList.length > 0) {
        onData(bannersList);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, BANNERS_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Update banner in Firestore
 */
export async function updateBannerInFirestore(id: string, updates: Partial<AdminBanner>) {
  try {
    const docRef = doc(db, BANNERS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${BANNERS_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Real-time listener for coupons from Firestore
 */
export function subscribeToCoupons(
  onData: (coupons: AdminCoupon[]) => void,
  onError?: (err: any) => void
) {
  const q = collection(db, COUPONS_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const couponsList: AdminCoupon[] = [];
      snapshot.forEach((doc) => {
        couponsList.push({ ...(doc.data() as AdminCoupon), id: doc.id });
      });
      if (couponsList.length > 0) {
        onData(couponsList);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, COUPONS_COLLECTION);
      if (onError) onError(error);
    }
  );
}
