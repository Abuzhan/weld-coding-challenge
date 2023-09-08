import {Inject, Injectable, Logger} from '@nestjs/common';
import axios from 'axios';
import {FetchedData} from './data.dto';
import {ClientProxy} from '@nestjs/microservices';

@Injectable()
export class WorkerService {
    private readonly logger = new Logger(WorkerService.name);
    private processId: string;
    private intervalID: NodeJS.Timeout;

    constructor(@Inject('DATA_STREAMS_SERVICE') private workerServiceProxy: ClientProxy) {}

    async startFetchingData(intervalInMinutes: number, processId: string) {
        this.processId = processId;
        this.logger.log(
            `Starting data fetching with interval ${intervalInMinutes} and process ID ${processId}`
        );
        await this.fetchDataFromApiAndPublish();
        this.intervalID = setInterval(
            async () => {
                if (!this.processId) {
                    this.logger.log(`No process ID found. Stopping data fetching`);
                    clearInterval(this.intervalID);
                } else {
                    this.logger.log(
                        `Initializing new data fetch with process ID ${this.processId}`
                    );
                    await this.fetchDataFromApiAndPublish();
                }
            },
            intervalInMinutes * 60 * 1000
        );
        this.logger.log(`Data fetching started with interval ${intervalInMinutes} minutes`);
    }

    private async fetchDataFromApiAndPublish() {
        const url = 'https://www.dnd5eapi.co/api/spells';
        try {
            this.logger.log(`Making request to ${url}`);
            const response = await axios.get(url);
            const data = response.data;

            this.logger.log(`Fetched data from API: ${JSON.stringify(data)}`);

            await this.publishFetchedData({processId: this.processId, data: data});
        } catch (error) {
            this.logger.error(`Error fetching data from API: ${error.message}`);
        }
    }

    private async publishFetchedData(eventData: FetchedData): Promise<void> {
        const pattern = {event: 'data-was-fetched'};
        this.workerServiceProxy.emit(pattern.event, eventData);
    }

    stopFetchingData() {
        this.processId = null;
        this.logger.log(`Stopping data fetching`);
    }
}
