// import { useEffect, useState } from "react";
// import axios from "axios";
// import "./MyProfile.css";

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

//             const res = await axios.get(

//                 "http://localhost:5000/api/users/profile",

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

//             const res = await axios.put(

//                 "http://localhost:5000/api/users/profile",

//                 profile,

//                 {

//                     headers: {

//                         Authorization: `Bearer ${token}`

//                     }

//                 }

//             );

//             alert(res.data.message);

//         }

//         catch (error) {

//             console.log(error);

//             alert(

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

function MyProfile() {

    const token = localStorage.getItem("token");

    const [profile, setProfile] = useState({

    firstName: "",

    lastName: "",

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

    useEffect(() => {

        fetchProfile();

    }, []);

    // ==========================
    // GET PROFILE
    // ==========================

    const fetchProfile = async () => {

        try {

            const res = await axios.get(

                "http://localhost:5000/api/users/profile",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            console.log(res.data);

            setProfile(res.data.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    // ==========================
    // HANDLE CHANGE
    // ==========================

    const handleChange = (e) => {

        setProfile({

            ...profile,

            [e.target.name]: e.target.value

        });

    };

    // ==========================
    // UPDATE PROFILE
    // ==========================

    const saveProfile = async () => {

        try {

            const res = await axios.put(

                "http://localhost:5000/api/users/profile",

                profile,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            toast.error(res.data.message);

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Unable To Save"

            );

        }

    };

    return (

        <div className="profile-card">

            <h2>My Profile</h2>

            <input

                type="text"

                name="fullName"

                placeholder="Full Name"

                value={profile.fullName || ""}

                onChange={handleChange}

            />

            <input

                type="email"

                name="email"

                placeholder="Email"

                value={profile.email || ""}

                readOnly

            />

            <input

                type="text"

                name="phone"

                placeholder="Phone"

                value={profile.phone || ""}

                readOnly

            />

            <select

                name="gender"

                value={profile.gender || ""}

                onChange={handleChange}

            >

                <option value="">Select Gender</option>

                <option value="MALE">Male</option>

                <option value="FEMALE">Female</option>

                <option value="OTHER">Other</option>

            </select>

            <input

                type="date"

                name="dob"

                value={profile.dob ? profile.dob.substring(0, 10) : ""}

                onChange={handleChange}

            />

            <input

                type="text"

                name="address"

                placeholder="Address"

                value={profile.address || ""}

                onChange={handleChange}

            />

            <input

                type="text"

                name="city"

                placeholder="City"

                value={profile.city || ""}

                onChange={handleChange}

            />

            <input

                type="text"

                name="state"

                placeholder="State"

                value={profile.state || ""}

                onChange={handleChange}

            />

            <input

                type="text"

                name="pincode"

                placeholder="Pincode"

                value={profile.pincode || ""}

                onChange={handleChange}

            />

            <button onClick={saveProfile}>

                Save Profile

            </button>

        </div>

    );

}

export default MyProfile;
