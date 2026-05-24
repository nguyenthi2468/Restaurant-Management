'use client';

import { useState, useCallback } from 'react';
import { usePusherChannel } from '@/hooks/usePusherChannel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  timestamp: string;
}

export default function PusherTestPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channelName, setChannelName] = useState('test-channel');
  const [eventName, setEventName] = useState('test-event');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  const handlePusherEvent = useCallback(
    (data: any) => {
      if (!isSubscribed) return;

      const newMessage: Message = {
        id: Date.now().toString(),
        text: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [newMessage, ...prev]);
    },
    [isSubscribed],
  );

  usePusherChannel(channelName, eventName, handlePusherEvent);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setMessages([]);
  };

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
  };

  const handleSendTestMessage = async () => {
    if (!testMessage.trim()) return;

    try {
      const response = await fetch('/api/pusher/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: channelName,
          event: eventName,
          message: testMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTestMessage('');
        const successMessage: Message = {
          id: Date.now().toString(),
          text: `✓ Message sent successfully: "${testMessage}"`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [successMessage, ...prev]);
      } else {
        console.error('Failed to send message:', data.error);
        alert(`Failed to send message: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(
        `Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Pusher Test Page</h1>
        <p className="text-muted-foreground">
          Test real-time messaging with Pusher
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Channel Configuration</CardTitle>
            <CardDescription>
              Configure the channel and event to subscribe to
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Channel Name</label>
                <Input
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="test-channel"
                  disabled={isSubscribed}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Name</label>
                <Input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="test-event"
                  disabled={isSubscribed}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!isSubscribed ? (
                <Button onClick={handleSubscribe}>Subscribe to Channel</Button>
              ) : (
                <Button onClick={handleUnsubscribe} variant="destructive">
                  Unsubscribe
                </Button>
              )}
              <Badge variant={isSubscribed ? 'default' : 'secondary'}>
                {isSubscribed ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send Test Message</CardTitle>
            <CardDescription>
              Send a test message to the channel (requires backend endpoint)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter test message..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendTestMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendTestMessage}
                disabled={!testMessage.trim()}
              >
                Send
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: This requires a backend endpoint at /api/pusher/test
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Received Messages</CardTitle>
                <CardDescription>
                  Messages received from Pusher in real-time
                </CardDescription>
              </div>
              <Button onClick={clearMessages} variant="outline" size="sm">
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No messages received yet. Subscribe to a channel to start
                  receiving messages.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="p-4 rounded-lg bg-muted border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{message.timestamp}</Badge>
                      </div>
                      <pre className="text-sm whitespace-pre-wrap break-words">
                        {message.text}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Enter a channel name and event name (or use defaults)</p>
            <p>2. Click "Subscribe to Channel" to start listening</p>
            <p>3. Use the backend API or another client to trigger events</p>
            <p>4. Messages will appear in the "Received Messages" section</p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Backend Test Command:</p>
              <code className="text-xs">
                POST /api/pusher/test
                <br />
                Body:{' '}
                {JSON.stringify(
                  { channel: channelName, event: eventName, message: 'Hello' },
                  null,
                  2,
                )}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
