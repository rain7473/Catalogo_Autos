import { expect, test, type Page } from '@playwright/test';

const adminStorageKey = 'autos-la-fe-admin-vehicles';

async function gotoApp(page: Page, path: string) {
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'image') {
      await route.abort();
      return;
    }

    await route.continue();
  });
  await page.goto(path);
}

async function gotoAdmin(page: Page) {
  await gotoApp(page, '/admin');
  await page.waitForFunction((key) => window.localStorage.getItem(key), adminStorageKey);
}

test.describe('pruebas funcionales del catalogo', () => {
  test('1. ingresar a la pagina de inicio muestra la presentacion del catalogo', async ({ page }) => {
    await gotoApp(page, '/');

    await expect(page.getByRole('heading', { name: /tu pr.ximo auto/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /explorar cat.logo/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /veh.culos destacados/i })).toBeVisible();
  });

  test('2. acceder al catalogo muestra vehiculos registrados', async ({ page }) => {
    await gotoApp(page, '/');
    await page.getByRole('link', { name: /explorar cat.logo/i }).first().click();

    await expect(page).toHaveURL(/\/catalogo$/);
    await expect(page.getByRole('heading', { name: /cat.logo de veh.culos/i })).toBeVisible();
    await expect(page.locator('.vehicle-card').filter({ hasText: 'Toyota Hilux' })).toBeVisible();
    await expect(page.locator('.vehicle-card').filter({ hasText: 'Hyundai Tucson' })).toBeVisible();
  });

  test('3. aplicar filtros muestra vehiculos segun criterios seleccionados', async ({ page }) => {
    await gotoApp(page, '/catalogo');

    await page.locator('#brand-filter').selectOption('Toyota');

    await expect(page.locator('.vehicle-card').filter({ hasText: 'Toyota Hilux' })).toBeVisible();
    await expect(page.locator('.vehicle-card').filter({ hasText: 'Hyundai Tucson' })).toBeHidden();
    await expect(page.locator('#vehicle-counter')).toContainText(/1 veh.culo disponible/i);
  });

  test('4. abrir detalle de vehiculo muestra informacion completa', async ({ page }) => {
    await gotoApp(page, '/catalogo');

    await page
      .locator('.vehicle-card')
      .filter({ hasText: 'Toyota Hilux' })
      .getByRole('button', { name: /ver detalle/i })
      .click();

    const modal = page.locator('#vehicle-detail-modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: /Toyota Hilux 2021/i })).toBeVisible();
    await expect(page.locator('#vehicle-modal-price')).toContainText('$28,500');
    await expect(page.locator('#vehicle-modal-km')).toContainText('65,000 km');
    await expect(page.locator('#vehicle-modal-transmission')).toContainText(/autom/i);
    await expect(page.locator('#vehicle-modal-fuel')).toContainText('Diesel');
  });

  test('5. contactar por WhatsApp abre una conversacion con mensaje automatico', async ({ page }) => {
    await gotoApp(page, '/catalogo');

    const whatsappLink = page
      .locator('.vehicle-card')
      .filter({ hasText: 'Toyota Hilux' })
      .getByRole('link', { name: /consultar por whatsapp/i });

    const href = await whatsappLink.getAttribute('href');
    expect(href).toContain('https://wa.me/50499999999');
    expect(decodeURIComponent(href ?? '')).toContain('Hola, me interesa el Toyota Hilux 2021');
  });
});

test.describe('pruebas funcionales del panel administrativo', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.removeItem(key), adminStorageKey);
  });

  test('6. ingresar al panel administrativo muestra gestion del inventario', async ({ page }) => {
    await gotoAdmin(page);

    await expect(page.getByRole('heading', { name: /Inventario Autos La Fe/i })).toBeVisible();
    await expect(page.getByText(/^Veh.culos$/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Nuevo veh.culo/i })).toBeVisible();
  });

  test('7. registrar vehiculo agrega el nuevo registro al inventario', async ({ page }) => {
    await gotoAdmin(page);

    await page.getByRole('button', { name: /Nuevo veh.culo/i }).click();
    await expect(page.getByText(/Agregar al inventario/i)).toBeVisible();
    await page.getByLabel('Marca').fill('Mazda');
    await page.getByLabel('Modelo').fill('CX-5 Signature');
    await page.getByLabel('Año').fill('2023');
    await page.getByLabel('Kilometraje').fill('12000');
    await page.getByLabel('Precio').fill('34200');
    await page.getByRole('button', { name: /Guardar veh.culo/i }).click();

    await expect(page.getByRole('row', { name: /Mazda CX-5 Signature/i })).toBeVisible();
    await expect(page.getByRole('row', { name: /Mazda CX-5 Signature/i })).toContainText('$34,200');
  });

  test('8. editar vehiculo actualiza los datos modificados', async ({ page }) => {
    await gotoAdmin(page);

    const row = page.getByRole('row', { name: /Toyota Hilux/i });
    await row.getByRole('button', { name: /Editar/i }).click();
    await expect(page.getByText(/Editar publicaci.n/i)).toBeVisible();
    await page.getByLabel('Precio').fill('29999');
    await page.getByRole('button', { name: /Guardar veh.culo/i }).click();

    await expect(page.getByRole('row', { name: /Toyota Hilux/i })).toContainText('$29,999');
  });

  test('9. cambiar estado del vehiculo alterna entre disponible y vendido', async ({ page }) => {
    await gotoAdmin(page);

    const row = page.getByRole('row', { name: /Toyota Hilux/i });
    await row.getByRole('button', { name: /Vender/i }).click();
    await expect(page.getByRole('row', { name: /Toyota Hilux/i })).toContainText('Vendido');

    await page.getByRole('row', { name: /Toyota Hilux/i }).getByRole('button', { name: /Publicar/i }).click();
    await expect(page.getByRole('row', { name: /Toyota Hilux/i })).toContainText('Disponible');
  });

  test('10. eliminar vehiculo remueve el registro del inventario', async ({ page }) => {
    await gotoAdmin(page);

    const row = page.getByRole('row', { name: /Toyota Hilux/i });
    await row.getByRole('button', { name: /Eliminar/i }).click();

    await expect(page.getByRole('row', { name: /Toyota Hilux/i })).toHaveCount(0);
  });
});
