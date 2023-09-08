import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('AppService', () => {
  let appService: AppService;
  let workerServiceProxyMock: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: 'WORKER_SERVICE',
          useFactory: () => ({
            send: jest.fn(),
          }),
        },
      ],
    }).compile();

    appService = module.get(AppService);
    workerServiceProxyMock = module.get('WORKER_SERVICE');
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('startFetchingData', () => {
    it('should start fetching data', async () => {
      const intervalInMinutes = 1;

      const observableMock = of(null);
      const sendMock = jest.fn().mockReturnValue(observableMock);
      workerServiceProxyMock.send.mockImplementation(sendMock);

      await appService.startFetchingData(intervalInMinutes);

      expect(workerServiceProxyMock.send).toHaveBeenCalled();
    });
  });

  describe('stopFetchingData', () => {
    it('should stop fetching data', async () => {
      const observableMock = of(null);
      const sendMock = jest.fn().mockReturnValue(observableMock);
      workerServiceProxyMock.send.mockImplementation(sendMock);

      await appService.stopFetchingData();

      expect(workerServiceProxyMock.send).toHaveBeenCalledWith('stop-fetching-data', {});
    });
  });

  describe('handleDataWasFetchedEvent', () => {
    it('should handle data was fetched event', () => {
      const eventData = {
      processId: '12345',
      data: { key: 'value' },
    };
      appService.handleDataWasFetchedEvent(eventData);

      expect(appService['latestData']).toEqual(eventData);
    });
  });

  describe('getLatestData', () => {
    it('should return latest data', () => {
      const eventData = {
      processId: '12345',
      data: { key: 'value' },
    };
      appService.handleDataWasFetchedEvent(eventData);

      const latestData = appService.getLatestData();
      expect(latestData).toEqual(eventData);
    });

    it('should return "No data fetched yet." when no data is available', () => {
      const latestData = appService.getLatestData();
      expect(latestData).toBe('No data fetched yet.');
    });
  });
});
