import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StylistsModule } from './stylists/stylists.module';
import { CatalogModule } from './catalog/catalog.module';
import { BookingModule } from './booking/booking.module';
import { GeoModule } from './geo/geo.module';
import { NotifyModule } from './notify/notify.module';
import { KafkaModule } from './kafka/kafka.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, StylistsModule, CatalogModule, BookingModule, GeoModule, NotifyModule, KafkaModule, MetricsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
