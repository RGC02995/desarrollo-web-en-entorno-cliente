//-------------------------------------------------------------
// Clase Cita para gestionar las citas
//-------------------------------------------------------------
class Cita {
  constructor({
    fecha,
    hora,
    nombre,
    apellidos,
    dni,
    telefono,
    nacimiento,
    observaciones,
  }) {
    this.id = crypto.randomUUID();
    this.fecha = fecha;
    this.hora = hora;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.dni = dni;
    this.telefono = telefono;
    this.nacimiento = nacimiento;
    this.observaciones = observaciones || "";
  }
}

//-------------------------------------------------------------
// Variables y carga inicial
//-------------------------------------------------------------
let citas = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarCitas();
  renderizarCitasEnTabla();
});

//-------------------------------------------------------------
// Envío del formulario
//-------------------------------------------------------------
document.getElementById("new-date").addEventListener("submit", (event) => {
  event.preventDefault();
  limpiarErrores();

  const datosCita = obtenerDatosCitaFormulario();

  if (!validarDatosCita(datosCita)) {
    alert("Por favor, corrija los errores del formulario.");
    return;
  }

  const idExistente = document.getElementById("idCita").value;

  if (idExistente) {
    modificarDatosCita(idExistente, datosCita);
  } else {
    agregarNuevaCita(datosCita);
  }

  guardarEnLocalStorage();
  renderizarCitasEnTabla();
});

//-------------------------------------------------------------
// Obtener datos del formulario
//-------------------------------------------------------------
function obtenerDatosCitaFormulario() {
  return {
    fecha: document.getElementById("fecha").value,
    hora: document.getElementById("hora").value,
    nombre: document.getElementById("nombre").value.trim(),
    apellidos: document.getElementById("apellidos").value.trim(),
    dni: document.getElementById("dni").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    nacimiento: document.getElementById("nacimiento").value,
    observaciones: document.getElementById("observaciones").value,
  };
}

//-------------------------------------------------------------
// Validaciones
//-------------------------------------------------------------
function validarDatosCita({
  fecha,
  hora,
  nombre,
  apellidos,
  dni,
  telefono,
  nacimiento,
}) {
  let valido = true;

  if (!fecha) marcarError("fecha"), (valido = false);
  if (!hora) marcarError("hora"), (valido = false);
  if (!nombre || nombre.length < 2) marcarError("nombre"), (valido = false);
  if (!apellidos || apellidos.length < 2)
    marcarError("apellidos"), (valido = false);

  if (!/^[0-9]{8}[A-Za-z]$/.test(dni)) marcarError("dni"), (valido = false);
  if (!/^[0-9]{9}$/.test(telefono)) marcarError("telefono"), (valido = false);

  if (!nacimiento) marcarError("nacimiento"), (valido = false);

  return valido;
}

function marcarError(id) {
  document.getElementById(id).classList.add("error");
}

function limpiarErrores() {
  document
    .querySelectorAll(".error")
    .forEach((e) => e.classList.remove("error"));
}

//-------------------------------------------------------------
// CRUD
//-------------------------------------------------------------
function agregarNuevaCita(datos) {
  const nueva = new Cita(datos);
  citas.push(nueva);
}

function modificarDatosCita(id, datos) {
  const index = citas.findIndex((c) => c.id === id);
  if (index === -1) return;

  citas[index] = { ...citas[index], ...datos };
}

//-------------------------------------------------------------
// Tabla
//-------------------------------------------------------------
function renderizarCitasEnTabla() {
  const tbody = document.getElementById("tabla-citas");
  tbody.innerHTML = "";

  if (citas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9">No hay citas registradas</td></tr>`;
    return;
  }

  citas.forEach((cita, i) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${cita.fecha} - ${cita.hora}</td>
      <td>${cita.nombre} ${cita.apellidos}</td>
      <td>${cita.dni}</td>
      <td>${cita.telefono}</td>
      <td>${cita.nacimiento}</td>
      <td>${cita.observaciones}</td>
      <td>
        <button onclick="cargarCitaEnFormulario('${cita.id}')">Editar</button>
        <button onclick="eliminarCita('${cita.id}')">Eliminar</button>
      </td>
    `;

    tbody.appendChild(fila);
  });
}

function cargarCitaEnFormulario(id) {
  const c = citas.find((c) => c.id === id);

  document.getElementById("fecha").value = c.fecha;
  document.getElementById("hora").value = c.hora;
  document.getElementById("nombre").value = c.nombre;
  document.getElementById("apellidos").value = c.apellidos;
  document.getElementById("dni").value = c.dni;
  document.getElementById("telefono").value = c.telefono;
  document.getElementById("nacimiento").value = c.nacimiento;
  document.getElementById("observaciones").value = c.observaciones;
  document.getElementById("idCita").value = c.id;
}

function eliminarCita(id) {
  citas = citas.filter((c) => c.id !== id);
  guardarEnLocalStorage();
  renderizarCitasEnTabla();
}

//-------------------------------------------------------------
// LocalStorage
//-------------------------------------------------------------
function guardarEnLocalStorage() {
  localStorage.setItem("citas", JSON.stringify(citas));
}

function cargarCitas() {
  const data = localStorage.getItem("citas");
  citas = data ? JSON.parse(data) : [];
}
