import 'dotenv/config';
import 'reflect-metadata';
import Container from 'typedi';

import { AppService } from './service/app.service';

const appService = Container.get(AppService);

appService.bootstrap();
