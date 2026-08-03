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
        <div className="d-flex justify-content-center gap-1">
          <button className="btn btn-warning btn-sm" onClick={() => onEdit(row)}>
            ✏️ <span className="d-none d-md-inline">Editar</span>
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => deleteData(row.id)}>
            🗑️ <span className="d-none d-md-inline">Eliminar</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CrudTableRow;