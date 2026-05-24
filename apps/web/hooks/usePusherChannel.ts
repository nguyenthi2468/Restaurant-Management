// hooks/usePusherChannel.ts
import { useEffect, useRef } from 'react';
import { getPusherClient } from '@/lib/pusher-client';
import type { Channel } from 'pusher-js';

export function usePusherChannel(
  channelName: string,
  event: string,
  onEvent: (data: any) => void,
) {
  const channelRef = useRef<Channel | null>(null);
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    const handler = (data: any) => {
      onEventRef.current(data);
    };

    channel.bind(event, handler);

    return () => {
      channel.unbind(event, handler);
      pusher.unsubscribe(channelName);
    };
  }, [channelName, event]);
}
