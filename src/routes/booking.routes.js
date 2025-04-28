import { Router } from "express";
import {createBooking, deleteBooking, getAllBookings,getBookingById, updateBookingStatus } from "../controllers/booking.controller.js"
import userAuth from "../middlewares/userAuth.middleware.js";
const bookinRouter = Router();

bookinRouter.route("/create-booking/:id").post(userAuth,createBooking);

bookinRouter.route("/get-bookings").get(getAllBookings);
// bookinRouter.route("/get-bookings-user").get(getBookingsByUserId);

// bookinRouter.route("/get-bookings-user").get(getBookingsBymechanicId);
bookinRouter.route("/get-onebooking").get(getBookingById)

bookinRouter.route("/update-booking").post(updateBookingStatus);

bookinRouter.route("/delete-booking").delete(deleteBooking);

export default bookinRouter;