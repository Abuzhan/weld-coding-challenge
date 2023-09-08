import {Module} from '@nestjs/common';
import {WorkerController} from './worker.controller';
import {WorkerService} from './worker.service';
import {ClientsModule, Transport} from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'DATA_STREAMS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: ['nats://localhost:4222']
                }
            }
        ])
    ],
    controllers: [WorkerController],
    providers: [WorkerService]
})
export class WorkerModule {}
