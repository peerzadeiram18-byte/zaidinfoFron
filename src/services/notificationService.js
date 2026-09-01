// import axios from "axios";

// // ======================================================
// // API URL
// // ======================================================

// const API_URL =
//   `${import.meta.env.VITE_API_URL}/notifications`;


// // ======================================================
// // AUTH HEADER
// // ======================================================

// const getAuthHeaders = () => {

//   const token =
//     localStorage.getItem("token");

//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

// };


// // ======================================================
// // GET MY NOTIFICATIONS
// // ======================================================

// export const getMyNotifications = async () => {

//   const response =
//     await axios.get(
//       API_URL,
//       getAuthHeaders()
//     );

//   return response.data;

// };


// // ======================================================
// // MARK ONE NOTIFICATION AS READ
// // ======================================================

// export const markNotificationAsRead = async (
//   notificationId
// ) => {

//   const response =
//     await axios.patch(

//       `${API_URL}/${notificationId}/read`,

//       {},

//       getAuthHeaders()

//     );

//   return response.data;

// };


// // ======================================================
// // MARK ALL NOTIFICATIONS AS READ
// // ======================================================

// export const markAllNotificationsAsRead =
//   async () => {

//     const response =
//       await axios.patch(

//         `${API_URL}/read-all`,

//         {},

//         getAuthHeaders()

//       );

//     return response.data;

//   };


// // ======================================================
// // DELETE NOTIFICATION
// // ======================================================

// export const deleteNotification = async (
//   notificationId
// ) => {

//   const response =
//     await axios.delete(

//       `${API_URL}/${notificationId}`,

//       getAuthHeaders()

//     );

//   return response.data;

// };


import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL}/notifications`;

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getMyNotifications = async () => {
  const response = await axios.get(
    API_URL,
    getAuthConfig()
  );

  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/read`,
    {},
    getAuthConfig()
  );

  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axios.patch(
    `${API_URL}/read-all`,
    {},
    getAuthConfig()
  );

  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthConfig()
  );

  return response.data;
};