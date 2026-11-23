// src/services/purchases/purchases.service.ts
import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';
import Purchases, {
  LOG_LEVEL,
  PRODUCT_CATEGORY,
  type CustomerInfo,
  type PurchasesError,
} from 'react-native-purchases';

export const IS_EXPO_GO: boolean = isRunningInExpoGo();

/** Solo en desarrollo: simula compras exitosas cuando RevenueCat no está disponible (Expo Go). */
const MOCK_PURCHASES: boolean = __DEV__ && process.env.EXPO_PUBLIC_MOCK_PURCHASES === 'true';

const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_RC_IOS_KEY ?? '',
  android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY ?? '',
} as const;

export type PurchaseResult =
  | { status: 'success'; mocked: boolean }
  | { status: 'cancelled' }
  | { status: 'unavailable'; message: string }
  | { status: 'error'; message: string };

let isConfigured = false;

export const isPurchasesAvailable = (): boolean => !IS_EXPO_GO && isConfigured;

const isPurchasesError = (e: unknown): e is PurchasesError =>
  typeof e === 'object' && e !== null && 'userCancelled' in e;

const hasPurchasedProduct = (info: CustomerInfo, productId: string): boolean =>
  info.allPurchasedProductIdentifiers.includes(productId);

/** Configura RevenueCat una sola vez. En Expo Go no hace nada. */
export const initPurchases = (): void => {
  if (isConfigured) return;

  if (IS_EXPO_GO) {
    console.log('[Purchases] Expo Go detectado: RevenueCat desactivado.');
    return;
  }

  const apiKey =
    Platform.OS === 'ios' ? API_KEYS.ios : Platform.OS === 'android' ? API_KEYS.android : '';

  if (!apiKey) {
    console.warn(`[Purchases] Falta la API key de RevenueCat para ${Platform.OS}.`);
    return;
  }

  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
  Purchases.configure({ apiKey });
  isConfigured = true;
};

/** Vincula las compras con el usuario de Laravel. Nunca lanza error: no debe romper el login. */
export const loginPurchases = async (userId: string | number): Promise<void> => {
  if (!isPurchasesAvailable()) return;
  try {
    await Purchases.logIn(String(userId));
  } catch (e: unknown) {
    console.warn('[Purchases] No se pudo vincular el usuario:', e);
  }
};

/** Desvincula al usuario. Nunca lanza error: no debe romper el logout. */
export const logoutPurchases = async (): Promise<void> => {
  if (!isPurchasesAvailable()) return;
  try {
    const isAnonymous = await Purchases.isAnonymous();
    if (!isAnonymous) await Purchases.logOut();
  } catch (e: unknown) {
    console.warn('[Purchases] No se pudo cerrar sesión en RevenueCat:', e);
  }
};

/** Compra única (non-consumable) de un curso por su ID de producto en la tienda. */
export const purchaseProduct = async (productId: string): Promise<PurchaseResult> => {
  if (!isPurchasesAvailable()) {
    if (MOCK_PURCHASES) return { status: 'success', mocked: true };
    return {
      status: 'unavailable',
      message: 'Las compras solo están disponibles en la app instalada, no en Expo Go.',
    };
  }

  try {
    const [product] = await Purchases.getProducts([productId], PRODUCT_CATEGORY.NON_SUBSCRIPTION);
    if (!product) {
      return { status: 'error', message: 'No se encontró este curso en la tienda.' };
    }

    const { customerInfo } = await Purchases.purchaseStoreProduct(product);

    return hasPurchasedProduct(customerInfo, productId)
      ? { status: 'success', mocked: false }
      : {
          status: 'error',
          message: 'La compra se realizó, pero no se pudo confirmar. Contacta a soporte.',
        };
  } catch (e: unknown) {
    if (isPurchasesError(e) && e.userCancelled) return { status: 'cancelled' };
    return {
      status: 'error',
      message: e instanceof Error ? e.message : 'Ocurrió un error al procesar el pago.',
    };
  }
};

/** Devuelve los IDs de productos que el usuario ya compró (para el botón "Restaurar compras"). */
export const restorePurchases = async (): Promise<string[]> => {
  if (!isPurchasesAvailable()) return [];
  const info = await Purchases.restorePurchases();
  return info.allPurchasedProductIdentifiers;
};