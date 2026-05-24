import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PusherService } from './pusher.service';

@Controller('pusher')
export class PusherController {
  constructor(private pusherService: PusherService) {}

  @Post('auth')
  @UseGuards(JwtAuthGuard)
  auth(
    @Body('socket_id') socketId: string,
    @Body('channel_name') channelName: string,
  ) {
    return this.pusherService.auth(socketId, channelName);
  }

  @Post('trigger')
  async trigger(
    @Body('channel') channel: string,
    @Body('event') event: string,
    @Body('data') data: any,
  ) {
    if (!channel || !event) {
      return {
        success: false,
        message: 'Channel and event are required',
      };
    }

    try {
      await this.pusherService.trigger(channel, event, data);
      return { success: true, message: 'Event triggered successfully' };
    } catch (error) {
      console.error('Error triggering Pusher event:', error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to trigger event',
      };
    }
  }
}
