import { Controller, Post, Param, Get } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('predict/:assetId')
  async predict(@Param('assetId') assetId: string) {
    return this.aiService.predictRUL(assetId);
  }

  @Get('predictions')
  async getPredictions() {
    return this.aiService.getLatestPredictions();
  }
}
