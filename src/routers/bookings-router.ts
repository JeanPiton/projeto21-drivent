import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { createBooking, getBooking } from "@/controllers";
import { bookingSchema } from "@/schemas";

const bookingsRouter = Router();

bookingsRouter
    .all("/*",authenticateToken)
    .get("/",getBooking)
    .post("/",validateBody(bookingSchema),createBooking)

export {bookingsRouter}