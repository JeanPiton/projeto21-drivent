import { ticketsRepository } from '@/repositories';

async function getTicketType() {
  const result = await ticketsRepository.getTicketType();

  return result;
}

export const ticketsService = {
  getTicketType,
};
