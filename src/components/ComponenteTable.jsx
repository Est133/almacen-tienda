import TableRow from "./ComponenteTableRow";

const Table = ({ data, onEdit, deleteData }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <h5 className="text-muted">No hay productos registrados</h5>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Fecha</th>
            <th>Categoría</th>
            <th>Producto</th>
            <th>Precio Unit.</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              onEdit={onEdit}
              deleteData={deleteData}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
