import { notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';

async function getTicketType() {
  const result = await ticketsRepository.getTicketType();

  return result;
}

async function getTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (enrollment === null) throw notFoundError();
  const result = await ticketsRepository.getTicket(enrollment.id);
  if (result == null) throw notFoundError();
  return result;
}

async function postTicket(userId: number, typeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (enrollment === null) throw notFoundError();
  const result = await ticketsRepository.postTicket(userId, typeId, enrollment.id);

  return result;
}

export const ticketsService = {
  getTicketType,
  getTicket,
  postTicket,
};
