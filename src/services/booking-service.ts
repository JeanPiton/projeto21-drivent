import { forbiddenError, notFoundError } from "@/errors";
import { bookingsRepository, enrollmentRepository, ticketsRepository } from "@/repositories";
import { TicketStatus } from "@prisma/client";

async function getBooking(userId:number) {
    const booking = await bookingsRepository.getBooking(userId);
    if(!booking) throw notFoundError();
    return booking
}

async function createBooking(userId:number,roomId:number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw forbiddenError("Enrollment");

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw forbiddenError("Ticket");

    const type = ticket.TicketType;

    if(ticket.status === TicketStatus.RESERVED) throw forbiddenError("Ticket status")

    if(type.isRemote) throw forbiddenError("Ticket being remote")

    if(!type.includesHotel) throw forbiddenError("Ticket not including hotel")

    const room = await bookingsRepository.getRoomById(roomId)
    if(!room) throw notFoundError()
    const reservedInRoom = await bookingsRepository.getReservationsByRoomId(roomId)
    if(reservedInRoom === room.capacity) throw forbiddenError("This room")
    const booking = await bookingsRepository.createBooking(userId,roomId)
    return {bookingId:booking.id}
}

async function changeBooking(userId:number,roomId:number,bookingId:number){
    const booking = await bookingsRepository.getBooking(userId,bookingId)
    if(!booking) throw forbiddenError("User booking")
    const room = await bookingsRepository.getRoomById(roomId)
    if(!room) throw notFoundError()
    const reservedInRoom = await bookingsRepository.getReservationsByRoomId(roomId)
    if(room.capacity === reservedInRoom) throw forbiddenError("This room")
    const newBooking = await bookingsRepository.changeBooking(userId,roomId)
    return {bookingId:newBooking.id}
}

export const bookingsService = {
    createBooking,
    getBooking,
    changeBooking,
}