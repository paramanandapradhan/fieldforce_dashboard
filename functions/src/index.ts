
import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase-admin/app';

dotenv.config();

initializeApp();
console.log('Firebase app initializeApp');
console.log('Environment', process.env.VITE_ENVIRONMENT);

export * from './controllers';



