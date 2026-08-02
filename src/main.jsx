
import React from 'react';
import ReactDOM from 'react-dom/client';
import CrudApp from '../src/pages/CrudApp';  // o './App' según tu archivo
// estilos globales
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CrudApp />
  </React.StrictMode>
);
