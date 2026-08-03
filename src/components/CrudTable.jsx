// import CrudTableRow from "./CrudTableRow";

// const CrudTable = ({ data, onEdit, deleteData }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="text-center py-5">
//         <h5 className="text-muted">No hay productos registrados</h5>
//       </div>
//     );
//   }

//   return (
//     <div className="table-responsive">
//       {/*<table className="table table-striped table-hover"> */}
//       <table className="table table-striped table-hover table-bordered">
//         <thead className="table-dark">
//           <tr>
//             <th>Fecha</th>
//             <th>Categoría</th>
//             <th>Producto</th>
//             <th>Precio Unit.</th>
//             <th>Cantidad</th>
//             <th>Total</th>
//             <th className="text-center">Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row) => (
//             <CrudTableRow
//               key={row.id}
//               row={row}
//               onEdit={onEdit}
//               deleteData={deleteData}
//             />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CrudTable;
import CrudTableRow from "./CrudTableRow";

const CrudTable = ({ data, onEdit, deleteData }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <h5 className="text-muted">No hay productos registrados</h5>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th className="d-none d-md-table-cell">Fecha</th>
            <th className="d-none d-md-table-cell">Categoría</th>
            <th>Producto</th>
            <th className="d-none d-md-table-cell">Precio Unit.</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <CrudTableRow
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

export default CrudTable;
