import { useState } from "react";

import "./AddStockModal.css";

const AddStockModal = ({
  product,
  onClose,
  onSave,
}) => {

  const [quantity, setQuantity] = useState("");

  const handleAddStock = async (

productId,

quantity

)=>{

console.log(productId);

console.log(quantity);

try{

await addStock({

productId,

quantity:Number(quantity)

});

alert("Stock Added");

loadInventory();

setShowModal(false);

}catch(err){

console.log(err);

}

};

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2>Add Stock</h2>

        <h3>{product.product.name}</h3>

        <input
          type="number"
          placeholder="Enter Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />

        <div className="modal-buttons">

          <button
            className="save-btn"
            onClick={() =>
              onSave(product.product._id, quantity)
            }
          >
            Save
          </button>

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  );

};

export default AddStockModal;