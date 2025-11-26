import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'hobbyard-api',
      timestamp: new Date().toISOString(),
    };
  }
}
