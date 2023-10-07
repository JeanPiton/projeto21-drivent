import { AuthenticatedRequest } from '@/middlewares';
import { bookingsService } from '@/services';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getBooking(req:AuthenticatedRequest,res:Response) {
    const {userId} = req

    const booking = await bookingsService.getBooking(userId)
    res.status(httpStatus.OK).send(booking)
}

export async function createBooking(req:AuthenticatedRequest,res:Response) {
    const {userId} = req
    const {roomId} = req.body

    const bookingId = await bookingsService.createBooking(userId,roomId)
    res.status(httpStatus.OK).send(bookingId)
}

export async function changeBooking(req:AuthenticatedRequest,res:Response) {
    const {userId} = req
    const {roomId} = req.body
    const {bookingId} = req.params

    const newBookingId = await bookingsService.changeBooking(userId,roomId,parseInt(bookingId))
    res.status(httpStatus.OK).send(newBookingId)
}