import { MidwayConfig } from '@midwayjs/core';
import * as entities from '../entity';
import { join } from 'path'

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1753419934921_9891',
  koa: {
    port: 7001,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: 'backend.db',
        synchronize: true,
        logging: true,
        // ...
        entities: [...Object.values(entities)],  
      }
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
  },
  staticFile: {
    dirs: {
      '/public': {
        prefix: '/public',
        dir: join(__dirname, '../../public'),
      },
      '/user/avatar': {
        prefix: '/user/avatar',
        dir: join(__dirname, '../../public/avatar'),
      },
    },
  },
} as MidwayConfig;
