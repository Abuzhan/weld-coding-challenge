import {Controller, Logger} from '@nestjs/common';
import {WorkerService} from './worker.service';
import {MessagePattern} from '@nestjs/microservices';
import { StartFetchingCommand } from './data.dto';

@Controller()
export class WorkerController {
    private readonly logger = new Logger(WorkerController.name);
    constructor(private readonly workerService: WorkerService) {}

    @MessagePattern('start-fetching-data')
    async startFetchingData(data: StartFetchingCommand) {
        const {intervalInMinutes, processId} = data;
        this.logger.log(
            `Starting data fetching with interval ${intervalInMinutes} and process ID ${processId}`
        );
        this.workerService.startFetchingData(intervalInMinutes, processId);
        this.logger.log(
            `Successfully started data fetching with interval ${intervalInMinutes} minutes`
        );
        return 'Data fetching started.';
    }

    @MessagePattern('stop-fetching-data')
    async stopFetchingData() {
        this.logger.log(`Received request to stop data fetching`);
        this.workerService.stopFetchingData();
        this.logger.log(`Successfully stopped data fetching`);
        return 'Data fetching stopped.';
    }
}
