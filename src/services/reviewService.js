import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


// =======================================
// GET PRODUCT REVIEWS
// =======================================

export const getProductReviews = async (productId) => {

  return await axios.get(
    `${API_URL}/reviews/product/${productId}`
  );

};


// =======================================
// GET PRODUCT RATING SUMMARY
// =======================================

export const getProductRatingSummary = async (productId) => {

  return await axios.get(
    `${API_URL}/reviews/product/${productId}/summary`
  );

};


// =======================================
// CREATE REVIEW
// =======================================

export const createReview = async (reviewData) => {

  const token =
    localStorage.getItem("token");

  return await axios.post(

    `${API_URL}/reviews`,

    reviewData,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  );

};


// =======================================
// GET MY REVIEWS
// =======================================

export const getMyReviews = async () => {

  const token =
    localStorage.getItem("token");

  return await axios.get(

    `${API_URL}/reviews/my`,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  );

};


// =======================================
// UPDATE REVIEW
// =======================================

export const updateReview = async (
  reviewId,
  reviewData
) => {

  const token =
    localStorage.getItem("token");

  return await axios.put(

    `${API_URL}/reviews/${reviewId}`,

    reviewData,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  );

};


// =======================================
// DELETE REVIEW
// =======================================

export const deleteReview = async (
  reviewId
) => {

  const token =
    localStorage.getItem("token");

  return await axios.delete(

    `${API_URL}/reviews/${reviewId}`,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  );

};


// =======================================
// ADMIN - GET ALL REVIEWS
// =======================================

export const getAllReviews = async () => {

  const token =
    localStorage.getItem("token");

  return await axios.get(

    `${API_URL}/reviews/admin/all`,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  );

};


// =======================================
// ADMIN - GET REVIEW BY ID
// =======================================

export const getReviewById = async (
  reviewId
) => {

  const token =
    localStorage.getItem("token");

  return await axios.get(

    `${API_URL}/reviews/admin/${reviewId}`,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  );

};


// =======================================
// ADMIN - APPROVE REVIEW
// =======================================

export const approveReview = async (
  reviewId
) => {

  const token =
    localStorage.getItem("token");

  return await axios.patch(

    `${API_URL}/reviews/admin/${reviewId}/approve`,

    {},

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  );

};


// =======================================
// ADMIN - REJECT REVIEW
// =======================================

export const rejectReview = async (
  reviewId
) => {

  const token =
    localStorage.getItem("token");

  return await axios.patch(

    `${API_URL}/reviews/admin/${reviewId}/reject`,

    {},

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  );

};