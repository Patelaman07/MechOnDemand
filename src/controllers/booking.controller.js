import { Booking } from "../models/booking.model.js";
import { User } from "../models/user.model.js";
import { Mechanic } from "../models/mech.model.js"


export const createBooking = async (req, res) => {

    const mechanicId = req.params.id;
    const { userId, category, scheduledTime,deviceDetails } = req.body;
  


    if (!userId || !mechanicId || !category || !scheduledTime || !deviceDetails) {
        return res.status(400).json({ success: false, message: "Missing Details" })
    }
    try {

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if mechanic exists
        const mechanic = await Mechanic.findById(mechanicId);
        if (!mechanic) return res.status(404).json({ message: "Mechanic not found" });

        // Create new booking
        const newBooking = new Booking({userId,mechanicId,category,scheduledTime,deviceDetails});

        await newBooking.save();

        // user.userBookingHistory = userBookingHistory || [];
        user.userBookingHistory.push(newBooking);

        await user.save();

        return res.status(201).json({
            success: true,
            message: "Booking is created successfully"
        })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }

};

// get all bookings for admin
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("userId mechanicId");

        return res.status(200).json({ success: true, message: "Get allbookings successfully", bookings });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

};

//Get all booking for a user
// export const getBookingsByUserId = async (req, res) => {
//     const {userId} = req.params;
//     if(!userId){
//         return res.status(400).json({success:false,message:"Missing Details"})
//     }
//     try {

//         const bookings = await Booking.find({userId}).populate("mechanicId");

//         if (!bookings) return res.status(404).json({ success: false, message: "Booking not found for this userId" });


//         return res.status(200).json({ success: true, message: "Booking get successfully", bookings });

//     } catch (error) {

//         return res.status(500).json({ success: false, message: error.message });
//     }
// };
//Get all booking for a Mechanic
// export const getBookingsBymechanicId = async (req, res) => {
//     const {mechanicId} = req.params;

//     if(!mechanicId){
//         return res.status(400).json({success:false,message:"Missing Details"})
//     }
//     try {

//         const bookings = await Booking.find({mechanicId}).populate("userId");

//         if (!bookings) return res.status(404).json({ success: false, message: "Booking not found for this mechanic" });


//         return res.status(200).json({ success: true, message: "Bookings get successfully", bookings });

//     } catch (error) {

//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// Get Booking by ID
export const getBookingById = async (req, res) => {
    const { bookingId } = req.params;
    if (!bookingId) {
        return res.status(400).json({ success: false, message: "Missing Details" })
    }
    try {
        const booking = await Booking.findById(bookingId).populate("userId mechanicId");

        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        return res.status(200).json({ success: true, message: "Booking get successfully", booking });
    } catch (error) {

        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update the booking details

export const updateBookingStatus = async (req, res) => {

    const { status, paymentStatus, completedTime } = req.body;

    if (!status || !paymentStatus) {
        return res.status(400).json({ success: false, message: "Missing Details" })
    }


    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);

        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        booking.status = status;

        booking.paymentStatus = paymentStatus;

        if (status === "completed") booking.completedTime = completedTime || new Date();

        await booking.save();

        res.status(200).json({ success: true, message: "Booking updated successfully", booking });

    } catch (error) {

        res.status(500).json({ success: false, message: error.message });
    }
};

// Delet the Booking

export const deleteBooking = async (req, res) => {

    const { bookingId } = req.params;
    if (!bookingId) {
        return res.status(400).json({ success: false, message: "Missing Details" })
    }

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        await booking.deleteOne();

        res.status(200).json({ success: true, message: "Booking deleted successfully" });

    } catch (error) {

        res.status(500).json({ success: false, message: error.message });
    }
};