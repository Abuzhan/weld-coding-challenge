import {AppModule} from './app.module';
import {INestApplication} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';

const initializeMicroservice = async (app: INestApplication) => {
    await app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.NATS,
        options: {
            servers: ['nats://localhost:4222']
        }
    });
    await app.startAllMicroservices();
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await initializeMicroservice(app);
    await app.listen(3000);
}

bootstrap().then(() => console.log('Data streams microservice started.'));
