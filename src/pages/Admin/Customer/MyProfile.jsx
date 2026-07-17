import { useEffect, useState } from "react";

import axios from "axios";

import "./MyProfile.css";

function MyProfile() {

  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({

    gender: "",

    dob: "",

    address: "",

    city: "",

    state: "",

    pincode: ""

  });

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile = async () => {

    try {


      const res = await axios.put(
  "http://localhost:5000/api/users/profile",
  profile,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      // const res = await axios.get(

      //   "http://localhost:5000/api/user/profile",

      //   {

      //     headers: {

      //       Authorization: `Bearer ${token}`

      //     }

      //   }

      // );

      setProfile(res.data.data);

    }

    catch (error) {

      console.log(error);

    }

  };

  const handleChange = (e) => {

    setProfile({

      ...profile,

      [e.target.name]: e.target.value

    });

  };

  const saveProfile = async () => {

    try {

      const res = await axios.put(

        "http://localhost:5000/api/user/profile",

        profile,

        {

          headers: {

            Authorization: `Bearer ${token}`

          }

        }

      );

      alert(res.data.message);

    }

    catch (error) {

      alert("Unable to Save");

    }

  };

  return (

    <div className="profile-card">

      <h2>My Profile</h2>

      <select

        name="gender"

        value={profile.gender}

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

        value={profile.dob?.substring(0,10)}

        onChange={handleChange}

      />

      <input

        type="text"

        name="address"

        placeholder="Address"

        value={profile.address}

        onChange={handleChange}

      />

      <input

        type="text"

        name="city"

        placeholder="City"

        value={profile.city}

        onChange={handleChange}

      />

      <input

        type="text"

        name="state"

        placeholder="State"

        value={profile.state}

        onChange={handleChange}

      />

      <input

        type="text"

        name="pincode"

        placeholder="Pincode"

        value={profile.pincode}

        onChange={handleChange}

      />

      <button onClick={saveProfile}>

        Save Profile

      </button>

    </div>

  );

}

export default MyProfile;