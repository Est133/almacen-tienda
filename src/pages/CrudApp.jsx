import { useState, useRef } from "react";
import CrudForm from "../components/Form";
import CrudTable from "../components/CrudTable";
import initialData from "../data/initialData";
import { Modal } from "bootstrap";

const CrudApp = () => {
  const [db, setDb] = useState(initialData);
  const [dataToEdit, setDataToEdit] = useState(null);
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

const getModalInstance = () => {
  if (!bsModalRef.current) {
    bsModalRef.current = new Modal(modalRef.current);
  }
  return bsModalRef.current;
};

  const openModalToCreate = () => {
    setDataToEdit(null);
    getModalInstance().show();
  };

  const openModalToEdit = (item) => {
    setDataToEdit(item);
    getModalInstance().show();
  };

  const closeModal = () => {
    getModalInstance().hide();
    setDataToEdit(null);
  };

  const createData = (newItem) => {
    const quantityNum = Number(newItem.quantity);
    const unitPriceNum = Number(newItem.unitPrice);

    const itemToAdd = {
      ...newItem,
      id: Date.now(),
      quantity: quantityNum,
      unitPrice: Number(unitPriceNum.toFixed(2)),
      total: Number((quantityNum * unitPriceNum).toFixed(2)),
    };

    setDb([...db, itemToAdd]);
    closeModal();
  };

  const updateData = (updatedItem) => {
    const quantityNum = Number(updatedItem.quantity);
    const unitPriceNum = Number(updatedItem.unitPrice);

    const itemToUpdate = {
      ...updatedItem,
      quantity: quantityNum,
      unitPrice: Number(unitPriceNum.toFixed(2)),
      total: Number((quantityNum * unitPriceNum).toFixed(2)),
    };

    const newDb = db.map((item) =>
      item.id === updatedItem.id ? itemToUpdate : item
    );

    setDb(newDb);
    closeModal();
  };

  const deleteData = (id) => {
    const confirmDelete = window.confirm(
      "¿Está seguro de eliminar este producto?"
    );
    if (confirmDelete) {
      const newDb = db.filter((item) => item.id !== id);
      setDb(newDb);
      if (dataToEdit && dataToEdit.id === id) {
        setDataToEdit(null);
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">📦 Almacén </h1>
        <button className="btn btn-primary" onClick={openModalToCreate}>
          ➕ Agregar Producto
        </button>
      </div>

      <CrudTable
        data={db}
        deleteData={deleteData}
        onEdit={openModalToEdit}
      />

      {/* Modal de Bootstrap */}
      <div
        className="modal fade"
        ref={modalRef}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {dataToEdit ? "✏️ Editar Producto" : "➕ Agregar Producto"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <CrudForm
                createData={createData}
                updateData={updateData}
                dataToEdit={dataToEdit}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudApp;