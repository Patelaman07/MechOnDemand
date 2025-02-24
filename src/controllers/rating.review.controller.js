import { Rating } from "../models/rating.model.js";

import { Mechanic } from "../models/mech.model.js"

// Add Rating and Review
export const addRating = async (req, res) => {
    const { userId, mechanicId, bookingId, rating, review } = req.body;

    if (!userId || !mechanicId || !bookingId || !rating || !review) {
        return res.status(400).json({ success: false, message: "Missing Details" })
    }

    try {
        const mechanic = await Mechanic.findById(mechanicId);

        if (!mechanic) return res.status(404).json({ message: "Mechanic not found" });

        const existingRating = await Rating.findOne({ userId, mechanicId, bookingId });
        if (existingRating) {
            return res.status(400).json({ message: "You have already rated this booking!" });
        }

        const newRating = new Rating({ userId, mechanicId, bookingId, rating, review });
        await newRating.save();

        // Ensure reviews array exists before pushing
        mechanic.reviews = mechanic.reviews || [];
        mechanic.reviews.push(newRating);
        await mechanic.save();


        res.status(201).json({ message: "Rating submitted successfully!", newRating });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Get all Ratings and Review for a Mechanic

export const getAllRating = async (req, res) => {
    try {
        const { mechanicId } = req.params;
        const rattings = await Rating.find(mechanicId).populate("userId", "name email");
        if (!rattings.length) {
            return res.status(404).json({ message: "No ratings found for this mechanic!" });
        }
        return res.status(200).json(rattings);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}

// Get avarage Rating for a mechanic
export const getMechanicAverageRating = async (req, res) => {
    try {
        const { mechanicId } = req.params;

        const ratings = await Rating.find({ mechanicId });

        if (!ratings.length) {
            return res.status(200).json({ averageRating: 0, totalReviews: 0 });
        }

        const totalRating = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        const averageRating = totalRating / ratings.length;

        const mechanic = await Mechanic.findById(mechanicId);
        if(!mechanic) return res.status(400).json({success:false,message:"Mechanic not found of this id"});

        mechanic.avarageRating = averageRating.toFixed(1);

        return res.status(200).json({ averageRating: averageRating.toFixed(1), totalReviews: ratings.length });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//  Update a Rating & Review
export const updateRating = async (req, res) => {
    const { rating, review } = req.body;

    if (!rating || !review) {
        return res.status(400).json({ success: false, message: "Missing Details" })
    }
    try {

        const { id } = req.params;

        const updatedRating = await Rating.findByIdAndUpdate(id, { rating, review }, { new: true });
        if (!updatedRating) {
            return res.status(404).json({ message: "Rating not found!" });
        }

        return res.status(200).json({ message: "Rating updated successfully!", updatedRating });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a Rating
export const deleteRating = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRating = await Rating.findByIdAndDelete(id);
        if (!deletedRating) {
            return res.status(404).json({ success: false, message: "Rating not found!" });
        }

        return res.status(200).json({ success: true, message: "Rating deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};