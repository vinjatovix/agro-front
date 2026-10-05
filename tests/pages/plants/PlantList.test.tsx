import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { t } from '../../../src/i18n/core/t';
import PlantList from '../../../src/pages/plants/PlantList';

import { validateRequest } from '../../contract/openApiContract';
import { listPlantsResponse } from '../../fixtures/plants/listPlants';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import {
  API_URL,
  lastRequest,
  stubFetchError,
  stubFetchOk,
  type FetchMock
} from '../../test-utils/stubFetch';

const SORT_FIELD_LABEL = new RegExp(`^${t('plant.orders.field')}:?$`);

const DEFAULT_REQUEST = `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=25&sort[name]=asc`;

const [firstPlant, secondPlant] = listPlantsResponse.data;

const MULTI_PAGE_RESPONSE = {
  ...listPlantsResponse,
  pagination: { ...listPlantsResponse.pagination, totalPages: 3 }
};

function renderPlantList(route = '/plants') {
  return renderWithProviders(<PlantList />, { route });
}

async function waitForPlants() {
  return screen.findByText(new RegExp(firstPlant.identity.name.primary, 'i'));
}

function lastUrl(fetchMock: FetchMock): string {
  return lastRequest(fetchMock).url;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('PlantList', () => {
  it('pinta el estado de carga mientras llega la respuesta', () => {
    stubFetchOk(listPlantsResponse);

    renderPlantList();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('sin parámetros pide la página por defecto conforme al contrato y pinta las plantas', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    renderPlantList();

    await waitForPlants();
    expect(screen.getByText(t('plant.plants'))).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(secondPlant.identity.name.primary, 'i'))
    ).toBeInTheDocument();
    expect(lastUrl(fetchMock)).toBe(DEFAULT_REQUEST);
    expect(validateRequest('get', lastUrl(fetchMock))).toEqual([]);
  });

  it('una clave de orden fuera del contrato en la URL no llega a la petición', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    renderPlantList('/plants?sortField=identity.name.primary');

    await waitForPlants();
    expect(lastUrl(fetchMock)).toBe(DEFAULT_REQUEST);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('un 400 de la API pinta el estado de error', async () => {
    stubFetchError(400, { message: 'Invalid sort key', errors: {} });

    renderPlantList();

    expect(await screen.findByText(/invalid sort key/i)).toBeInTheDocument();
  });

  it('cambiar el límite pide la primera página con ese límite', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);
    renderPlantList('/plants?page=2');
    await waitForPlants();

    fireEvent.change(screen.getByLabelText(/resultados por página/i), {
      target: { value: '50' }
    });

    await waitFor(() => {
      expect(lastUrl(fetchMock)).toBe(
        `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=50&sort[name]=asc`
      );
    });
  });

  it('cambiar el sentido del orden pide la primera página en ese sentido', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);
    renderPlantList('/plants?page=2');
    await waitForPlants();

    fireEvent.change(screen.getByLabelText(/^orden:?$/i), {
      target: { value: 'desc' }
    });

    await waitFor(() => {
      expect(lastUrl(fetchMock)).toBe(
        `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=25&sort[name]=desc`
      );
    });
  });

  it('pulsar una página la pide', async () => {
    const fetchMock = stubFetchOk(MULTI_PAGE_RESPONSE);
    renderPlantList();
    await waitForPlants();

    fireEvent.click(screen.getAllByTestId('pagination-button-2')[0]);

    await waitFor(() => {
      expect(lastUrl(fetchMock)).toBe(
        `${API_URL}/api/v1/plants?pagination[page]=2&pagination[limit]=25&sort[name]=asc`
      );
    });
  });

  it('muestra los controles de orden con el valor de la URL', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    renderPlantList('/plants?sortField=scientificName&sortDirection=desc');

    await waitForPlants();
    expect(
      screen.getByRole('combobox', { name: SORT_FIELD_LABEL })
    ).toHaveDisplayValue(t('plant.orders.fields.scientificName'));
    expect(screen.getByRole('combobox', { name: /^orden:?$/i })).toHaveValue(
      'desc'
    );
    expect(lastUrl(fetchMock)).toContain('sort[scientificName]=desc');
  });

  it('elegir criterio y después sentido vuelve a la página 1 y combina ambos', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);
    renderPlantList('/plants?page=3');
    await waitForPlants();

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: SORT_FIELD_LABEL }),
      t('plant.orders.fields.scientificName')
    );

    await waitFor(() => {
      expect(lastUrl(fetchMock)).toBe(
        `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=25&sort[scientificName]=asc`
      );
    });
    expect(validateRequest('get', lastUrl(fetchMock))).toEqual([]);

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /^orden:?$/i }),
      'desc'
    );

    await waitFor(() => {
      expect(lastUrl(fetchMock)).toBe(
        `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=25&sort[scientificName]=desc`
      );
    });
    expect(validateRequest('get', lastUrl(fetchMock))).toEqual([]);
  });
});
