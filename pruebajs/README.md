Proyecto: Gestión de Eventos
Este proyecto permite gestionar usuarios y eventos, con roles de administrador y visitante. Los administradores pueden crear, editar y eliminar eventos; los visitantes pueden inscribirse en eventos según disponibilidad.

Requisitos
Node.js instalado en tu sistema.
json-server instalado globalmente (npm install -g json-server).
Navegador web 
Estructura de archivos
index.html: Interfaz principal de la aplicación.
app.js: Lógica de la aplicación en JavaScript.
db.json: Base de datos simulada para usuarios y eventos.
Instalación y ejecución
1. Clona o descarga el proyecto
Coloca todos los archivos en una carpeta local.

2. Instala json-server (si no lo tienes)
npm install -g json-server
3. Inicia el servidor de datos
Desde la carpeta del proyecto, ejecuta:

json-server --watch db.json --port 3000
Esto levantará una API REST en http://localhost:3000 con los endpoints /usuarios y /eventos.

4. Abre la aplicación
Abre el archivo index.html en tu navegador (puedes hacer doble clic o abrirlo desde VS Code con Live Server).

Uso de la aplicación
Ingreso:
Ingresa con un usuario existente (ver db.json para usuarios de ejemplo) o crea una cuenta nueva.
Registro:
Elige el rol: visitante o administrador.
Dashboard:
Si eres administrador, puedes crear, editar y eliminar eventos.
Si eres visitante, puedes inscribirte en eventos con cupo disponible.
Buscar eventos:
Usa el buscador para filtrar eventos por nombre.
Cerrar sesión:
Haz clic en "Salir" para cerrar sesión y volver a la pantalla de ingreso.
Notas
No requiere base de datos real; todo se guarda en db.json mientras el servidor esté corriendo.
Si tienes problemas, asegúrate de que el puerto 3000 esté libre y que json-server esté corriendo.

coder: Jeronimo betancur betancur
Hopper
jeronimobetancurbetancur0@gmail.com
1038866922