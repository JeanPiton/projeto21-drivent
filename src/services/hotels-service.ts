import { enrollmentNotFoundError, notFoundError, paymentRequiredError } from "@/errors";
import { enrollmentRepository, hotelsRepository, ticketsRepository } from "@/repositories";

async function getHotels(userId:number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment) throw notFoundError();
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if(!ticket) throw notFoundError();
    if(ticket.status!="PAID"||ticket.TicketType.isRemote==true||ticket.TicketType.includesHotel==false) throw paymentRequiredError()
    const hotels = await hotelsRepository.getAllHotels()
    if(hotels.length==0) throw notFoundError()
    return hotels
}

export const hotelsServices = {
    getHotels
}