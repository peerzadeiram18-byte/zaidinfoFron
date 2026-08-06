// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../../services/authService";
// import "./Login.css";

// function Login() {

//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {

//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });

//   };

//   const handleLogin = async (e) => {

//     e.preventDefault();

//     try {

//       setLoading(true);

//       const res = await loginUser(formData);

//       console.log(res.data);

//       localStorage.setItem("token", res.data.token);

//       localStorage.setItem(
//         "user",
//         JSON.stringify(res.data.user)
//       );

//       alert("Login Successful");

//       const role = res.data.user.role;

//       switch (role) {

//         case "SUPER_ADMIN":
//         case "ADMIN":
//           navigate("/admin-dashboard");
//           break;

//         case "CUSTOMER":
//           navigate("/customer-dashboard");
//           break;

//         case "RECEPTIONIST":
//           navigate("/receptionist-dashboard");
//           break;

//         case "TECHNICIAN":
//           navigate("/technician-dashboard");
//           break;

//         case "INVENTORY":
//           navigate("/inventory-dashboard");
//           break;

//         case "ACCOUNTANT":
//           navigate("/accountant-dashboard");
//           break;

//         default:
//           navigate("/login");

//       }

//     }

//     catch (error) {

//       alert(

//         error.response?.data?.message ||

//         "Login Failed"

//       );

//     }

//     finally {

//       setLoading(false);

//     }

//   };

//   return (

//     <div className="login-page">

//       <div className="login-box">

//         <h2>Zaid Infotech</h2>

//         <p>Login to Continue</p>

//         <form onSubmit={handleLogin}>

//           <input
//             type="email"
//             name="email"
//             placeholder="Enter Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Enter Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit">

//             {loading ? "Please Wait..." : "Login"}

//           </button>

//         </form>

//         <div className="bottom-text">

//           Don't have an account?

//           <span onClick={() => navigate("/register")}>

//             Register

//           </span>

//         </div>

//       </div>

//     </div>

//   );

// }

// export default Login;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";
import { toast } from "react-toastify";


function Login() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await loginUser(formData);

      const { token, user } = res.data;

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

toast.success("Login Successfully");
      if (user.role === "ADMIN") {

        navigate("/admin-dashboard");

      }

      else if (user.role === "CUSTOMER") {

        navigate("/customer-dashboard");

      }

      else if (user.role === "RECEPTIONIST") {

        navigate("/receptionist-dashboard");

      }

      else if (user.role === "TECHNICIAN") {

        navigate("/technician-dashboard");

      }

      else if (user.role === "INVENTORY") {

        navigate("/inventory-dashboard");

      }

      else if (user.role === "ACCOUNTANT") {

        navigate("/accountant-dashboard");

      }

      else {

        toast.error("Invalid User Role");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

      }

    }

    catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Login Failed"
      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="login-page">

      <div className="login-box">

        <h2>Zaid Infotech</h2>

        <p>Login to Continue</p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Please Wait..." : "Login"}
          </button>

        </form>

        <div className="bottom-text">

          Don't have an account?

          <span
            onClick={() => navigate("/register")}
          >
            Register
          </span>

        </div>

      </div>

    </div>

  );

}

export default Login;