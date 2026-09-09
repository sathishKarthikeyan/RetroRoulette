import { Module } from '@nestjs/common';
import { ParticipantsModule } from './participants/participants.module';

@Module({
  imports: [ParticipantsModule],
})
export class AppModule {}
