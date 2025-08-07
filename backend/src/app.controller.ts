import { Controller, Post, Body, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller('results')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  postResults(
    @Body()
    resultData: {
      id: string;
      testName: string;
      score: number;
      status: string;
    }[],
  ) {
    return this.appService.handleResults(resultData);
  }

  @Get()
  getResults(): {
    id: string;
    testName: string;
    score: number;
    status: string;
  }[] {
    return this.appService.getResults();
  }
}
