import { Router } from "express";
import {creatBooking, deleteBooking, getAllBookings, getBookingById, updateBookingStatus } from "../controllers/booking.controller.js"

const bookinRouter = Router();

bookinRouter.route("/create-booking").post(creatBooking);

bookinRouter.route("/get-bookings").get(getAllBookings);

bookinRouter.route("/get-onebooking").get(getBookingById)

bookinRouter.route("/update-booking").post(updateBookingStatus);

bookinRouter.route("/delete-booking").delete(deleteBooking);

export default bookinRouter;