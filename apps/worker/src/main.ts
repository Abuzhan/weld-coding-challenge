import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {NestFactory} from '@nestjs/core';
import {WorkerModule} from './worker.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(WorkerModule, {
        transport: Transport.NATS,
        options: {
            servers: ['nats://localhost:4222']
        }
    });
    await app.listen();
}
bootstrap().then(() => console.log('Worker microservice started.'));
