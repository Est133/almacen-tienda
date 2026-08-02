import { useState, useEffect } from "react";

const initialForm = {
  categoria: "",
  producto: "",      
  cantidad: "",
  precioUnitario: "",
  fecha: new Date().toLocaleDateString("es-AR"),
};

const CrudForm = ({ createData, updateData, dataToEdit, onCancel }) => {
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const isEditing = Boolean(dataToEdit);

  // GET: obtener categorías desde JSON Server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3001/categories");
        if (!response.ok) throw new Error("Error al obtener las categorías");
        const data = await response.json();
        setCategories(data);
        setErrorCategories(null);
      } catch (error) {
        console.error("Error:", error);
        setErrorCategories("No se pudieron cargar las categorías.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Sincronizar formulario con dataToEdit (edición)
  useEffect(() => {
    if (dataToEdit) {
      setForm(dataToEdit);
    } else {
      setForm(initialForm);
    }
  }, [dataToEdit]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.categoria || !form.producto || !form.cantidad || !form.precioUnitario) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const quantityNum = Number(form.cantidad);
    const unitPriceNum = Number(form.precioUnitario);

    if (quantityNum <= 0 || unitPriceNum <= 0) {
      alert("Cantidad y Precio Unitario deben ser mayores a 0");
      return;
    }

    if (isEditing) {
      updateData({
        ...form,
        cantidad: quantityNum,
        precioUnitario: unitPriceNum,
      });
    } else {
      createData({
        ...form,
        cantidad: quantityNum,
        precioUnitario: unitPriceNum,
        fecha: new Date().toLocaleDateString("es-AR"),
      });
    }

    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      {/* Categoría */}
      <div className="col-md-6">
        <label className="form-label">Categoría</label>
        {loadingCategories ? (
          <select className="form-select" disabled>
            <option>Cargando categorías...</option>
          </select>
        ) : errorCategories ? (
          <div className="text-danger small">{errorCategories}</div>
        ) : (
          <select
            name="categoria"
            className="form-select"
            value={form.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((cat) => (
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
          value={form.producto}
          onChange={handleChange}
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
          value={form.cantidad}
          onChange={handleChange}
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
          value={form.precioUnitario}
          onChange={handleChange}
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
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Aceptar" : "Agregar"}
        </button>
      </div>
    </form>
  );
};

export default CrudForm;