import { prisma } from '@/config';

async function getTicketType() {
  return prisma.ticketType.findMany();
}

export const ticketsRepository = {
  getTicketType,
};
