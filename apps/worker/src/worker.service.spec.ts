import { Test, TestingModule } from '@nestjs/testing';
import { WorkerService } from './worker.service';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';

describe('WorkerService', () => {
  let workerService: WorkerService;
  let clientProxyMock: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerService,
        {
          provide: 'DATA_STREAMS_SERVICE',
          useFactory: () => ({
            emit: jest.fn(),
          }),
        },
      ],

    }).compile();

    workerService = module.get(WorkerService);
    clientProxyMock = module.get('DATA_STREAMS_SERVICE');
  });

    afterAll(async () => {
    workerService.stopFetchingData();
  });

  it('should be defined', () => {
    expect(workerService).toBeDefined();
  });

  describe('startFetchingData', () => {
    it('should start fetching data and publish it', async () => {
      const intervalInMinutes = 1;
      const processId = 'test-process-id';
      const axiosGetSpy = jest.spyOn(axios, 'get');
      const responseData = { data: 'test-data' };
      axiosGetSpy.mockResolvedValue({ data: responseData });

      await workerService.startFetchingData(intervalInMinutes, processId);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(axiosGetSpy).toHaveBeenCalledWith('https://www.dnd5eapi.co/api/spells');
      expect(clientProxyMock.emit).toHaveBeenCalledWith('data-was-fetched', {
        processId: processId,
        data: responseData,
      });
    });

    it('should stop fetching data when processId is null', async () => {
      const intervalInMinutes = 1;
      const processId = 'test-process-id';
      const axiosGetSpy = jest.spyOn(axios, 'get');

      await workerService.startFetchingData(intervalInMinutes, processId);

      workerService.stopFetchingData();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(axiosGetSpy).toBeCalledTimes(2);
      expect(clientProxyMock.emit).toBeCalledTimes(1)
    });
  });

  describe('stopFetchingData', () => {
    it('should stop fetching data', () => {
      workerService.stopFetchingData();
      expect(workerService['processId']).toBeNull();
    });
  });
});
