import app, { init } from "@/app"
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createHotel, createTicket, createTicketType, createUser } from "../factories";
import * as jwt from 'jsonwebtoken';

beforeAll(async ()=>{
    await init();
});

beforeEach(async ()=>{
    await cleanDb()
})

const server = supertest(app)

describe('GET /hotels',()=>{
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid',()=>{
        it('should respond with status code 404 if user has no enrollment',async ()=>{
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress()
            const type = await createTicketType(true,false)
            await createTicket(enrollment.id,type.id,"PAID")
            await createHotel()

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND)
        });

        it('should respond with status code 404 if user has no ticket',async ()=>{
            const user = await createUser()
            const token =  await generateValidToken(user)
            await createEnrollmentWithAddress(user)
            await createHotel()

            const response = await server.get('/hotels').set('Authorization',`Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND)
        });

        it('should respond with status code 404 if there is no hotels',async ()=>{
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const type = await createTicketType(false,true)
            await createTicket(enrollment.id,type.id,"PAID")

            const response = await server.get('/hotels').set('Authorization',`Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND)
        });

        it('should respond with status code 402 if ticket not paid',async ()=>{
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const type = await createTicketType(false,true)
            await createTicket(enrollment.id,type.id,"RESERVED")
            await createHotel()

            const response = await server.get('/hotels').set('Authorization',`Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED)
        });

        it('should respond with status code 402 if ticket is remote',async ()=>{
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const type = await createTicketType(true)
            await createTicket(enrollment.id,type.id,"PAID")
            await createHotel()

            const response = await server.get('/hotels').set('Authorization',`Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED)
        });

        it('should respond with status code 402 if ticket does not include hotel',async ()=>{
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const type = await createTicketType(false,false)
            await createTicket(enrollment.id,type.id,"PAID")
            await createHotel()

            const response = await server.get('/hotels').set('Authorization',`Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED)
        });

        it('should respond with status code 200 and with existing hotels',async ()=>{
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const type = await createTicketType(false,true)
            await createTicket(enrollment.id,type.id,"PAID")
            await createHotel()
            await createHotel()

            const response = await server.get('/hotels').set('Authorization',`Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK)
            expect(response.body).toHaveLength(2)
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id:expect.any(Number),
                    name:expect.any(String),
                    image:expect.any(String),
                    createdAt:expect.any(String),
                    updatedAt:expect.any(String)
                })
            ]))
        });
    })
})