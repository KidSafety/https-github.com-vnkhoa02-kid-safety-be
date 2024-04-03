import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebHistorySyncInputDto } from './types/web.history.sync.input.dto';
import { SearchQueryDto } from 'src/common/dtos/search.query';

@Injectable()
export class WebhistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getWebHistoryList(user: User, query: SearchQueryDto) {
    return await this.prismaService.chromeWebHistory.findMany({
      where: {
        userId: user.id,
      },
      skip: Number(query.skip),
      take: Number(query.limit),
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async syncWebhistory(user: User, data: WebHistorySyncInputDto[]) {
    const chromeWebHistoryInputs: Prisma.ChromeWebHistoryCreateManyInput[] =
      data.map((item) => ({
        itemId: item.id,
        url: item.url,
        title: item.title,
        score: 0,
        category: 'unknown',
        lastVisitTime: new Date(item.lastVisitTime),
        visitCount: item.visitCount,
        typedCount: 0,
        duration: 0,
        userId: user.id,
      }));

    return await this.prismaService.chromeWebHistory.createMany({
      data: chromeWebHistoryInputs,
      skipDuplicates: true,
    });
  }
}
