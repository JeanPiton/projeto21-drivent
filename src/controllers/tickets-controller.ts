import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ticketsService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketType(req: Request, res: Response) {
  const result = await ticketsService.getTicketType();

  return res.status(httpStatus.OK).send(result);
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await ticketsService.getTicket(userId);

  return res.status(httpStatus.OK).send(result);
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;
  const result = await ticketsService.postTicket(userId, ticketTypeId);

  return res.status(httpStatus.CREATED).send(result);
}
