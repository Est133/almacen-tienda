import { useState, useRef, useEffect } from "react";
<<<<<<< HEAD
import CrudForm from "../components/Form";
import CrudTable from "../components/crudTable";
=======
import CrudForm from "../components/CrudForm";
import CrudTable from "../components/CrudTable";
>>>>>>> 5b5967f25fc560894562777455dc61d9f0153b13
import { Modal } from "bootstrap";

const CrudApp = () => {
  // Estados de la aplicación traducidos
  const [baseDatos, setBaseDatos] = useState([]);
  const [datoAEditar, setDatoAEditar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const referenciaModal = useRef(null);
  const referenciaInstanciaBs = useRef(null);

  // URL de JSON Server (puerto 3001, recurso "productos")
  const URL_API = "http://localhost:3001/productos";

  // 1. READ: Obtener datos al cargar el componente
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuesta = await fetch(URL_API);
        if (!respuesta.ok) throw new Error("Error al obtener los datos");
        const datos = await respuesta.json();
        setBaseDatos(datos);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudieron cargar los productos. ¿Está corriendo JSON Server en el puerto 3001?");
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  // Funciones para el Modal
  const obtenerInstanciaModal = () => {
    if (!referenciaInstanciaBs.current) {
      referenciaInstanciaBs.current = new Modal(referenciaModal.current);
    }
    return referenciaInstanciaBs.current;
  };

  const abrirModalCrear = () => {
    setDatoAEditar(null);
    obtenerInstanciaModal().show();
  };

  const abrirModalEditar = (item) => {
    setDatoAEditar(item);
    obtenerInstanciaModal().show();
  };

  const cerrarModal = () => {
    obtenerInstanciaModal().hide();
    setDatoAEditar(null);
  };

  // 2. CREATE: Crear un nuevo registro
  const crearDato = async (nuevoItem) => {
    const cantidad = Number(nuevoItem.cantidad);
    const precioUnico = Number(nuevoItem.precioUnitario);

    const itemAAgregar = {
      ...nuevoItem,
      cantidad: cantidad,
      precioUnitario: Number(precioUnico.toFixed(2)),
      total: Number((cantidad * precioUnico).toFixed(2)),
    };

    try {
      const respuesta = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemAAgregar),
      });
      if (!respuesta.ok) throw new Error("Error al crear el producto");
      const itemGuardado = await respuesta.json();
      setBaseDatos([...baseDatos, itemGuardado]);
      cerrarModal();
    } catch (err) {
      alert("No se pudo crear el producto. " + err.message);
    }
  };

  // 3. UPDATE: Actualizar registro existente
  const actualizarDato = async (itemActualizado) => {
    const cantidad = Number(itemActualizado.cantidad);
    const precioUnico = Number(itemActualizado.precioUnitario);

    const itemAActualizar = {
      ...itemActualizado,
      cantidad: cantidad,
      precioUnitario: Number(precioUnico.toFixed(2)),
      total: Number((cantidad * precioUnico).toFixed(2)),
    };

    try {
      const respuesta = await fetch(`${URL_API}/${itemAActualizar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemAActualizar),
      });
      if (!respuesta.ok) throw new Error("Error al actualizar el producto");
      const itemGuardado = await respuesta.json();
      
      // Reemplazamos únicamente el objeto editado en el estado
      setBaseDatos(
        baseDatos.map((item) => (item.id === itemGuardado.id ? itemGuardado : item))
      );
      cerrarModal();
    } catch (err) {
      alert("No se pudo actualizar. " + err.message);
    }
  };

  // 4. DELETE: Eliminar registro
  const eliminarDato = async (id) => {
    const confirmarEliminacion = window.confirm(
      "¿Está seguro de eliminar este producto?"
    );
    if (!confirmarEliminacion) return;

    try {
      const respuesta = await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
      });
      if (!respuesta.ok) throw new Error("Error al eliminar el producto");
      
      // Filtramos la base de datos eliminando el item seleccionado
      setBaseDatos(baseDatos.filter((item) => item.id !== id));
      if (datoAEditar && datoAEditar.id === id) {
        setDatoAEditar(null);
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
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          ➕ Agregar Producto
        </button>
      </div>

      {cargando && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {error && !cargando && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!cargando && !error && (
        <CrudTable
          data={baseDatos}
          deleteData={eliminarDato}
          onEdit={abrirModalEditar}
        />
      )}

      <div
        className="modal fade"
        ref={referenciaModal}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {datoAEditar ? "✏️ Editar Producto" : "➕ Agregar Producto"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={cerrarModal}
              ></button>
            </div>
            <div className="modal-body">
              {/* Conexión directa de Props en español con CrudForm */}
              <CrudForm
                crearDato={crearDato}
                actualizarDato={actualizarDato}
                datoAEditar={datoAEditar}
                alCancelar={cerrarModal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudApp;