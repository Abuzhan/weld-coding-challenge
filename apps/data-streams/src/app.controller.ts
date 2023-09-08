import {Body, Controller, Get, Logger, Post} from '@nestjs/common';
import {AppService} from './app.service';
import {FetchedData, StartFetchingRequest} from './data.dto';
import {EventPattern} from '@nestjs/microservices';

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name);
    constructor(private readonly appService: AppService) {}

    @Post('data-streams/start-fetching')
    async startFetching(@Body() request: StartFetchingRequest) {
        this.logger.log(`Received request to start data fetching: ${request}`);
        await this.appService.startFetchingData(request.intervalInMinutes);
        this.logger.log(
            `Successfully started data fetching with interval ${request.intervalInMinutes} minutes`
        );
        return 'Data fetching started.';
    }

    @Post('data-streams/stop-fetching')
    async stopFetching() {
        this.logger.log(`Received request to stop data fetching`);
        await this.appService.stopFetchingData();
        this.logger.log(`Successfully stopped data fetching`);
        return 'Data fetching stopped.';
    }

    @Get('data-streams/get-latest-data')
    getLatestData(): FetchedData | string {
        this.logger.log(`Received request to get latest data`);
        return this.appService.getLatestData();
    }

    @EventPattern('data-was-fetched')
    async handleDataWasFetched(data: FetchedData) {
        this.logger.log(`Received data-was-fetched event: ${JSON.stringify(data)}`);
        await this.appService.handleDataWasFetchedEvent(data);
        this.logger.log(`Successfully handled data-was-fetched event`);
    }
}
