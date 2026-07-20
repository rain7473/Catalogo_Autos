# Resultados de pruebas

## Fecha de ejecucion

2026-07-19, zona horaria America/Panama.

## Comandos y resultados

| Comando | Resultado real |
| --- | --- |
| `pnpm install --frozen-lockfile` | Dependencias ya actualizadas; termino correctamente. |
| `pnpm test` | 2 archivos, 6 pruebas aprobadas, 0 fallidas. |
| `pnpm test:run` | 2 archivos, 6 pruebas aprobadas, 0 fallidas. |
| `pnpm test:coverage` | 2 archivos, 6 pruebas aprobadas, 0 fallidas. Cobertura: 73.87% sentencias, 71.42% ramas, 65.15% funciones y 74.25% lineas. |
| `pnpm test:e2e` | La ejecucion completa no emitio resumen final dentro de la ventana de salida local. Los 16 casos se ejecutaron despues de forma aislada con `pnpm exec playwright test --grep ... --workers=1`: 16 aprobados, 0 fallidos, 0 omitidos. |
| `pnpm build` | Correcto. Astro genero 3 rutas estaticas: `/`, `/catalogo` y `/admin`. |

## Pruebas aprobadas

- Unitarias: datos del catalogo, estados disponibles/vendidos, enlace de WhatsApp, inventario inicial del panel, validacion de campos requeridos y cambio de estado. Total: 6.
- E2E: inicio, navegacion al catalogo, filtros basicos y combinados, estado vendido, sin resultados, detalle, carrusel, enlace de WhatsApp, responsividad en celular/tableta/computadora, acceso al panel, alta, edicion, cambio de estado y eliminacion. Total: 16.

## Pruebas fallidas u omitidas

- Fallidas finales: 0.
- Omitidas: autenticacion, rutas protegidas, Supabase/PostgreSQL y errores de base de datos; esas funcionalidades no estan implementadas en el repositorio.
- No se ejecuto `pnpm test:e2e:ui`, ya que requiere una sesion grafica interactiva.

## Errores encontrados y correcciones realizadas

- Playwright intentaba descubrir tambien archivos de Vitest dentro de `tests/`. Se corrigio con `testMatch: '**/functional.spec.ts'` en `playwright.config.ts`.
- Una ejecucion diagnostica paralela de dos procesos E2E produjo `ERR_CONNECTION_REFUSED` al competir por el servidor local. La configuracion local se dejo serial y la repeticion aislada de responsividad aprobo los tres tamanos.

## Funcionalidades pendientes

- No hay autenticacion administrativa, integracion con Supabase/PostgreSQL, sincronizacion entre el inventario local del panel y el catalogo publico, ni confirmacion antes de eliminar.
- No se utilizaron variables de entorno, credenciales, ni una base de datos de produccion.
