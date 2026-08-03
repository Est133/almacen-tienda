
import { useState, useEffect } from "react";

const formularioInicial = {
  categoria: "",
  producto: "",      
  cantidad: "",
  precioUnitario: "",
  fecha: new Date().toLocaleDateString("es-AR"),
};

const CrudForm = ({ crearDato, actualizarDato, datoAEditar, alCancelar }) => {
  // Variables de estado traducidas
  const [formulario, setFormulario] = useState(formularioInicial);
  const [categorias, setCategorias] = useState([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [errorCategorias, setErrorCategorias] = useState(null);
  
  // Variable booleana para saber si editamos o creamos
  const estaEditando = Boolean(datoAEditar);

  // GET: obtener categorías desde JSON Server
  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await fetch("http://localhost:3001/categorias");
        if (!response.ok) throw new Error("Error al obtener las categorías");
        const data = await response.json();
        setCategorias(data);
        setErrorCategorias(null);
      } catch (error) {
        console.error("Error:", error);
        setErrorCategorias("No se pudieron cargar las categorías.");
      } finally {
        setCargandoCategorias(false);
      }
    };
    obtenerCategorias();
  }, []);

  // Sincronizar formulario con datoAEditar (edición)
  useEffect(() => {
    if (datoAEditar) {
      setFormulario(datoAEditar);
    } else {
      setFormulario(formularioInicial);
    }
  }, [datoAEditar]);

  // Función para leer el teclado
  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  // Función para guardar el formulario
  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!formulario.categoria || !formulario.producto || !formulario.cantidad || !formulario.precioUnitario) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const cantidadNum = Number(formulario.cantidad);
    const precioUnitarioNum = Number(formulario.precioUnitario);

    if (cantidadNum <= 0 || precioUnitarioNum <= 0) {
      alert("Cantidad y Precio Unitario deben ser mayores a 0");
      return;
    }

    if (estaEditando) {
      actualizarDato({
        ...formulario,
        cantidad: cantidadNum,
        precioUnitario: precioUnitarioNum,
      });
    } else {
      crearDato({
        ...formulario,
        cantidad: cantidadNum,
        precioUnitario: precioUnitarioNum,
        fecha: new Date().toLocaleDateString("es-AR"),
      });
    }

    setFormulario(formularioInicial);
  };

  return (
    <form onSubmit={manejarEnvio} className="row g-3">
      {/* Categoría */}
      <div className="col-md-6">
        <label className="form-label">Categoría</label>
        {cargandoCategorias ? (
          <select className="form-select" disabled>
            <option>Cargando categorías...</option>
          </select>
        ) : errorCategorias ? (
          <div className="text-danger small">{errorCategorias}</div>
        ) : (
          <select
            name="categoria"
            className="form-select"
            value={formulario.categoria}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione una categoría</option>
            {/* OJO AQUÍ: Si tu base de datos dice "nombre" en vez de "name", cámbialo abajo */}
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Producto */}
      <div className="col-md-6">
        <label className="form-label">Producto</label>
        <input
          type="text"
          name="producto"
          className="form-control"
          placeholder="Nombre del producto"
          value={formulario.producto}
          onChange={manejarCambio}
          required
        />
      </div>

      {/* Cantidad */}
      <div className="col-md-6">
        <label className="form-label">Cantidad</label>
        <input
          type="number"
          name="cantidad"
          className="form-control"
          placeholder="Cantidad"
          value={formulario.cantidad}
          onChange={manejarCambio}
          min="1"
          required
        />
      </div>

      {/* Precio Unitario */}
      <div className="col-md-6">
        <label className="form-label">Precio Unitario $</label>
        <input
          type="number"
          name="precioUnitario"
          className="form-control"
          placeholder="Precio Unitario $"
          value={formulario.precioUnitario}
          onChange={manejarCambio}
          step="0.01"
          min="0.01"
          required
        />
      </div>

      {/* Botones */}
      <div className="col-12 d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={alCancelar}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {estaEditando ? "Aceptar" : "Agregar"}
        </button>
      </div>
    </form>
  );
};

export default CrudForm;