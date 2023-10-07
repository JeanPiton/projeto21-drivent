import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { changeBooking, createBooking, getBooking } from "@/controllers";
import { bookingSchema } from "@/schemas";

const bookingsRouter = Router();

bookingsRouter
    .all("/*",authenticateToken)
    .get("/",getBooking)
    .post("/",validateBody(bookingSchema),createBooking)
    .put("/:bookingId",validateBody(bookingSchema),changeBooking)

export {bookingsRouter}