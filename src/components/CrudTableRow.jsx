// 
const CrudTableRow = ({ row, onEdit, deleteData }) => {
  return (
    <tr>
      <td className="d-none d-md-table-cell">{row.fecha}</td>
      <td className="d-none d-md-table-cell">{row.categoria}</td>
      <td>{row.producto}</td>
      <td className="d-none d-md-table-cell">${row.precioUnitario}</td>
      <td>{row.cantidad}</td>
      <td>${row.total}</td>
      <td className="text-center">
<<<<<<< HEAD
        <div className="d-flex justify-content-center gap-1">
          <button className="btn btn-warning btn-sm" onClick={() => onEdit(row)}>
            ✏️ <span className="d-none d-md-inline">Editar</span>
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => deleteData(row.id)}>
            🗑️ <span className="d-none d-md-inline">Eliminar</span>
          </button>
        </div>
=======
        <button
          className="btn btn-sm btn-warning me-2"
          onClick={() => onEdit(row)}
        >
          ✏️ Editar
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => deleteData(row.id)}
          
        >
          🗑️ Eliminar
        </button>
>>>>>>> 5b5967f25fc560894562777455dc61d9f0153b13
      </td>
    </tr>
  );
};

export default CrudTableRow;