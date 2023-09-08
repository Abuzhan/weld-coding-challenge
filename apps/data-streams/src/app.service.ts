import {Inject, Injectable, Logger} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {lastValueFrom} from 'rxjs';
import {FetchedData, StartFetchingCommand} from './data.dto';
import {v4 as uuid} from 'uuid';

@Injectable()
export class AppService {
    private logger = new Logger(AppService.name);
    private latestData: FetchedData;

    constructor(@Inject('WORKER_SERVICE') private workerServiceProxy: ClientProxy) {}

    async startFetchingData(intervalInMinutes: number) {
        const processId = uuid();
        this.logger.log(`Starting data fetching with process ID ${processId}`);
        await this.sendStartCommandToWorker({processId, intervalInMinutes});
    }

    private async sendStartCommandToWorker(data: StartFetchingCommand) {
        const pattern = {cmd: 'start-fetching-data'};
        this.logger.log(
            `Sending start-fetching-data command to worker with data: ${JSON.stringify(data)}`
        );
        await lastValueFrom(this.workerServiceProxy.send(pattern.cmd, data));
    }

    async stopFetchingData(): Promise<void> {
        await this.sendStopCommandToWorker();
    }

    private async sendStopCommandToWorker() {
        const pattern = {cmd: 'stop-fetching-data'};
        this.logger.log(`Sending stop-fetching-data command to worker`);
        await lastValueFrom(this.workerServiceProxy.send(pattern.cmd, {}));
    }

    handleDataWasFetchedEvent(eventData: FetchedData) {
        this.logger.log(`Received event: ${JSON.stringify(eventData)}`);
        this.latestData = eventData;
    }

    getLatestData(): FetchedData | string {
        if (this.latestData) {
            return this.latestData;
        } else {
            return 'No data fetched yet.';
        }
    }
}
