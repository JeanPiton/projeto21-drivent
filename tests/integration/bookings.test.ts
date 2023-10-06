import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { createBooking, createEnrollmentWithAddress, createHotel, createPayment, createRoomWithHotelId, createTicket, createTicketType, createUser } from '../factories';
import { TicketStatus } from '@prisma/client';

beforeAll(async () => {
    await init();
});
  
beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("GET /booking",()=>{
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    describe("when token is valid",()=>{
        it('should respond with status 404 if user dont have booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);
      
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and booking info', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);
            await createBooking(createdRoom.id,user.id)
      
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                id:expect.any(Number),
                Room:{
                    id:createdRoom.id,
                    name:expect.any(String),
                    capacity:expect.any(Number),
                    hotelId:createdHotel.id,
                    createdAt:expect.any(String),
                    updatedAt:expect.any(String)
                }
            })
        });
    })
})

describe("POST /booking",()=>{
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    describe("when token is valid",()=>{
        it('should respond with status 400 if body param roomId is missing', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({});
      
            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 403 if user dont have enrollment', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId:createdRoom.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 if user dont have ticket', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId:createdRoom.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 if ticket is not paid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId:createdRoom.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 if ticket is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(true, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
            await createPayment(ticket.id,ticketType.price);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId:createdRoom.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 if ticket dont include hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, false);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
            await createPayment(ticket.id,ticketType.price);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId:createdRoom.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 if room dont exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, false);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
            await createPayment(ticket.id,ticketType.price);

            const createdHotel = await createHotel();
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId:0});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 when room is full', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);
            await createBooking(createdRoom.id)
            await createBooking(createdRoom.id)
            await createBooking(createdRoom.id)
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId:createdRoom.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 200 and bookingId', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId:createdRoom.id});
      
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({bookingId:expect.any(Number)})
        });
    })
})