import { useState } from "react";

import "./AddStockModal.css";

const TransferStockModal = ({
  item,
  onClose,
  onSave,
}) => {

  const [direction, setDirection] = useState("STORE_TO_WAREHOUSE");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  const store = Number(item?.currentStock || 0);
  const reserved = Number(item?.reservedStock || 0);
  const storeAvailable = Math.max(store - reserved, 0);
  const warehouse = Number(item?.warehouseStock || 0);

  const [from, to] =
    direction === "STORE_TO_WAREHOUSE"
      ? ["STORE", "WAREHOUSE"]
      : ["WAREHOUSE", "STORE"];

  const maxQty =
    from === "STORE" ? storeAvailable : warehouse;

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2>Transfer Stock</h2>

        <h3>{item?.product?.name}</h3>

        <p style={{ margin: "6px 0" }}>
          Store (available): <strong>{storeAvailable}</strong>
          {" | "}
          Warehouse: <strong>{warehouse}</strong>
        </p>

        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
        >
          <option value="STORE_TO_WAREHOUSE">Store → Warehouse</option>
          <option value="WAREHOUSE_TO_STORE">Warehouse → Store</option>
        </select>

        <input
          type="number"
          min="1"
          max={maxQty}
          placeholder={`Quantity (max ${maxQty})`}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ marginTop: "10px" }}
        />

        <div className="modal-buttons">

          <button
            className="save-btn"
            disabled={!quantity || Number(quantity) <= 0}
            onClick={() =>
              onSave({
                productId: item.product._id,
                quantity: Number(quantity),
                from,
                to,
                note
              })
            }
          >
            Transfer
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

export default TransferStockModal;