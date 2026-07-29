const CrudTableRow = ({ row, onEdit, deleteData }) => {
  return (
    <tr>
      <td>{row.date}</td>
      <td>{row.category}</td>
      <td>{row.product}</td>
      <td>${row.unitPrice}</td>
      <td>{row.quantity}</td>
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