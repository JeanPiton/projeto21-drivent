import { Router } from 'express';
import { getTicketType } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getTicketType);

export { ticketsRouter };
