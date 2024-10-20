import { Test, TestingModule } from '@nestjs/testing';
import { OkrProjectsController } from './okr_projects.controller';
import { OkrProjectsService } from './okr_projects.service';
import { OkrProject } from './entities/okr_project.entity';
import { UpdateOkrProjectDto } from './dto/update-okr_project.dto';

describe('OkrProjectsController', () => {
  let controller: OkrProjectsController;
  let service: OkrProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OkrProjectsController],
      providers: [OkrProjectsService],
    }).compile();

    controller = module.get<OkrProjectsController>(OkrProjectsController);
    service = module.get<OkrProjectsService>(OkrProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new OKR project', async () => {
    const createDto: OkrProject = {
      id: 0,
      company_id: 0,
      project_name: '',
      description: '',
      created_at: new Date(),
      updated_at: new Date()
    };
    jest.spyOn(service, 'create').mockImplementation(async () => createDto);

    expect(await controller.create(createDto)).toBe(createDto);
  });

  it('should find all OKR projects for a company', async () => {
    const companyId = 1; 
    const projects = [
      {
        id: 0,
        company_id: companyId,
        project_name: 'projeto 1',
        description: '',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 1,
        company_id: companyId,
        project_name: 'projeto 2',
        description: '',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    jest.spyOn(service, 'findAll').mockImplementation(async () => projects);

    expect(await controller.findAll(companyId)).toBe(projects);
  });

  it('should find a specific OKR project by ID', async () => {
    const projectId = 1; // Mock project ID
    const project: OkrProject = {
      id: 1,
      company_id: 0,
      project_name: '',
      description: '',
      created_at: new Date(),
      updated_at: new Date()
    };
    jest.spyOn(service, 'findOne').mockImplementation(async () => project);

    expect(await controller.findOne(projectId)).toBe(project);
  });

  it('should update an OKR project', async () => {
    const projectId = 1; // Mock project ID
    const updateDto: UpdateOkrProjectDto = {
      description: 'teste update',
    };
    const updatedProject: UpdateOkrProjectDto = { id: projectId, ...updateDto };
    jest
      .spyOn(service, 'update')
      .mockImplementation(async () => updatedProject);

    expect(await controller.update(projectId, updateDto)).toBe(updatedProject);
  });

  it('should remove an OKR project', async () => {
    const projectId = 1; // Mock project ID
    const removedProject = {
      /* mock removed project object */
    };
    jest
      .spyOn(service, 'remove')
      .mockImplementation(async () => removedProject);

    expect(await controller.remove(projectId)).toBe(removedProject);
  });
});
