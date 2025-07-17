// types/express.d.ts
import { Request } from 'express';
import { Multer } from 'multer';

declare module 'express' {
  interface Request {
    file?: Express.Multer.File;
    files?:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] };
  }
}
