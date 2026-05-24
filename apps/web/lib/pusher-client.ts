import PusherClient from 'pusher-js';
import Cookies from 'js-cookie';
let pusherInstance: PusherClient | null = null;

export function getPusherClient() {
  if (!pusherInstance) {
    pusherInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      // Nếu dùng private channel:
      authEndpoint: '/pusher/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken') || ''}`,
        },
      },
    });
  }
  return pusherInstance;
}