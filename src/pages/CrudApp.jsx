import { useState, useRef, useEffect } from "react";
import CrudForm from "../components/Form";
import CrudTable from "../components/Table";
import { Modal } from "bootstrap";

const CrudApp = () => {
  // Estados de la aplicación
  const [db, setDb] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  // URL de JSON Server (puerto 3001, recurso "products")
  const API_URL = "http://localhost:3001/products";

  // 1. READ: Obtener datos al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();
        setDb(data);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudieron cargar los productos. ¿Está corriendo JSON Server en el puerto 3001?");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Funciones para el Modal GET SE PINTA POR PRIMERA VEZ CUANDO SE CREA EL MODAL, Y LUEGO SE REUTILIZA
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

  // 2. CREATE
  const createData = async (nuevoItem) => {
    const cantidad = Number(nuevoItem.cantidad);
    const precioUnico = Number(nuevoItem.precioUnitario);

    const itemToAdd = {
      ...nuevoItem,
      cantidad: cantidad,
      precioUnitario: Number(precioUnico.toFixed(2)),
      total: Number((cantidad * precioUnico).toFixed(2)),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemToAdd),
      });
      if (!response.ok) throw new Error("Error al crear el producto");
      const savedItem = await response.json();
      setDb([...db, savedItem]);
      closeModal();
    } catch (err) {
      alert("No se pudo crear el producto. " + err.message);
    }
  };

  // 3. UPDATE
  const updateData = async (updatedItem) => {
    const cantidad = Number(updatedItem.quantity);
    const precioUnico = Number(updatedItem.unitPrice);

    const itemToUpdate = {
      ...updatedItem,
      quantity: cantidad,
      unitPrice: Number(precioUnico.toFixed(2)),
      total: Number((cantidad * precioUnico).toFixed(2)),
    };

    try {
      const response = await fetch(`${API_URL}/${itemToUpdate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemToUpdate),
      });
      if (!response.ok) throw new Error("Error al actualizar el producto");
      const savedItem = await response.json();
      setDb(db.map((item) => (item.id === savedItem.id ? savedItem : item)));
      closeModal();
    } catch (err) {
      alert("No se pudo actualizar. " + err.message);
    }
  };

  // 4. DELETE
  const deleteData = async (id) => {
    const confirmDelete = window.confirm(
      "¿Está seguro de eliminar este producto?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar el producto");
      setDb(db.filter((item) => item.id !== id));
      if (dataToEdit && dataToEdit.id === id) {
        setDataToEdit(null);
      }
    } catch (err) {
      alert("No se pudo eliminar. " + err.message);
    }
  };

  // Renderizado
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">📦 Almacén</h1>
        <button className="btn btn-primary" onClick={openModalToCreate}>
          ➕ Agregar Producto
        </button>
      </div>

      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && !error && (
        <CrudTable
          data={db}
          deleteData={deleteData}
          onEdit={openModalToEdit}
        />
      )}

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