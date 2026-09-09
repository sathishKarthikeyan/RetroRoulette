import { Controller, Get, Post } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { Participant, SpinResult, ResetResult } from './participants.types';

@Controller()
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Get('participants')
  getParticipants(): Participant[] {
    return this.participantsService.getParticipants();
  }

  @Post('spin')
  spin(): SpinResult {
    return this.participantsService.spin();
  }

  @Post('reset')
  reset(): ResetResult {
    return this.participantsService.reset();
  }
}
