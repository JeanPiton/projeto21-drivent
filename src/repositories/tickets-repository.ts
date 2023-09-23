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

async function postTicket(userId: number, typeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId: typeId,
      enrollmentId: enrollmentId,
    },
    include: { TicketType: true },
  });
}

export const ticketsRepository = {
  getTicketType,
  getTicket,
  postTicket,
};
