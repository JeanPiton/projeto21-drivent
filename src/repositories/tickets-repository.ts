import { prisma } from '@/config';

async function getTicketType() {
  return prisma.ticketType.findMany();
}

async function getTicket(id: number) {
  return prisma.ticket.findUnique({
    where: {
      enrollmentId: id,
    },
    include: { TicketType: true },
  });
}

export const ticketsRepository = {
  getTicketType,
  getTicket,
};
