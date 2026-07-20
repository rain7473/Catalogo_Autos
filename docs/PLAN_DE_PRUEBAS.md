# Plan de pruebas

## Objetivo

Validar las funciones implementadas del catalogo de Autos La Fe sin usar servicios externos, datos de produccion ni credenciales.

## Alcance

Se cubren el inicio, navegacion al catalogo, filtros, modal de detalle, enlaces de WhatsApp y operaciones locales del panel administrativo. El catalogo usa los datos estaticos de `src/vehiculos.ts`; el panel guarda sus cambios en `localStorage` del navegador.

## Herramientas y tipos de prueba

- Vitest, jsdom y React Testing Library para datos del catalogo y comportamiento del componente `AdminDashboard`.
- Playwright para navegacion, filtros, modal, responsividad y operaciones administrativas de extremo a extremo.
- Cobertura V8 mediante Vitest.

## Casos cubiertos

- Datos: identificadores, campos requeridos, estados y configuracion del enlace de WhatsApp.
- Inicio: presentacion y acceso al catalogo.
- Catalogo: tarjetas disponibles, filtros por marca, anio, precio, transmision, combustible y estado, limpieza y caso sin resultados.
- Detalle: datos del vehiculo, carrusel, cierre con Escape y enlace de WhatsApp especifico del vehiculo.
- Administracion: campos obligatorios, alta, edicion, cambio de estado y eliminacion dentro del inventario local.
- Responsividad: 390x844, 768x1024 y 1440x900; visibilidad de contenido, acceso a filtros y ausencia de desplazamiento horizontal.

## Funcionalidades pendientes o no implementadas

- No hay autenticacion, login, cierre de sesion, proteccion de rutas ni redireccion de usuarios.
- No hay integracion con Supabase, PostgreSQL ni otra base de datos; por tanto no se crean mocks de esas operaciones.
- El catalogo publico se genera desde datos estaticos. Los cambios del panel administrativo quedan en el `localStorage` del navegador y no se sincronizan con el catalogo publico.
- La eliminacion actual no incluye dialogo de confirmacion.

## Ejecucion

```powershell
pnpm install --frozen-lockfile
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm build
```

`pnpm test:e2e:ui` abre la interfaz de Playwright para ejecucion local. En CI se instala Chromium de Playwright; en ejecucion local, la configuracion utiliza Chrome instalado cuando esta disponible.

## Variables de entorno y proteccion de produccion

No se requieren variables de entorno para estas pruebas. No se realizan solicitudes a Supabase ni se usan credenciales, tokens, bases de datos de produccion o archivos `.env`.
