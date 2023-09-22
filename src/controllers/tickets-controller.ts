import { Request, Response } from 'express';
import { ticketsService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketType(req: Request, res: Response) {
  const result = await ticketsService.getTicketType();

  return res.status(200).send(result);
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await ticketsService.getTicket(userId);

  return res.status(200).send(result);
}
