import { ServiceProviderAvailabilityService } from './service_provider_availability.service';
import { ServiceProviderRepository } from '../../providers/adapters/service_provider.repository';

//3. Testability
describe('ServiceProviderAvailabilityService', () => {
  let serviceProviderRepository: ServiceProviderRepository;
  let serviceProviderAvailabilityService: ServiceProviderAvailabilityService;

  beforeEach(() => {
    serviceProviderRepository = new ServiceProviderRepository();
    serviceProviderAvailabilityService = new ServiceProviderAvailabilityService(
      serviceProviderRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAvailabilityAt', () => {
    const serviceProviders = [
      {
        id: 'service-provider-id-1',
        name: 'Rewaste',
        address: 'Stationplein, 1, 1012 AB Amsterdam',
        coverages: [
          {
            id: 'coverage-id-1',
            stream: {
              id: 'stream-id-1',
              label: 'paper',
            },
            postal_code_start: '1010',
            postal_code_end: '1020',
            coverage_availability: [
              {
                id: 'coverage-availability-1',
                date: new Date('2023-10-01'),
              },
              {
                id: 'coverage-availability-2',
                date: new Date('2023-10-02'),
              }
            ]
          }, {
            id: 'coverage-id-2',
            stream: {
              id: 'stream-id-2',
              label: 'metal',
            },
            postal_code_start: '1010',
            postal_code_end: '1020',
            coverage_availability: [
              {
                id: 'coverage-availability-1',
                date: new Date('2023-10-01'),
              },
              {
                id: 'coverage-availability-2',
                date: new Date('2023-10-04'),
              }
            ]
          }
        ]
      },
      {
        id: 'service-provider-id-2',
        name: 'Bluecollection',
        address: 'Prins Hendrikkade, 1, 1012 JD Amsterdam',
        coverages: [
          {
            id: 'coverage-id-1',
            stream: {
              id: 'stream-id-1',
              label: 'metal',
            },
            postal_code_start: '1000',
            postal_code_end: '9999',
            coverage_availability: [
              {
                id: 'coverage-availability-1',
                date: new Date('2023-10-01'),
              },
              {
                id: 'coverage-availability-2',
                date: new Date('2023-10-02'),
              },
              {
                id: 'coverage-availability-2',
                date: new Date('2023-10-03'),
              }
            ]
          },
        ]
      }
    ]
    it(`should return empty list if no service providers are available for postal code '999'`, () => {

      jest.spyOn(serviceProviderRepository, 'get').mockReturnValueOnce(serviceProviders);

      const response = serviceProviderAvailabilityService.findAvailabilityAt('999', new Date('2023-10-01'));

      expect(response).toEqual([]);
    });

    it(`should return empty list if no service providers are available at date '2023-10-10'`, () => {
      jest.spyOn(serviceProviderRepository, 'get').mockReturnValueOnce(serviceProviders);

      const response = serviceProviderAvailabilityService.findAvailabilityAt('1000', new Date('2023-10-10'));

      expect(response).toEqual([]);
    });

    it(`should return a list of service providers that are available for postal code '1015' at date '2023-10-01'`, () => {
      jest.spyOn(serviceProviderRepository, 'get').mockReturnValueOnce(serviceProviders);

      const response = serviceProviderAvailabilityService.findAvailabilityAt('1015', new Date('2023-10-01'));

      expect(response).toEqual(expect.arrayContaining([{
        serviceProviderName: serviceProviders[0].name,
        streamIds: [serviceProviders[0].coverages[0].stream.label, serviceProviders[0].coverages[1].stream.label]
      }]));
    });
  });
});
