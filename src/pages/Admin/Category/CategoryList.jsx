import { useEffect,useState } from "react";

import { getCategories } from "../../../services/categoryService";

import "./CategoryList.css";

function CategoryList(){

const [categories,setCategories]=useState([]);

useEffect(()=>{

loadCategories();

},[]);

const loadCategories=async()=>{

try{

const res=await getCategories();

setCategories(res.data.data);

}

catch(error){

console.log(error);

}

};

return(

<div className="category-list-page">

<h2>Category List</h2>

<table>

<thead>

<tr>

<th>Name</th>

<th>Image</th>

<th>Description</th>

<th>Status</th>

</tr>

</thead>

<tbody>

{

categories.length===0?

(

<tr>

<td colSpan="4">

No Category Found

</td>

</tr>

)

:

categories.map(category=>(

<tr key={category._id}>

<td>{category.name}</td>
<td>

  {category.image ? (

    <img
      src={`http://localhost:5000${category.image}`}
      alt={category.name}
      className="category-image"
      onError={(e) => {
        e.target.src =
          "https://via.placeholder.com/120x120?text=No+Image";
      }}
    />

  ) : (

    "No Image"

  )}

</td>

<td>{category.description}</td>

<td>{category.status}</td>

</tr>

))

}

</tbody>

</table>

</div>

);

}

export default CategoryList;