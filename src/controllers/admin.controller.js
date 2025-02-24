import User from "../models/User.js";
import Mechanic from "../models/Mechanic.js";
import Booking from "../models/Booking.js";
import Rating from "../models/Rating.js";

//  Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password for security
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Delete a user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Get all mechanics
export const getAllMechanics = async (req, res) => {
    try {
        const mechanics = await Mechanic.find();
        res.status(200).json({ success: true, mechanics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Approve a mechanic
export const approveMechanic = async (req, res) => {
    try {
        const { mechanicId } = req.params;
        const mechanic = await Mechanic.findById(mechanicId);
        if (!mechanic) return res.status(404).json({ success: false, message: "Mechanic not found" });

        mechanic.status = "approved";
        await mechanic.save();

        res.status(200).json({ success: true, message: "Mechanic approved successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Reject a mechanic
export const rejectMechanic = async (req, res) => {
    try {
        const { mechanicId } = req.params;
        await Mechanic.findByIdAndDelete(mechanicId);
        res.status(200).json({ success: true, message: "Mechanic rejected and removed!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("userId mechanicId");
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        booking.status = status;
        await booking.save();

        res.status(200).json({ success: true, message: "Booking status updated successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Rating.find().populate("userId mechanicId");
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  Delete a review
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        await Rating.findByIdAndDelete(reviewId);
        res.status(200).json({ success: true, message: "Review deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
