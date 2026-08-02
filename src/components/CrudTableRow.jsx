const CrudTableRow = ({ row, onEdit, deleteData }) => {
  return (
    <tr>
      <td>{row.fecha}</td>
      <td>{row.categoria}</td>
      <td>{row.producto}</td>
      <td>${row.precioUnitario}</td>
      <td>{row.cantidad}</td>
      <td>${row.total}</td>
      <td className="text-center">
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
      </td>
    </tr>
  );
};

export default CrudTableRow;