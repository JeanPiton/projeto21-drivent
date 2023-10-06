import faker from "@faker-js/faker";
import { bookingsService } from "@/services";
import { bookingsRepository, enrollmentRepository, ticketsRepository } from "@/repositories";
import { TicketStatus } from "@prisma/client";

describe("createBooking",()=>{
    it("Should return with the booking id",async ()=>{
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementation(():any=>{return{id:faker.datatype.number()}})
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementation(():any=>{
            return {
                status:TicketStatus.PAID,
                TicketType:{
                    isRemote:false,
                    includesHotel:true  
                }
            }
        })
        jest.spyOn(bookingsRepository,"getRoomById").mockImplementation(():any=>{
            return {
                capacity:2
            }
        })
        jest.spyOn(bookingsRepository,"getReservationsByRoomId").mockImplementation(():any=>{
            return 1
        })
        jest.spyOn(bookingsRepository,"createBooking").mockImplementation(():any=>{
            return {id:faker.datatype.number()}
        })
        const userId = faker.datatype.number(), roomId = faker.datatype.number()
        const result = await bookingsService.createBooking(userId,roomId)
        expect(result).toEqual({bookingId:expect.any(Number)})
    })

    it("should return forbidden Error when no enrollment",async ()=>{
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any=>{return undefined})
        const userId = faker.datatype.number(), roomId = faker.datatype.number()
        const result = bookingsService.createBooking(userId,roomId)
        expect(result).rejects.toEqual({name:"ForbiddenError",message:"Enrollment is Invalid or Unavailable"})
    })

    it("should return forbidden Error when no ticket",()=>{
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementation(():any=>{return{id:faker.datatype.number()}})
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any=>{return undefined})
        const userId = faker.datatype.number(), roomId = faker.datatype.number()
        const result = bookingsService.createBooking(userId,roomId)
        expect(result).rejects.toEqual({name:"ForbiddenError",message:"Ticket is Invalid or Unavailable"})
    })

    it("should return forbidden Error when ticket status is reserved",()=>{
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementation(():any=>{return{id:faker.datatype.number()}})
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementation(():any=>{
            return {
                status:TicketStatus.RESERVED,
                TicketType:{
                    isRemote:false,
                    includesHotel:true  
                }
            }
        })
        const userId = faker.datatype.number(), roomId = faker.datatype.number()
        const result = bookingsService.createBooking(userId,roomId)
        expect(result).rejects.toEqual({name:"ForbiddenError",message:"Ticket status is Invalid or Unavailable"})
    })

    it("should return forbidden Error when ticket is remote",()=>{
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementation(():any=>{return{id:faker.datatype.number()}})
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementation(():any=>{
            return {
                status:TicketStatus.PAID,
                TicketType:{
                    isRemote:true,
                    includesHotel:true  
                }
            }
        })
        const userId = faker.datatype.number(), roomId = faker.datatype.number()
        const result = bookingsService.createBooking(userId,roomId)
        expect(result).rejects.toEqual({name:"ForbiddenError",message:"Ticket being remote is Invalid or Unavailable"})
    })

    it("should return forbidden Error when ticket does not includes hotel",()=>{
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementation(():any=>{return{id:faker.datatype.number()}})
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementation(():any=>{
            return {
                status:TicketStatus.PAID,
                TicketType:{
                    isRemote:false,
                    includesHotel:false  
                }
            }
        })
        const userId = faker.datatype.number(), roomId = faker.datatype.number()
        const result = bookingsService.createBooking(userId,roomId)
        expect(result).rejects.toEqual({name:"ForbiddenError",message:"Ticket not including hotel is Invalid or Unavailable"})
    })

    it("should return not found Error when room not exist",()=>{
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementation(():any=>{return{id:faker.datatype.number()}})
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementation(():any=>{
            return {
                status:TicketStatus.PAID,
                TicketType:{
                    isRemote:false,
                    includesHotel:true  
                }
            }
        })
        jest.spyOn(bookingsRepository,"getRoomById").mockImplementation(():any=>{
            return undefined
        })
        const userId = faker.datatype.number(), roomId = faker.datatype.number()
        const result = bookingsService.createBooking(userId,roomId)
        expect(result).rejects.toEqual({name: 'NotFoundError',message: 'No result for this search!'})
    })

    it("should return forbidden Error when room is full",()=>{
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementation(():any=>{return{id:faker.datatype.number()}})
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementation(():any=>{
            return {
                status:TicketStatus.PAID,
                TicketType:{
                    isRemote:false,
                    includesHotel:true  
                }
            }
        })
        jest.spyOn(bookingsRepository,"getRoomById").mockImplementation(():any=>{
            return {capacity:4}
        })
        jest.spyOn(bookingsRepository,"getReservationsByRoomId").mockImplementation(():any=>{
            return 4
        })
        const userId = faker.datatype.number(), roomId = faker.datatype.number()
        const result = bookingsService.createBooking(userId,roomId)
        expect(result).rejects.toEqual({name: 'ForbiddenError',message: 'This room is Invalid or Unavailable'})
    })
})