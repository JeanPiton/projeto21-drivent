import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { createBooking } from "@/controllers";
import { bookingSchema } from "@/schemas";

const bookingsRouter = Router();

bookingsRouter
    .all("/*",authenticateToken)
    .post("/",validateBody(bookingSchema),createBooking)

export {bookingsRouter}