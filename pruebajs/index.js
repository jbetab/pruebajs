const API = "http://localhost:3000";

// Elementos
const $ = id => document.getElementById(id);
const UI = {
  vistas: {
    login: $("vistaLogin"),
    registro: $("vistaRegistro"),
    dashboard: $("vistaDashboard")
  },
  formularios: {
    login: $("formLogin"),
    registro: $("formRegistro"),
    evento: $("formEvento")
  },
  enlaces: {
    irRegistro: $("irRegistro"),
    irLogin: $("irLogin"),
    cerrarSesion: $("btnCerrarSesion")
  },
  dashboard: {
    bienvenida: $("mensajeBienvenida"),
    buscador: $("buscadorEvento"),
    panelAdmin: $("panelAdmin"),
    listaEventos: $("listaEventos")
  }
};

// Vistas
function mostrarVista(nombre) {
  Object.entries(UI.vistas).forEach(([key, el]) => {
    el.style.display = key === nombre ? "block" : "none";
  });
}

// Usuario
const Usuario = {
  obtener: () => JSON.parse(localStorage.getItem("usuario")),
  guardar: u => localStorage.setItem("usuario", JSON.stringify(u)),
  limpiar: () => localStorage.removeItem("usuario")
};

// Navegación
function configurarNavegacion() {
  UI.enlaces.irRegistro.onclick = e => { e.preventDefault(); mostrarVista("registro"); };
  UI.enlaces.irLogin.onclick = e => { e.preventDefault(); mostrarVista("login"); };
  UI.enlaces.cerrarSesion.onclick = () => { Usuario.limpiar(); mostrarVista("login"); };
}

// Registro
function configurarRegistro() {
  UI.formularios.registro.onsubmit = async e => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(UI.formularios.registro).entries());
    const res = await fetch(`${API}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    if (res.ok) {
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      mostrarVista("login");
    }
  };
}

// Login
function configurarLogin() {
  UI.formularios.login.onsubmit = async e => {
    e.preventDefault();
    const { usuario, contraseña } = Object.fromEntries(new FormData(UI.formularios.login).entries());
    const res = await fetch(`${API}/usuarios?usuario=${usuario}&contraseña=${contraseña}`);
    const datos = await res.json();
    if (datos.length) {
      Usuario.guardar(datos[0]);
      mostrarVista("dashboard");
      Dashboard.iniciar();
    } else {
      alert("credenciales incorrectas");
    }
  };
}

// Dashboard
const Dashboard = {
  iniciar() {
    const usuario = Usuario.obtener();
    UI.dashboard.bienvenida.textContent = `Bienvenido, ${usuario.usuario}`;
    UI.dashboard.panelAdmin.style.display = usuario.rol === "administrador" ? "block" : "none";
    this.cargarEventos();
    if (UI.formularios.evento) UI.formularios.evento.onsubmit = this.crearEvento.bind(this);
    if (UI.dashboard.buscador) UI.dashboard.buscador.oninput = this.cargarEventos.bind(this);
  },
  async cargarEventos() {
    const res = await fetch(`${API}/eventos`);
    const eventos = await res.json();
    this.mostrarEventos(eventos);
  },
  mostrarEventos(eventos) {
    const usuario = Usuario.obtener();
    const filtro = UI.dashboard.buscador.value.toLowerCase();
    UI.dashboard.listaEventos.innerHTML = "";
    eventos.filter(e => e.titulo.toLowerCase().includes(filtro)).forEach(evento => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${evento.titulo}</strong> (Capacidad: ${evento.capacidad})<br>`;
      if (usuario.rol === "visitante") this.botonesVisitante(li, evento, usuario);
      if (usuario.rol === "administrador") this.botonesAdmin(li, evento);
      UI.dashboard.listaEventos.appendChild(li);
    });
  },
  botonesVisitante(li, evento, usuario) {
    const btn = document.createElement("button");
    const inscrito = evento.asistentes?.includes(usuario.usuario);
    const cupo = (evento.asistentes?.length || 0) < evento.capacidad;
    if (inscrito) {
      btn.textContent = "ya esta inscrito";
      btn.disabled = true;
    } else if (!cupo) {
      btn.textContent = "todo lleno";
      btn.disabled = true;
    } else {
      btn.textContent = "entrarse al evento";
      btn.onclick = async () => {
        const nuevos = [...(evento.asistentes || []), usuario.usuario];
        await fetch(`${API}/eventos/${evento.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ asistentes: nuevos })
        });
        this.cargarEventos();
      };
    }
    li.appendChild(btn);
  },
  botonesAdmin(li, evento) {
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.onclick = async () => {
      const nuevoTitulo = prompt("Nuevo título:", evento.titulo);
      const nuevaCapacidad = prompt("Nueva capacidad:", evento.capacidad);
      if (nuevoTitulo && nuevaCapacidad) {
        await fetch(`${API}/eventos/${evento.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: nuevoTitulo,
            capacidad: parseInt(nuevaCapacidad)
          })
        });
        this.cargarEventos();
      }
    };
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.onclick = async () => {
      if (confirm("¿Estás seguro de eliminar este evento?")) {
        await fetch(`${API}/eventos/${evento.id}`, { method: "DELETE" });
        this.cargarEventos();
      }
    };
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
  },
  async crearEvento(e) {
    e.preventDefault();
    const { titulo, capacidad } = Object.fromEntries(new FormData(UI.formularios.evento).entries());
    await fetch(`${API}/eventos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, capacidad: parseInt(capacidad), asistentes: [] })
    });
    UI.formularios.evento.reset();
    this.cargarEventos();
  }
};

// Inicialización
function iniciarApp() {
  configurarNavegacion();
  configurarRegistro();
  configurarLogin();
  const sesion = Usuario.obtener();
  if (sesion) {
    mostrarVista("dashboard");
    Dashboard.iniciar();
  } else {
    mostrarVista("login");
  }
}

iniciarApp();