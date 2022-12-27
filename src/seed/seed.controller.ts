import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@Controller('seed')
@ApiTags('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  create() {
    return this.seedService.create();
  }
}
