import User from "../models/user.js";
import Movie from "../models/movie.js";
import checkAuth from "../middleware/checkAuth.js";
import express from "express";
const router = express.Router();

/**
 * Get user's lists (wishlist, bookmarks, ongoing, completed)
 * @route GET /api/users/me/lists
 * @returns {object} User's movie lists
 */
router.get("/me/lists", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("wishlist")
      .populate("bookmarks")
      .populate("ongoingMovies")
      .populate("completedMovies");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      wishlist: user.wishlist,
      bookmarks: user.bookmarks,
      ongoingMovies: user.ongoingMovies,
      completedMovies: user.completedMovies,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add movie to user's wishlist
 * @route POST /api/users/me/wishlist/:movieId
 */
router.post("/me/wishlist/:movieId", checkAuth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user.wishlist.includes(movieId)) {
      user.wishlist.push(movieId);
      await user.save();
    }

    res.status(200).json({ message: "Movie added to wishlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Remove movie from user's wishlist
 * @route DELETE /api/users/me/wishlist/:movieId
 */
router.delete("/me/wishlist/:movieId", checkAuth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== movieId);
    await user.save();

    res.status(200).json({ message: "Movie removed from wishlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add movie to user's bookmarks
 * @route POST /api/users/me/bookmarks/:movieId
 */
router.post("/me/bookmarks/:movieId", checkAuth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user.bookmarks.includes(movieId)) {
      user.bookmarks.push(movieId);
      await user.save();
    }

    res.status(200).json({ message: "Movie bookmarked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Remove movie from user's bookmarks
 * @route DELETE /api/users/me/bookmarks/:movieId
 */
router.delete("/me/bookmarks/:movieId", checkAuth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user.id);
    user.bookmarks = user.bookmarks.filter(id => id.toString() !== movieId);
    await user.save();

    res.status(200).json({ message: "Movie removed from bookmarks" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add movie to user's ongoing list
 * @route POST /api/users/me/ongoing/:movieId
 */
router.post("/me/ongoing/:movieId", checkAuth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user.ongoingMovies.includes(movieId)) {
      user.ongoingMovies.push(movieId);
      // Remove from completed if it exists there
      user.completedMovies = user.completedMovies.filter(id => id.toString() !== movieId);
      await user.save();
    }

    res.status(200).json({ message: "Movie added to ongoing list" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add movie to user's completed list
 * @route POST /api/users/me/completed/:movieId
 */
router.post("/me/completed/:movieId", checkAuth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user.completedMovies.includes(movieId)) {
      user.completedMovies.push(movieId);
      // Remove from ongoing if it exists there
      user.ongoingMovies = user.ongoingMovies.filter(id => id.toString() !== movieId);
      await user.save();
    }

    res.status(200).json({ message: "Movie marked as completed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Remove movie from ongoing list
 * @route DELETE /api/users/me/ongoing/:movieId
 */
router.delete("/me/ongoing/:movieId", checkAuth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user.id);
    user.ongoingMovies = user.ongoingMovies.filter(id => id.toString() !== movieId);
    await user.save();

    res.status(200).json({ message: "Movie removed from ongoing list" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Remove movie from completed list
 * @route DELETE /api/users/me/completed/:movieId
 */
router.delete("/me/completed/:movieId", checkAuth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user.id);
    user.completedMovies = user.completedMovies.filter(id => id.toString() !== movieId);
    await user.save();

    res.status(200).json({ message: "Movie removed from completed list" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update a user by their ID.
 * @route PATCH /api/users/:userId
 * @param {string} userId - The ID of the user to update.
 * @returns {object} A success message and the updated user object.
 * @throws {Error} If the user is not found, an error occurs while updating them, or validation fails.
 */
router.patch("/:userId", async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: true }
    );
    res.status(200).json({ msg: "User updated successfully", updateUser });
  } catch (err) {
    res.status(500).json({ err: `Something went wrong: ${err}` });
  }
});

/**
 * Delete a user by their ID.
 * @route DELETE /api/users/:userId
 * @param {string} userId - The ID of the user to delete.
 * @returns {object} A success message and the deleted user object.
 * @throws {Error} If the user is not found or an error occurs while deleting them.
 */
router.delete("/:userId", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ msg: "User deleted successfully", deleteUser });
  } catch (err) {
    res.status(500).json({ err: `Something went wrong: ${err}` });
  }
});

export default router;
