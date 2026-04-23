import { convertBase64ToUint8Array } from '.';
import CONFIG from '../config';
import { StoryAPI } from '../data/api';
import { showSuccess, showError } from './alert';

export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    showError('Izin notifikasi ditolak.');
    return false;
  }

  if (status === 'default') {
    showError('Izin notifikasi ditutup atau diabaikan');
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  if (!('serviceWorker' in navigator)) return null;

  const registration = await navigator.serviceWorker.getRegistration();

  if (!registration || !registration.pushManager) {
    return null;
  }

  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
  };
}

export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  if (await isCurrentPushSubscriptionAvailable()) {
    showError('Sudah berlangganan push notification.');
    return;
  }

  console.log('Mulai berlangganan push notification...');

  const failureSubscribeMessage = 'Langganan push notification gagal diaktifkan.';
  const successSubscribeMessage = 'Langganan push notification berhasil diaktifkan.';

  let pushSubscription;

  try {
    const registration = await navigator.serviceWorker.getRegistration();

    if (!registration || !registration.pushManager) {
      console.warn('Service worker belum siap atau tidak didukung');
      return;
    }

    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await StoryAPI.subscribePushNotification({ endpoint, keys });

    if (!response.ok) {
      console.error('subscribe: response:', response);
      showError(failureSubscribeMessage);

      if (pushSubscription) {
        await pushSubscription.unsubscribe();
      }
      return;
    }

    showSuccess(successSubscribeMessage);
  } catch (error) {
    console.error('subscribe: error:', error);
    showError(failureSubscribeMessage);

    if (pushSubscription) {
      await pushSubscription.unsubscribe();
    }
  }
}

export async function unsubscribe() {
  const failureUnsubscribeMessage = 'Langganan push notification gagal dinonaktifkan.';
  const successUnsubscribeMessage = 'Langganan push notification berhasil dinonaktifkan.';

  try {
    const pushSubscription = await getPushSubscription();

    if (!pushSubscription) {
      showError(
        'Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.',
      );
      return;
    }

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await StoryAPI.unsubscribePushNotification({ endpoint });

    if (!response.ok) {
      showError(failureUnsubscribeMessage);
      console.error('unsubscribe: response:', response);

      return;
    }

    const unsubscribed = await pushSubscription.unsubscribe();

    if (!unsubscribed) {
      showError(failureUnsubscribeMessage);
      await StoryAPI.subscribePushNotification({ endpoint, keys });

      return;
    }

    showSuccess(successUnsubscribeMessage);
  } catch (error) {
    showError(failureUnsubscribeMessage);
    console.error('unsubscribe: error:', error);
  }
}
