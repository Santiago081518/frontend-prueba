# 🏥 Portal de Prescripciones Médicas — Frontend

![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

Interfaz moderna y responsiva para la gestión de prescripciones médicas digitales. Conecta con el [backend de prescripciones](#) para ofrecer a médicos, pacientes y administradores flujos de trabajo diferenciados según su rol, con validación QR pública para farmacias.

---

## ✨ Características Principales

| Característica                 | Descripción                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------- |
| 🛡️ **Protección de Rutas**     | Middleware y guards de rol (RBAC) que previenen accesos no autorizados       |
| 📊 **Dashboard Visual**        | Gráficos dinámicos con Recharts para métricas administrativas en tiempo real |
| 📱 **Diseño Responsive**       | Adaptabilidad completa a móvil y escritorio con Tailwind CSS                 |
| 📄 **Visor de Prescripciones** | Consulta detallada de recetas y gestión de descargas PDF                     |
| 🔍 **Verificación QR**         | Página pública para validar autenticidad de recetas por escaneo              |
| 🔔 **Feedback en Tiempo Real** | Notificaciones inmediatas de éxito/error con Sonner                          |

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 14 — App Router](https://nextjs.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Lenguaje:** TypeScript
- **Gestión de Estado:** React Hooks (Context / useState)
- **Visualización:** [Recharts](https://recharts.org/)
- **Iconos:** Lucide React
- **HTTP:** Axios con interceptores para adjuntar JWT automáticamente
- **Notificaciones:** Sonner

---

## 📂 Estructura del Proyecto

```text
src/
├── app/
│   ├── (auth)/        # Login y registro de usuarios
│   ├── (dashboard)/   # Vistas protegidas por rol (Admin, Médico, Paciente)
│   ├── verify/        # Ruta pública de validación por QR
│   └── layout.tsx     # Proveedores globales y configuración de UI
├── components/        # Componentes reutilizables: modales, tablas, gráficos
├── lib/               # Configuración de Axios e instancias de API
├── hooks/             # Hooks personalizados de autenticación y fetching
└── types/             # Tipos TypeScript compartidos con la API
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js >= 18
- Backend configurado y en ejecución (ver [repositorio del backend](#))
- npm o yarn

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url-front>
cd <nombre-del-proyecto-front>
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

> ⚠️ Asegúrate de que `.env.local` esté en `.gitignore` antes de hacer push.

### 3. Iniciar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 🔐 Acceso por Roles

| Ruta           | Descripción                                 | Acceso        |
| -------------- | ------------------------------------------- | ------------- |
| `/admin`       | Dashboard de métricas y gestión de usuarios | Administrador |
| `/doctor`      | Listado y creación de nuevas recetas        | Médico        |
| `/patient`     | Bandeja de entrada y descarga de PDF        | Paciente      |
| `/verify/[id]` | Validación pública de autenticidad vía QR   | Público       |

---

## 📝 Decisiones de Implementación

**Interceptores de Axios:** Configurados para adjuntar automáticamente el `Bearer Token` en cada petición tras el login, y para redirigir al login si el servidor retorna `401`.

**Flujo de Verificación QR:** El PDF generado por el backend incluye un QR que codifica una URL única apuntando a `/verify/[id]`. Cualquier farmacia puede escanearla para confirmar la validez de la receta sin necesidad de autenticación.

**Separación de layouts por rol:** Cada grupo de rutas en `(dashboard)/` tiene su propio layout con navegación adaptada al perfil del usuario, evitando renderizado condicional complejo en componentes individuales.

---

_Desarrollado con ❤️ como prueba técnica — 2026_
