import { Router } from 'express';
import { getTicket, getTicketType } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getTicketType)
    .get('/', getTicket);

export { ticketsRouter };
