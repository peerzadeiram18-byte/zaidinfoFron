// // import React, {
// //     useEffect,
// //     useState
// // } from "react";

// // import "./MyAddress.css";

// // import {
// //     Link,
// //     useNavigate
// // } from "react-router-dom";

// // import {
// //     getAddresses,
// //     deleteAddress,
// //     setDefaultAddress
// // } from "../../../services/addressService";

// // const MyAddress = () => {

// //     const navigate = useNavigate();

// //     const [addresses, setAddresses] = useState([]);

// //     const [loading, setLoading] = useState(true);

// //     const [selectedAddress, setSelectedAddress] = useState("");

// //     useEffect(() => {

// //         loadAddresses();

// //     }, []);

// //     const loadAddresses = async () => {

// //         try {

// //             setLoading(true);

// //             const res = await getAddresses();

// //             console.log("Address API =", res.data);

// //             const addressList = res.data.data || [];

// //             setAddresses(addressList);

// //             // Automatically select default address
// //             const defaultAddress = addressList.find(
// //                 item => item.isDefault
// //             );

// //             if (defaultAddress) {

// //                 setSelectedAddress(defaultAddress._id);

// //             }

// //         }

// //         catch (error) {

// //             console.log(error);

// //         }

// //         finally {

// //             setLoading(false);

// //         }

// //     };

// //     // ===========================
// //     // Delete Address
// //     // ===========================

// //     const handleDelete = async (id) => {

// //         const confirmDelete = window.confirm(
// //             "Are you sure you want to delete this address?"
// //         );

// //         if (!confirmDelete) {

// //             return;

// //         }

// //         try {

// //             await deleteAddress(id);

// //             alert("Address Deleted Successfully");

// //             loadAddresses();

// //         }

// //         catch (error) {

// //             console.log(error);

// //             alert(

// //                 error.response?.data?.message ||

// //                 "Unable to delete address"

// //             );

// //         }

// //     };

// //     // ===========================
// //     // Set Default Address
// //     // ===========================

// //     const handleDefault = async (id) => {

// //         try {

// //             await setDefaultAddress(id);

// //             alert("Default Address Updated");

// //             loadAddresses();

// //         }

// //         catch (error) {

// //             console.log(error);

// //         }

// //     };

// //     return (

// //         <div className="address-page">

// //             <div className="address-header">

// //                 <h2>

// //                     My Addresses

// //                 </h2>

// //                 <Link
// //                     to="/add-address"
// //                     className="add-address-btn"
// //                 >

// //                     + Add Address

// //                 </Link>

// //             </div>

// //             {

// //                 loading ?

// //                     (

// //                         <div className="loading">

// //                             Loading Addresses...

// //                         </div>

// //                     )

// //                     :

// //                     addresses.length === 0 ?

// //                         (

// //                             <div className="no-address">

// //                                 <h3>

// //                                     No Address Found

// //                                 </h3>

// //                                 <p>

// //                                     Please add your first address.

// //                                 </p>

// //                             </div>

// //                         )

// //                         :

// //                         (

// //                             <>

// //                                 <div className="address-list">

// //                                     {

// //                                         addresses.map((address) => (

// //                                             <div
// //                                                 className="address-card"
// //                                                 key={address._id}
// //                                             >

// //                                                 <input

// //                                                     type="radio"

// //                                                     name="selectedAddress"

// //                                                     checked={

// //                                                         selectedAddress === address._id

// //                                                     }

// //                                                     onChange={() =>

// //                                                         setSelectedAddress(

// //                                                             address._id

// //                                                         )

// //                                                     }

// //                                                 />

// //                                                 {

// //                                                     address.isDefault &&

// //                                                     (

// //                                                         <span className="default-badge">

// //                                                             Default

// //                                                         </span>

// //                                                     )

// //                                                 }

// //                                                 <h3>

// //                                                     {address.fullName}

// //                                                 </h3>

// //                                                 <p>

// //                                                     {address.phone}

// //                                                 </p>

// //                                                 <p>

// //                                                     {address.addressLine}

// //                                                 </p>

// //                                                 <p>

// //                                                     {address.city},

// //                                                     {" "}

// //                                                     {address.state}

// //                                                 </p>

// //                                                 <p>

// //                                                     {address.pincode}

// //                                                 </p>

// //                                                 <p>

// //                                                     {address.country}

// //                                                 </p>

// //                                                 {

// //                                                     address.landmark &&

// //                                                     (

// //                                                         <p>

// //                                                             Landmark :

// //                                                             {" "}

// //                                                             {address.landmark}

// //                                                         </p>

// //                                                     )

// //                                                 }

// //                                                 <p>

// //                                                     <strong>

// //                                                         Type :

// //                                                     </strong>

// //                                                     {" "}

// //                                                     {address.type}

// //                                                 </p>

// //                                                 <div className="address-buttons">

// //                                                     <button

// //                                                         onClick={() =>

// //                                                             navigate(

// //                                                                 `/edit-address/${address._id}`

// //                                                             )

// //                                                         }

// //                                                     >

// //                                                         Edit

// //                                                     </button>

// //                                                     <button

// //                                                         onClick={() =>

// //                                                             handleDelete(

// //                                                                 address._id

// //                                                             )

// //                                                         }

// //                                                     >

// //                                                         Delete

// //                                                     </button>

// //                                                     {

// //                                                         !address.isDefault &&

// //                                                         (

// //                                                             <button

// //                                                                 onClick={() =>

// //                                                                     handleDefault(

// //                                                                         address._id

// //                                                                     )

// //                                                                 }

// //                                                             >

// //                                                                 Set Default

// //                                                             </button>

// //                                                         )

// //                                                     }

// //                                                 </div>

// //                                             </div>

// //                                         ))

// //                                     }

// //                                 </div>

// //                                 <div className="checkout-section">

// //                                     <button

// //                                         className="continue-btn"

// //                                         disabled={!selectedAddress}

// //                                         onClick={() =>

// //                                             navigate(

// //                                                 `/checkout/${selectedAddress}`

// //                                             )

// //                                         }

// //                                     >

// //                                         Continue To Checkout

// //                                     </button>

// //                                 </div>

// //                             </>

// //                         )

// //             }

// //         </div>

// //     );

// // };

// // export default MyAddress;




// import React, {
//     useEffect,
//     useState
// } from "react";

// import "./MyAddress.css";

// import {
//     Link,
//     useNavigate
// } from "react-router-dom";

// import {
//     getAddresses,
//     deleteAddress,
//     setDefaultAddress
// } from "../../../services/addressService";
// import { toast } from "react-toastify";

// const MyAddress = () => {

//     const navigate = useNavigate();

//     const [addresses, setAddresses] = useState([]);

//     const [loading, setLoading] = useState(true);

//     const [selectedAddress, setSelectedAddress] = useState("");

//     useEffect(() => {

//         loadAddresses();

//     }, []);

//     const loadAddresses = async () => {

//         try {

//             setLoading(true);

//             const res = await getAddresses();

//             console.log("Address API =", res.data);

//             const addressList = res.data.data || [];

//             setAddresses(addressList);

//             // Automatically select default address
//             const defaultAddress = addressList.find(
//                 item => item.isDefault
//             );

//             if (defaultAddress) {

//                 setSelectedAddress(defaultAddress._id);

//             }

//         }

//         catch (error) {

//             console.log(error);

//         }

//         finally {

//             setLoading(false);

//         }

//     };

//     // ===========================
//     // Delete Address
//     // ===========================

//     const handleDelete = async (id) => {

//         const confirmDelete = window.confirm(
//             "Are you sure you want to delete this address?"
//         );

//         if (!confirmDelete) {

//             return;

//         }

//         try {

//             await deleteAddress(id);

//             toast.error("Address Deleted Successfully");

//             loadAddresses();

//         }

//         catch (error) {

//             console.log(error);

//             toast.error(

//                 error.response?.data?.message ||

//                 "Unable to delete address"

//             );

//         }

//     };

//     // ===========================
//     // Set Default Address
//     // ===========================

//     const handleDefault = async (id) => {

//         try {

//             await setDefaultAddress(id);

//             toast.error("Default Address Updated");

//             loadAddresses();

//         }

//         catch (error) {

//             console.log(error);

//         }

//     };

//     return (

//         <div className="address-page">

//             <div className="address-header">

//                 <h2>

//                     My Addresses

//                 </h2>

//                 <Link
//                     to="/add-address"
//                     className="add-address-btn"
//                 >

//                     + Add Address

//                 </Link>

//             </div>

//             {

//                 loading ?

//                     (

//                         <div className="loading">

//                             Loading Addresses...

//                         </div>

//                     )

//                     :

//                     addresses.length === 0 ?

//                         (

//                             <div className="no-address">

//                                 <h3>

//                                     No Address Found

//                                 </h3>

//                                 <p>

//                                     Please add your first address.

//                                 </p>

//                             </div>

//                         )

//                         :

//                         (

//                             <>

//                                 <div className="address-list">

//                                     {

//                                         addresses.map((address) => (

//                                             <div
//                                                 className="address-card"
//                                                 key={address._id}
//                                             >

//                                                 <input

//                                                     type="radio"

//                                                     name="selectedAddress"

//                                                     checked={

//                                                         selectedAddress === address._id

//                                                     }

//                                                     onChange={() =>

//                                                         setSelectedAddress(

//                                                             address._id

//                                                         )

//                                                     }

//                                                 />

//                                                 {

//                                                     address.isDefault &&

//                                                     (

//                                                         <span className="default-badge">

//                                                             Default

//                                                         </span>

//                                                     )

//                                                 }

//                                                 <h3>

//                                                     {address.fullName}

//                                                 </h3>

//                                                 <p>

//                                                     {address.phone}

//                                                 </p>

//                                                 <p>

//                                                     {address.addressLine}

//                                                 </p>

//                                                 <p>

//                                                     {address.city},

//                                                     {" "}

//                                                     {address.state}

//                                                 </p>

//                                                 <p>

//                                                     {address.pincode}

//                                                 </p>

//                                                 <p>

//                                                     {address.country}

//                                                 </p>

//                                                 {

//                                                     address.landmark &&

//                                                     (

//                                                         <p>

//                                                             Landmark :

//                                                             {" "}

//                                                             {address.landmark}

//                                                         </p>

//                                                     )

//                                                 }

//                                                 <p>

//                                                     <strong>

//                                                         Type :

//                                                     </strong>

//                                                     {" "}

//                                                     {address.type}

//                                                 </p>

//                                                 <div className="address-buttons">

//                                                     <button

//                                                         onClick={() =>

//                                                             navigate(

//                                                                 `/edit-address/${address._id}`

//                                                             )

//                                                         }

//                                                     >

//                                                         Edit

//                                                     </button>

//                                                     <button

//                                                         onClick={() =>

//                                                             handleDelete(

//                                                                 address._id

//                                                             )

//                                                         }

//                                                     >

//                                                         Delete

//                                                     </button>

//                                                     {

//                                                         !address.isDefault &&

//                                                         (

//                                                             <button

//                                                                 onClick={() =>

//                                                                     handleDefault(

//                                                                         address._id

//                                                                     )

//                                                                 }

//                                                             >

//                                                                 Set Default

//                                                             </button>

//                                                         )

//                                                     }

//                                                 </div>

//                                             </div>

//                                         ))

//                                     }

//                                 </div>

//                                 <div className="checkout-section">

//                                     <button

//                                         className="continue-btn"

//                                         disabled={!selectedAddress}

//                                         onClick={() =>

//                                             navigate(

//                                                 `/checkout/${selectedAddress}`

//                                             )

//                                         }

//                                     >

//                                         Continue To Checkout

//                                     </button>

//                                 </div>

//                             </>

//                         )

//             }

//         </div>

//     );

// };

// export default MyAddress;


import React, {
    useEffect,
    useState
} from "react";

import "./MyAddress.css";
import { toast } from "react-toastify";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    getAddresses,
    deleteAddress,
    setDefaultAddress
} from "../../../services/addressService";

const MyAddress = () => {

    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedAddress, setSelectedAddress] = useState("");

    useEffect(() => {

        loadAddresses();

    }, []);

    const loadAddresses = async () => {

        try {

            setLoading(true);

            const res = await getAddresses();

            console.log("Address API =", res.data);

            const addressList = res.data.data || [];

            setAddresses(addressList);

            // Automatically select default address
            const defaultAddress = addressList.find(
                item => item.isDefault
            );

            if (defaultAddress) {

                setSelectedAddress(defaultAddress._id);

            }

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    // ===========================
    // Delete Address
    // ===========================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this address?"
        );

        if (!confirmDelete) {

            return;

        }

        try {

            await deleteAddress(id);

            toast.success("Address Deleted Successfully");

            loadAddresses();

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Unable to delete address"

            );

        }

    };

    // ===========================
    // Set Default Address
    // ===========================

    const handleDefault = async (id) => {

        try {

            await setDefaultAddress(id);

            toast.success("Default Address Updated");

            loadAddresses();

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="address-page">

            <div className="address-header">

                <h2>

                    My Addresses

                </h2>

                <Link
                    to="/add-address"
                    className="add-address-btn"
                >

                    + Add Address

                </Link>

            </div>

            {

                loading ?

                    (

                        <div className="loading">

                            Loading Addresses...

                        </div>

                    )

                    :

                    addresses.length === 0 ?

                        (

                            <div className="no-address">

                                <h3>

                                    No Address Found

                                </h3>

                                <p>

                                    Please add your first address.

                                </p>

                            </div>

                        )

                        :

                        (

                            <>

                                <div className="address-list">

                                    {

                                        addresses.map((address) => (

                                            <div
                                                className="address-card"
                                                key={address._id}
                                            >

                                                <input

                                                    type="radio"

                                                    name="selectedAddress"

                                                    checked={

                                                        selectedAddress === address._id

                                                    }

                                                    onChange={() =>

                                                        setSelectedAddress(

                                                            address._id

                                                        )

                                                    }

                                                />

                                                {

                                                    address.isDefault &&

                                                    (

                                                        <span className="default-badge">

                                                            Default

                                                        </span>

                                                    )

                                                }

                                                <h3>

                                                    {address.fullName}

                                                </h3>

                                                <p>

                                                    {address.phone}

                                                </p>

                                                <p>

                                                    {address.addressLine}

                                                </p>

                                                <p>

                                                    {address.city},

                                                    {" "}

                                                    {address.state}

                                                </p>

                                                <p>

                                                    {address.pincode}

                                                </p>

                                                <p>

                                                    {address.country}

                                                </p>

                                                {

                                                    address.landmark &&

                                                    (

                                                        <p>

                                                            Landmark :

                                                            {" "}

                                                            {address.landmark}

                                                        </p>

                                                    )

                                                }

                                                <p>

                                                    <strong>

                                                        Type :

                                                    </strong>

                                                    {" "}

                                                    {address.type}

                                                </p>

                                                <div className="address-buttons">

                                                    <button

                                                        onClick={() =>

                                                            navigate(

                                                                `/edit-address/${address._id}`

                                                            )

                                                        }

                                                    >

                                                        Edit

                                                    </button>

                                                    <button

                                                        onClick={() =>

                                                            handleDelete(

                                                                address._id

                                                            )

                                                        }

                                                    >

                                                        Delete

                                                    </button>

                                                    {

                                                        !address.isDefault &&

                                                        (

                                                            <button

                                                                onClick={() =>

                                                                    handleDefault(

                                                                        address._id

                                                                    )

                                                                }

                                                            >

                                                                Set Default

                                                            </button>

                                                        )

                                                    }

                                                </div>

                                            </div>

                                        ))

                                    }

                                </div>

                                <div className="checkout-section">

                                    <button

                                        className="continue-btn"

                                        disabled={!selectedAddress}

                                        onClick={() =>

                                            navigate(

                                                `/checkout/${selectedAddress}`

                                            )

                                        }

                                    >

                                        Continue To Checkout

                                    </button>

                                </div>

                            </>

                        )

            }

        </div>

    );

};

export default MyAddress;