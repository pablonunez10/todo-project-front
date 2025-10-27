# Kiki Todo - Frontend

Aplicación moderna de gestión de tareas con React, TypeScript y Tailwind CSS.

## ✨ Características

- 🔐 **Autenticación completa** - Login y registro de usuarios
- 📝 **Gestión de tareas** - Crear, completar y eliminar tareas
- 🔍 **Búsqueda en tiempo real** - Encuentra tareas rápidamente
- 🎯 **Filtros por prioridad** - Alta, media y baja
- 📊 **Dashboard con estadísticas** - Vista general de tus tareas
- 🎨 **Diseño moderno y responsive** - Interfaz amigable y bonita
- ⚡ **Experiencia fluida** - Transiciones suaves y feedback visual

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
pnpm install
```

2. **Configurar el backend:**
   - Asegúrate de que el backend esté corriendo en `http://localhost:8000`
   - Ver instrucciones en el proyecto `kiki-todo-back`

3. **Iniciar la aplicación:**
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🎯 Uso

### Login
- **Usuario demo:**
  - Email: `demo@todo.com`
  - Password: `demo123`

O crea una cuenta nueva desde el formulario de registro.

### Home
Una vez autenticado, podrás:

1. **Ver tus tareas** organizadas con:
   - Estado (completadas/pendientes)
   - Prioridad (alta/media/baja)
   - Fecha de creación

2. **Buscar tareas** usando la barra de búsqueda

3. **Filtrar por prioridad** usando el selector

4. **Crear nuevas tareas** con el botón "Nueva Tarea"

5. **Completar tareas** haciendo click en el checkbox

6. **Eliminar tareas** con el botón de basura

## 🛠️ Tecnologías

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos modernos
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificaciones
- **React Icons** - Iconos
- **Vite** - Build tool

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── context/        # Context API (AuthContext)
├── pages/          # Páginas (Login, Home)
├── services/       # API services
├── types/          # Tipos TypeScript
├── hooks/          # Custom hooks
├── App.tsx         # Componente principal
├── main.tsx        # Entry point
└── index.css       # Estilos globales
```

## 🎨 Características de Diseño

- Gradientes modernos (púrpura, rosa, rojo)
- Tarjetas con sombras suaves
- Bordes redondeados
- Transiciones animadas
- Diseño responsive
- Feedback visual en todas las acciones

## 🔒 Seguridad

- JWT tokens para autenticación
- Rutas protegidas
- Tokens almacenados en localStorage
- Interceptores de Axios para tokens

## 🚀 Próximas Mejoras

- [ ] Edición de tareas existentes
- [ ] Categorías/etiquetas para tareas
- [ ] Fechas de vencimiento
- [ ] Recordatorios
- [ ] Modo oscuro
- [ ] Drag & drop para reordenar
- [ ] Exportar tareas
- [ ] Compartir tareas entre usuarios

## 📝 Licencia

MIT
