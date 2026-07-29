import { useState, useRef, useEffect } from "react";
import CrudForm from "../components/Form";
import CrudTable from "../components/Table";
import { Modal } from "bootstrap";

const CrudApp = () => {
  // Estados de la aplicación
  const [db, setDb] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [loading, setLoading] = useState(true); // Nuevo estado para la carga
  
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  // URL de nuestra API simulada (json-server)
  const API_URL = "http://localhost:5000/products";

  // 1. READ: Obtener datos al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();
        setDb(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        // Apagamos el estado de carga sin importar si la petición falló o tuvo éxito
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  // Funciones para manejar el Modal de Bootstrap
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

  // 2. CREATE: Enviar un nuevo producto por POST
  const createData = async (newItem) => {
    const quantityNum = Number(newItem.quantity);
    const unitPriceNum = Number(newItem.unitPrice);

    const itemToAdd = {
      ...newItem,
      quantity: quantityNum,
      unitPrice: Number(unitPriceNum.toFixed(2)),
      total: Number((quantityNum * unitPriceNum).toFixed(2)),
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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 3. UPDATE: Actualizar un producto por PUT
  const updateData = async (updatedItem) => {
    const quantityNum = Number(updatedItem.quantity);
    const unitPriceNum = Number(updatedItem.unitPrice);

    const itemToUpdate = {
      ...updatedItem,
      quantity: quantityNum,
      unitPrice: Number(unitPriceNum.toFixed(2)),
      total: Number((quantityNum * unitPriceNum).toFixed(2)),
    };

    try {
      const response = await fetch(`${API_URL}/${itemToUpdate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemToUpdate),
      });
      if (!response.ok) throw new Error("Error al actualizar el producto");
      
      const savedItem = await response.json();
      const newDb = db.map((item) =>
        item.id === savedItem.id ? savedItem : item
      );
      setDb(newDb);
      closeModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 4. DELETE: Eliminar un producto por DELETE
  const deleteData = async (id) => {
    const confirmDelete = window.confirm(
      "¿Está seguro de eliminar este producto?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el producto");

        const newDb = db.filter((item) => item.id !== id);
        setDb(newDb);
        if (dataToEdit && dataToEdit.id === id) {
          setDataToEdit(null);
        }
      } catch (error) {
        console.error("Error:", error);
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

      {/* Condicional: Si está cargando, mostramos el spinner. Si no, la tabla */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <CrudTable
          data={db}
          deleteData={deleteData}
          onEdit={openModalToEdit}
        />
      )}

      {/* Modal de Bootstrap para el Formulario */}
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