import { invalidDataError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import { hotelsServices } from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req:AuthenticatedRequest,res:Response) {
    const {userId} = req;
    const hotels = await hotelsServices.getHotels(userId)
    res.status(httpStatus.OK).send(hotels) 
}

export async function getHotelById(req:AuthenticatedRequest,res:Response) {
    const {userId} = req
    const {hotelId} = req.params
    if(typeof parseInt(hotelId) !== "number") throw invalidDataError("hotelId param")
    const hotel = await hotelsServices.getHotelById(parseInt(hotelId),userId)
    res.status(httpStatus.OK).send(hotel)
}