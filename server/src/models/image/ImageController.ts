import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Logger } from 'nestjs-pino';
import * as path from 'path';
import * as fs from 'fs';

@Controller('image')
export class ImageController {
  constructor(private readonly logger: Logger) {}

  @Get(':filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    this.logger.log(`Requested image: ${filename}`);
    try {
      const imagePath = path.join(__dirname, '..', '..', '..', 'static', 'image', filename);
      this.logger.log(`Checking image path: ${imagePath}`);
      if (!fs.existsSync(imagePath)) {
        this.logger.error(`Image not found: ${imagePath}`);
        return res.status(HttpStatus.NOT_FOUND).send('Image not found');
      }
      res.set({
        'Content-Type': `image/${path.extname(filename).slice(1)}`,
        'Access-Control-Allow-Origin': '*',
      });
      res.sendFile(imagePath);
    } catch (e) {
      this.logger.error(`Error serving image: ${e.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error serving image');
    }
  }
}
