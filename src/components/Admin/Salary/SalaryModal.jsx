import React, { useEffect, useState } from "react";

import {
  getEmployeeSalary,
  configSalaryDetails,
  updateSalaryPayment,
} from "../../../services/salary.api";

import "./SalaryModal.css";
import { toast } from "react-toastify";


const SalaryModal = ({ employeeId, onClose }) => {

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("overview");

  const [salaryData, setSalaryData] = useState(null);

  const [configForm, setConfigForm] = useState({

    salaryType: "MONTHLY",

    amount: "",

    joiningDate: ""

  });

  const [payForm, setPayForm] = useState({

    month: new Date().toLocaleString("default", {

      month: "long",

      year: "numeric"

    }),

    amount: "",

    paymentDate: new Date().toISOString().split("T")[0],

    paymentMode: "BANK",

    status: "PAID",

    remark: ""

  });

  useEffect(() => {

    if (employeeId) {

      fetchSalary();

    }

  }, [employeeId]);

  const fetchSalary = async () => {

    try {

      setLoading(true);

      const res = await getEmployeeSalary(employeeId);

      if (res.success) {

        setSalaryData(res.data);

        setConfigForm({

          salaryType:

            res.data.salaryDetails?.salaryType ||

            "MONTHLY",

          amount:

            res.data.salaryDetails?.amount ||

            0,

          joiningDate:

            res.data.salaryDetails?.joiningDate

              ? new Date(

                  res.data.salaryDetails.joiningDate

                )

                  .toISOString()

                  .split("T")[0]

              : ""

        });

        setPayForm((prev) => ({

          ...prev,

          amount:

            res.data.salaryDetails?.amount ||

            0

        }));

      }

    } catch (err) {

      setError(

        err.response?.data?.message ||

          "Unable to load salary."

      );

    } finally {

      setLoading(false);

    }

  };

  const handleSalaryConfig = async (e) => {

  e.preventDefault();

  try {

    await configSalaryDetails(

      employeeId,

      configForm

    );

    toast.success("Salary Updated Successfully");

    fetchSalary();

    setActiveTab("overview");

  } catch (err) {

    toast.error(

      err.response?.data?.message ||

      "Update Failed"

    );

  }

};

const handleSalaryPayment = async (e) => {

  e.preventDefault();

  try {

    await updateSalaryPayment(

      employeeId,

      payForm

    );

    toast.success("Salary Paid Successfully");

    fetchSalary();

    setActiveTab("overview");

  } catch (err) {

    toast.error(

      err.response?.data?.message ||

      "Payment Failed"

    );

  }

};

if (loading) {

  return (

    <div className="salary-loading">

      Loading Salary...

    </div>

  );

}

const employeeName =

salaryData?.name ||

"N/A";

const email =

salaryData?.email ||

"N/A";

const salaryType =

salaryData?.salaryDetails?.salaryType ||

"MONTHLY";

const amount =

salaryData?.salaryDetails?.amount ||

0;

const joiningDate =

salaryData?.salaryDetails?.joiningDate

? new Date(

salaryData.salaryDetails.joiningDate

).toLocaleDateString()

: "-";

return (

<div className="salary-modal-overlay">

<div className="salary-modal">

<div className="salary-header">

<h2>

Employee Salary Management

</h2>

<button

onClick={onClose}

className="close-btn"

>

✕

</button>

</div>

<div className="employee-card">

<h3>{employeeName}</h3>

<p>{email}</p>

<p>

Joining :

{joiningDate}

</p>

<p>

Salary :

₹{amount.toLocaleString()}

</p>

<p>

Type :

{salaryType}

</p>

</div>

<div className="salary-tabs">

<button

className={activeTab==="overview"?"active":""}

onClick={()=>setActiveTab("overview")}

>

Overview

</button>

<button

className={activeTab==="payment"?"active":""}

onClick={()=>setActiveTab("payment")}

>

Add Payment

</button>

<button

className={activeTab==="config"?"active":""}

onClick={()=>setActiveTab("config")}

>

Salary Structure

</button>

</div>

{error && (

<div className="salary-error">

{error}

</div>

)}

{

activeTab === "overview" && (

<div className="overview-section">

<div className="summary-grid">

<div className="summary-card">

<h4>Salary Type</h4>

<h2>

{salaryData?.salaryDetails?.salaryType ||

"MONTHLY"}

</h2>

</div>

<div className="summary-card">

<h4>Base Salary</h4>

<h2>

₹

{Number(

salaryData?.salaryDetails?.amount || 0

).toLocaleString()}

</h2>

</div>

<div className="summary-card">

<h4>Total Paid</h4>

<h2 className="green">

₹

{Number(

salaryData?.totalPaidAmount || 0

).toLocaleString()}

</h2>

</div>

</div>

<div className="history-title">

Payment History

</div>

<table className="salary-history-table">

<thead>

<tr>

<th>Month</th>

<th>Amount</th>

<th>Mode</th>

<th>Date</th>

<th>Status</th>

<th>Comment</th>

</tr>

</thead>

<tbody>

  {

salaryData?.salaryHistory?.length > 0 ?

(

salaryData.salaryHistory.map((item)=>(

<tr key={item._id}>

<td>

{item.month}

</td>

<td>

₹

{Number(item.amount).toLocaleString()}

</td>

<td>

{item.paymentMode}

</td>

<td>

{

item.paymentDate ?

new Date(

item.paymentDate

).toLocaleDateString()

:

"-"

}

</td>

<td>

<span

className={

item.status==="PAID"

?

"paid-badge"

:

"pending-badge"

}

>

{item.status}

</span>

</td>

 <td>
    {item.remark?.trim()
      ? item.remark
      : "-"}
  </td>

</tr>

))

)

:

(

<tr>

<td

colSpan="5"

style={{

textAlign:"center",

padding:"30px"

}}

>

No Salary History Available

</td>

</tr>

)

}

</tbody>

</table>

</div>

)
}

{
activeTab === "payment" && (

<form
className="salary-form"
onSubmit={handleSalaryPayment}
>

<div className="form-row">

<div className="form-group">

<label>Month</label>

<input
type="text"
value={payForm.month}
onChange={(e)=>
setPayForm({
...payForm,
month:e.target.value
})
}
/>

</div>

<div className="form-group">

<label>Salary Amount</label>

<input
type="number"
value={payForm.amount}
onChange={(e)=>
setPayForm({
...payForm,
amount:e.target.value
})
}
/>

</div>

</div>

<div className="form-row">

<div className="form-group">

<label>Payment Date</label>

<input
type="date"
value={payForm.paymentDate}
onChange={(e)=>
setPayForm({
...payForm,
paymentDate:e.target.value
})
}
/>

</div>

<div className="form-group">

<label>Payment Mode</label>

<select
value={payForm.paymentMode}
onChange={(e)=>
setPayForm({
...payForm,
paymentMode:e.target.value
})
}
>

<option value="BANK">Bank</option>
<option value="UPI">UPI</option>
<option value="CASH">Cash</option>

</select>

</div>

</div>

<div className="form-row">

<div className="form-group">

<label>Status</label>

<select
value={payForm.status}
onChange={(e)=>
setPayForm({
...payForm,
status:e.target.value
})
}
>

<option value="PAID">PAID</option>
<option value="PENDING">PENDING</option>

</select>

</div>

</div>

<div className="form-group">

<label>comment</label>

<textarea

rows="3"

value={payForm.remark}

onChange={(e)=>

setPayForm({

...payForm,

remark:e.target.value

})

}

/>

</div>

<button
type="submit"
className="save-btn"
>

Record Salary Payment

</button>

</form>

)

}

{
activeTab === "config" && (

<form

className="salary-form"

onSubmit={handleSalaryConfig}

>

<div className="form-group">

<label>

Salary Type

</label>

<select

value={configForm.salaryType}

onChange={(e)=>

setConfigForm({

...configForm,

salaryType:e.target.value

})

}

>

<option value="MONTHLY">

MONTHLY

</option>

<option value="DAILY">

DAILY

</option>

</select>

</div>

<div className="form-group">

<label>

Salary Amount

</label>

<input

type="number"

value={configForm.amount}

onChange={(e)=>

setConfigForm({

...configForm,

amount:e.target.value

})

}

/>

</div>

<div className="form-group">

<label>

Joining Date

</label>

<input

type="date"

value={configForm.joiningDate}

onChange={(e)=>

setConfigForm({

...configForm,

joiningDate:e.target.value

})

}

/>

</div>

<button

type="submit"

className="save-btn"

>

Update Salary Structure

</button>

</form>

)

}

</div>

</div>

);

};

export default SalaryModal;