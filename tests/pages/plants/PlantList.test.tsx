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
  errorResponse,
  lastRequest,
  okResponse,
  stubFetchError,
  stubFetchOk,
  stubFetchSequence,
  type FetchMock
} from '../../test-utils/stubFetch';

const LIST_FIELDS = 'fields[plants]=identity,traits,image,status';

const SORT_FIELD_LABEL = new RegExp(`^${t('plant.orders.field')}:?$`);

const DEFAULT_REQUEST = `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=25&sort[name]=asc&${LIST_FIELDS}`;

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

  it('un 400 de la API pinta el estado de error sin el texto del back', async () => {
    stubFetchError(400, { message: 'Invalid sort key', errors: {} });

    renderPlantList();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(t('errors.badRequest.message'));
    expect(alert).not.toHaveTextContent(/invalid sort key/i);
  });

  it('un fallo de red explica que no hay conexión y no muestra texto técnico', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('Failed to fetch')))
    );

    renderPlantList();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(t('errors.offline.message'));
    expect(alert).not.toHaveTextContent(/failed to fetch/i);
  });

  it.each([
    ['un 500 con cuerpo', { message: 'Internal Server Error' }],
    ['un 500 sin cuerpo', undefined]
  ])('%s explica que el servicio no está disponible', async (_label, body) => {
    stubFetchError(500, body);

    renderPlantList();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(t('errors.unavailable.message'));
    expect(alert).not.toHaveTextContent(/internal server error|500/i);
  });

  it('reintentar tras un error carga las plantas sin recargar la página', async () => {
    stubFetchSequence(
      errorResponse(500, { message: 'Internal Server Error' }),
      okResponse(listPlantsResponse)
    );
    renderPlantList();

    await userEvent.click(
      await screen.findByRole('button', { name: t('errors.actions.retry') })
    );

    await waitForPlants();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('conserva las plantas cargadas si falla un refresco', async () => {
    stubFetchSequence(
      okResponse(listPlantsResponse),
      errorResponse(500, { message: 'Internal Server Error' })
    );
    const { queryClient } = renderPlantList();
    await waitForPlants();

    await queryClient.refetchQueries();

    expect(
      screen.getByText(new RegExp(firstPlant.identity.name.primary, 'i'))
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
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
        `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=50&sort[name]=asc&${LIST_FIELDS}`
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
        `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=25&sort[name]=desc&${LIST_FIELDS}`
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
        `${API_URL}/api/v1/plants?pagination[page]=2&pagination[limit]=25&sort[name]=asc&${LIST_FIELDS}`
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
    expect(lastUrl(fetchMock)).toContain(LIST_FIELDS);
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
        `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=25&sort[scientificName]=asc&${LIST_FIELDS}`
      );
    });
    expect(validateRequest('get', lastUrl(fetchMock))).toEqual([]);

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /^orden:?$/i }),
      'desc'
    );

    await waitFor(() => {
      expect(lastUrl(fetchMock)).toBe(
        `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=25&sort[scientificName]=desc&${LIST_FIELDS}`
      );
    });
    expect(validateRequest('get', lastUrl(fetchMock))).toEqual([]);
  });

  it('un límite no soportado en la URL se corrige a 25 en el selector y en la petición', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    renderPlantList('/plants?limit=37');

    await waitForPlants();
    expect(screen.getByLabelText(/resultados por página/i)).toHaveValue('25');
    expect(lastUrl(fetchMock)).toBe(DEFAULT_REQUEST);
  });

  it('una página sin resultados muestra el estado vacío, no un error', async () => {
    stubFetchOk({
      data: [],
      pagination: { page: 999, limit: 25, totalPages: 1, totalItems: 2 }
    });

    renderPlantList('/plants?page=999');

    expect(await screen.findByText(t('plant.empty'))).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('marca las plantas comestibles y tóxicas con una sola petición', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    renderPlantList();

    await waitForPlants();
    expect(screen.getAllByRole('img', { name: 'Tóxica' })).toHaveLength(2);
    expect(screen.getAllByRole('img', { name: 'Comestible' })).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('un filtro booleano sin resultados muestra el estado vacío', async () => {
    const fetchMock = stubFetchOk({
      data: [],
      pagination: { page: 1, limit: 25, totalPages: 1, totalItems: 0 }
    });

    renderPlantList('/plants?edible=false');

    expect(await screen.findByText(t('plant.empty'))).toBeInTheDocument();
    expect(lastUrl(fetchMock)).toContain('filter[edible][eq]=false');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
