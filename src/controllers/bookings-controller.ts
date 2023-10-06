import { AuthenticatedRequest } from '@/middlewares';
import { bookingsService } from '@/services';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function createBooking(req:AuthenticatedRequest,res:Response) {
    const {userId} = req
    const {roomId} = req.body

    const bookingId = await bookingsService.createBooking(userId,roomId)
    res.status(httpStatus.OK).send(bookingId)
}