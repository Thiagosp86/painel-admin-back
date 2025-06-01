import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule],
  providers: [PrismaService],
  exports: [PrismaService], // Export PrismaService for use in other modules
})
export class AppModule {}
