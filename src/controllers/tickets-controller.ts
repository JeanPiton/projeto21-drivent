import { Request, Response } from 'express';
import { ticketsService } from '@/services';

export async function getTicketType(req: Request, res: Response) {
  const result = await ticketsService.getTicketType();

  return res.status(200).send(result);
}
