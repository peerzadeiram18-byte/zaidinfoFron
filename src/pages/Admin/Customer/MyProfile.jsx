// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import "./MyProfile.css";

// // function MyProfile() {

// //     const token = localStorage.getItem("token");

// //     const [profile, setProfile] = useState({

// //     firstName: "",

// //     lastName: "",

// //     email: "",

// //     phone: "",

// //     gender: "",

// //     dob: "",

// //     address: "",

// //     city: "",

// //     state: "",

// //     pincode: "",

// //     role: "",

// //     status: "",

// //     profileImage: ""

// // });

// //     useEffect(() => {

// //         fetchProfile();

// //     }, []);

// //     // ==========================
// //     // GET PROFILE
// //     // ==========================

// //     const fetchProfile = async () => {

// //         try {

// //             const res = await axios.get(

// //                 "http://localhost:5000/api/users/profile",

// //                 {

// //                     headers: {

// //                         Authorization: `Bearer ${token}`

// //                     }

// //                 }

// //             );

// //             console.log(res.data);

// //             setProfile(res.data.data);

// //         }

// //         catch (error) {

// //             console.log(error);

// //         }

// //     };

// //     // ==========================
// //     // HANDLE CHANGE
// //     // ==========================

// //     const handleChange = (e) => {

// //         setProfile({

// //             ...profile,

// //             [e.target.name]: e.target.value

// //         });

// //     };

// //     // ==========================
// //     // UPDATE PROFILE
// //     // ==========================

// //     const saveProfile = async () => {

// //         try {

// //             const res = await axios.put(

// //                 "http://localhost:5000/api/users/profile",

// //                 profile,

// //                 {

// //                     headers: {

// //                         Authorization: `Bearer ${token}`

// //                     }

// //                 }

// //             );

// //             alert(res.data.message);

// //         }

// //         catch (error) {

// //             console.log(error);

// //             alert(

// //                 error.response?.data?.message ||

// //                 "Unable To Save"

// //             );

// //         }

// //     };

// //     return (

// //         <div className="profile-card">

// //             <h2>My Profile</h2>

// //             <input

// //                 type="text"

// //                 name="fullName"

// //                 placeholder="Full Name"

// //                 value={profile.fullName || ""}

// //                 onChange={handleChange}

// //             />

// //             <input

// //                 type="email"

// //                 name="email"

// //                 placeholder="Email"

// //                 value={profile.email || ""}

// //                 readOnly

// //             />

// //             <input

// //                 type="text"

// //                 name="phone"

// //                 placeholder="Phone"

// //                 value={profile.phone || ""}

// //                 readOnly

// //             />

// //             <select

// //                 name="gender"

// //                 value={profile.gender || ""}

// //                 onChange={handleChange}

// //             >

// //                 <option value="">Select Gender</option>

// //                 <option value="MALE">Male</option>

// //                 <option value="FEMALE">Female</option>

// //                 <option value="OTHER">Other</option>

// //             </select>

// //             <input

// //                 type="date"

// //                 name="dob"

// //                 value={profile.dob ? profile.dob.substring(0, 10) : ""}

// //                 onChange={handleChange}

// //             />

// //             <input

// //                 type="text"

// //                 name="address"

// //                 placeholder="Address"

// //                 value={profile.address || ""}

// //                 onChange={handleChange}

// //             />

// //             <input

// //                 type="text"

// //                 name="city"

// //                 placeholder="City"

// //                 value={profile.city || ""}

// //                 onChange={handleChange}

// //             />

// //             <input

// //                 type="text"

// //                 name="state"

// //                 placeholder="State"

// //                 value={profile.state || ""}

// //                 onChange={handleChange}

// //             />

// //             <input

// //                 type="text"

// //                 name="pincode"

// //                 placeholder="Pincode"

// //                 value={profile.pincode || ""}

// //                 onChange={handleChange}

// //             />

// //             <button onClick={saveProfile}>

// //                 Save Profile

// //             </button>

// //         </div>

// //     );

// // }

// // export default MyProfile;





// import { useEffect, useState } from "react";
// import axios from "axios";
// import "./MyProfile.css";
// import { toast } from "react-toastify";

// function MyProfile() {

//     const token = localStorage.getItem("token");

//     const [profile, setProfile] = useState({

//     firstName: "",

//     lastName: "",

//     email: "",

//     phone: "",

//     gender: "",

//     dob: "",

//     address: "",

//     city: "",

//     state: "",

//     pincode: "",

//     role: "",

//     status: "",

//     profileImage: ""

// });

//     useEffect(() => {

//         fetchProfile();

//     }, []);

//     // ==========================
//     // GET PROFILE
//     // ==========================

//     const fetchProfile = async () => {

//         try {

//             const res = 
//             // await axios.get(

//                 // "http://localhost:5000/api/users/profile",

//                 await axios.get(
//     `${API}/users/profile`,

//                 {

//                     headers: {

//                         Authorization: `Bearer ${token}`

//                     }

//                 }

//             );

//             console.log(res.data);

//             setProfile(res.data.data);

//         }

//         catch (error) {

//             console.log(error);

//         }

//     };

//     // ==========================
//     // HANDLE CHANGE
//     // ==========================

//     const handleChange = (e) => {

//         setProfile({

//             ...profile,

//             [e.target.name]: e.target.value

//         });

//     };

//     // ==========================
//     // UPDATE PROFILE
//     // ==========================

//     const saveProfile = async () => {

//         try {

//             const res =
            
//             // await axios.put(

//             //     "http://localhost:5000/api/users/profile",

//             await axios.put(
//     `${API}/users/profile`,
//                 profile,

//                 {

//                     headers: {

//                         Authorization: `Bearer ${token}`

//                     }

//                 }

//             );

//             toast.error(res.data.message);

//         }

//         catch (error) {

//             console.log(error);

//             toast.error(

//                 error.response?.data?.message ||

//                 "Unable To Save"

//             );

//         }

//     };

//     return (

//         <div className="profile-card">

//             <h2>My Profile</h2>

//             <input

//                 type="text"

//                 name="fullName"

//                 placeholder="Full Name"

//                 value={profile.fullName || ""}

//                 onChange={handleChange}

//             />

//             <input

//                 type="email"

//                 name="email"

//                 placeholder="Email"

//                 value={profile.email || ""}

//                 readOnly

//             />

//             <input

//                 type="text"

//                 name="phone"

//                 placeholder="Phone"

//                 value={profile.phone || ""}

//                 readOnly

//             />

//             <select

//                 name="gender"

//                 value={profile.gender || ""}

//                 onChange={handleChange}

//             >

//                 <option value="">Select Gender</option>

//                 <option value="MALE">Male</option>

//                 <option value="FEMALE">Female</option>

//                 <option value="OTHER">Other</option>

//             </select>

//             <input

//                 type="date"

//                 name="dob"

//                 value={profile.dob ? profile.dob.substring(0, 10) : ""}

//                 onChange={handleChange}

//             />

//             <input

//                 type="text"

//                 name="address"

//                 placeholder="Address"

//                 value={profile.address || ""}

//                 onChange={handleChange}

//             />

//             <input

//                 type="text"

//                 name="city"

//                 placeholder="City"

//                 value={profile.city || ""}

//                 onChange={handleChange}

//             />

//             <input

//                 type="text"

//                 name="state"

//                 placeholder="State"

//                 value={profile.state || ""}

//                 onChange={handleChange}

//             />

//             <input

//                 type="text"

//                 name="pincode"

//                 placeholder="Pincode"

//                 value={profile.pincode || ""}

//                 onChange={handleChange}

//             />

//             <button onClick={saveProfile}>

//                 Save Profile

//             </button>

//         </div>

//     );

// }

// export default MyProfile;


import { useEffect, useState } from "react";
import axios from "axios";
import "./MyProfile.css";
import { toast } from "react-toastify";

// ==========================================
// API URL
// ==========================================

const API = import.meta.env.VITE_API_URL;


// ==========================================
// MY PROFILE
// ==========================================

function MyProfile() {

    const token = localStorage.getItem("token");


    // ==========================================
    // PROFILE STATE
    // ==========================================

    const [profile, setProfile] = useState({

        firstName: "",
        lastName: "",
        fullName: "",

        email: "",
        phone: "",

        gender: "",
        dob: "",

        address: "",
        city: "",
        state: "",
        pincode: "",

        role: "",
        status: "",

        profileImage: ""

    });


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    // ==========================================
    // GET PROFILE ON PAGE LOAD
    // ==========================================

    useEffect(() => {

        fetchProfile();

    }, []);


    // ==========================================
    // GET PROFILE
    // ==========================================

    const fetchProfile = async () => {

        try {

            setLoading(true);


            if (!token) {

                toast.error("Please login first");

                return;

            }


            if (!API) {

                console.error(
                    "VITE_API_URL is not defined"
                );

                toast.error(
                    "API URL is not configured"
                );

                return;

            }


            console.log(
                "PROFILE API:",
                `${API}/users/profile`
            );


            const res = await axios.get(

                `${API}/users/profile`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );


            console.log(
                "PROFILE RESPONSE:",
                res.data
            );


            const profileData =
                res.data?.data ||
                res.data?.user ||
                res.data?.profile;


            if (!profileData) {

                toast.error(
                    "Profile data not found"
                );

                return;

            }


            setProfile({

                firstName:
                    profileData.firstName || "",

                lastName:
                    profileData.lastName || "",

                fullName:
                    profileData.fullName ||
                    profileData.name ||
                    "",

                email:
                    profileData.email || "",

                phone:
                    profileData.phone ||
                    profileData.mobile ||
                    "",

                gender:
                    profileData.gender || "",

                dob:
                    profileData.dob || "",

                address:
                    profileData.address || "",

                city:
                    profileData.city || "",

                state:
                    profileData.state || "",

                pincode:
                    profileData.pincode || "",

                role:
                    profileData.role || "",

                status:
                    profileData.status || "",

                profileImage:
                    profileData.profileImage ||
                    profileData.image ||
                    ""

            });

        }

        catch (error) {

            console.error(
                "FETCH PROFILE ERROR:",
                error
            );


            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );


            toast.error(

                error.response?.data?.message ||
                "Unable to load profile"

            );

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setProfile((prev) => ({

            ...prev,

            [name]: value

        }));

    };


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    const saveProfile = async () => {

        try {

            if (!token) {

                toast.error(
                    "Please login first"
                );

                return;

            }


            if (!API) {

                toast.error(
                    "API URL is not configured"
                );

                return;

            }


            setSaving(true);


            // ==========================================
            // UPDATE DATA
            // ==========================================

            const updateData = {

                firstName:
                    profile.firstName || "",

                lastName:
                    profile.lastName || "",

                fullName:
                    profile.fullName || "",

                gender:
                    profile.gender || "",

                dob:
                    profile.dob || "",

                address:
                    profile.address || "",

                city:
                    profile.city || "",

                state:
                    profile.state || "",

                pincode:
                    profile.pincode || ""

            };


            console.log(
                "UPDATE PROFILE DATA:",
                updateData
            );


            const res = await axios.put(

                `${API}/users/profile`,

                updateData,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"

                    }

                }

            );


            console.log(
                "UPDATE PROFILE RESPONSE:",
                res.data
            );


            toast.success(

                res.data?.message ||
                "Profile updated successfully"

            );


            // ==========================================
            // REFRESH PROFILE
            // ==========================================

            await fetchProfile();

        }

        catch (error) {

            console.error(
                "UPDATE PROFILE ERROR:",
                error
            );


            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );


            const message =
                error.response?.data?.message ||
                "Unable to save profile";


            toast.error(message);

        }

        finally {

            setSaving(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="profile-card">

                <h2>
                    My Profile
                </h2>

                <p>
                    Loading profile...
                </p>

            </div>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="profile-card">

            <h2>
                My Profile
            </h2>


            {/* ==================================
                FULL NAME
            ================================== */}

            <input

                type="text"

                name="fullName"

                placeholder="Full Name"

                value={
                    profile.fullName || ""
                }

                onChange={handleChange}

            />


            {/* ==================================
                EMAIL
            ================================== */}

            <input

                type="email"

                name="email"

                placeholder="Email"

                value={
                    profile.email || ""
                }

                readOnly

            />


            {/* ==================================
                PHONE
            ================================== */}

            <input

                type="text"

                name="phone"

                placeholder="Phone"

                value={
                    profile.phone || ""
                }

                readOnly

            />


            {/* ==================================
                GENDER
            ================================== */}

            <select

                name="gender"

                value={
                    profile.gender || ""
                }

                onChange={handleChange}

            >

                <option value="">
                    Select Gender
                </option>

                <option value="MALE">
                    Male
                </option>

                <option value="FEMALE">
                    Female
                </option>

                <option value="OTHER">
                    Other
                </option>

            </select>


            {/* ==================================
                DOB
            ================================== */}

            <input

                type="date"

                name="dob"

                value={

                    profile.dob

                        ? String(
                            profile.dob
                        ).substring(0, 10)

                        : ""

                }

                onChange={handleChange}

            />


            {/* ==================================
                ADDRESS
            ================================== */}

            <input

                type="text"

                name="address"

                placeholder="Address"

                value={
                    profile.address || ""
                }

                onChange={handleChange}

            />


            {/* ==================================
                CITY
            ================================== */}

            <input

                type="text"

                name="city"

                placeholder="City"

                value={
                    profile.city || ""
                }

                onChange={handleChange}

            />


            {/* ==================================
                STATE
            ================================== */}

            <input

                type="text"

                name="state"

                placeholder="State"

                value={
                    profile.state || ""
                }

                onChange={handleChange}

            />


            {/* ==================================
                PINCODE
            ================================== */}

            <input

                type="text"

                name="pincode"

                placeholder="Pincode"

                value={
                    profile.pincode || ""
                }

                onChange={handleChange}

            />


            {/* ==================================
                SAVE
            ================================== */}

            <button

                type="button"

                onClick={saveProfile}

                disabled={saving}

            >

                {saving

                    ? "Saving..."

                    : "Save Profile"

                }

            </button>

        </div>

    );

}


export default MyProfile;