import { Test, TestingModule } from '@nestjs/testing';
import { OkrProjectsController } from './okr_projects.controller';
import { OkrProjectsService } from './okr_projects.service';

describe('OkrProjectsController', () => {
  let controller: OkrProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OkrProjectsController],
      providers: [OkrProjectsService],
    }).compile();

    controller = module.get<OkrProjectsController>(OkrProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
