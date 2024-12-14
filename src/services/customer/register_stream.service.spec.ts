import { RegisterStreamService } from './register_stream.service';
import { CustomerRepository } from '../../providers/adapters/customer.repository';
import { ServiceProviderRepository } from '../../providers/adapters/service_provider.repository';

//3. Testability
describe('RegisterStreamService', () => {
  let customerRepository: CustomerRepository;
  let registerStreamService: RegisterStreamService;
  let serviceProviderRepository: ServiceProviderRepository;

  beforeEach(() => {
    customerRepository = new CustomerRepository();
    serviceProviderRepository = new ServiceProviderRepository()
    registerStreamService = new RegisterStreamService(customerRepository, serviceProviderRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerStream', () => {
    const customer = {
      id: 'customer-id',
      name: 'customer-name',
      address: 'customer-address',
      streams: [],
    }

    const serviceProvider = {
      id: 'service-provider-id',
      name: 'service-provider-name',
      address: 'service-provider-address',
      coverages: [
        {
        id: 'coverage-id-1',
        stream: {
          id: 'stream-id',
          label: 'stream-label',
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
      }],
    }

    it(`should throw an error if the customer doesn't exist`, () => {
      jest.spyOn(customerRepository, 'findById').mockReturnValueOnce(undefined);

      const response = registerStreamService.registerStream(
        'customer-id',
        'stream-id',
        'service-provider-id',
        new Date(),
        5,
      );

      expect(response).toEqual({
        error: 'Customer not found',
      });
      expect(customerRepository.findById).toHaveBeenCalledWith('customer-id');
    });

    it(`should throw an error if the stream doesn't exist`, () => {
      jest.spyOn(customerRepository, 'findById').mockReturnValueOnce(customer);

      jest.spyOn(serviceProviderRepository, 'findById').mockReturnValueOnce(serviceProvider);

      const response = registerStreamService.registerStream(
        'customer-id',
        'other-stream-id',
        'service-provider-id',
        new Date(),
        5,
      );

      expect(response).toEqual({
        error: 'Stream not found',
      });
      expect(serviceProviderRepository.findById).toHaveBeenCalledWith('service-provider-id');
    });

    it(`should throw an error if the service provider doesn't exist`, () => {
      jest.spyOn(customerRepository, 'findById').mockReturnValueOnce(customer);

      jest.spyOn(serviceProviderRepository, 'findById').mockReturnValueOnce(undefined);

      const response = registerStreamService.registerStream(
        'customer-id',
        'stream-id',
        'other-service-provider-id',
        new Date(),
        5,
      );

      expect(response).toEqual({
        error: 'Service provider not found',
      });
      expect(serviceProviderRepository.findById).toHaveBeenCalledWith('other-service-provider-id');
    });

    it(`should throw an error if the pickup date is not available for the service provider`, () => {
      jest.spyOn(customerRepository, 'findById').mockReturnValueOnce(customer);

      jest.spyOn(serviceProviderRepository, 'findById').mockReturnValueOnce(serviceProvider);

      const response = registerStreamService.registerStream(
        'customer-id',
        'stream-id',
        'service-provider-id',
        new Date('2023-11-01'),
        5,
      );

      expect(response).toEqual({
        error: 'Pick up date not available',
      });
      expect(serviceProviderRepository.findById).toHaveBeenCalledWith('service-provider-id');
    });

    it(`should register the stream`, () => {
      jest.spyOn(customerRepository, 'findById').mockReturnValueOnce(customer);

      jest.spyOn(customerRepository, 'save').mockReturnValueOnce(undefined);

      jest.spyOn(serviceProviderRepository, 'findById').mockReturnValueOnce(serviceProvider);

      const response = registerStreamService.registerStream(
        'customer-id',
        'stream-id',
        'service-provider-id',
        new Date('2023-10-01'),
        5,
      );

      expect(response).toEqual({
        id: 'customer-id',
        name: 'customer-name',
        address: 'customer-address',
        streams: [
          {
            id: expect.any(String),
            stream_id: 'stream-id',
            service_provider_id: 'service-provider-id',
            pickup_date: new Date('2023-10-01'),
            quantity: 5,
          },
        ],
      });
    });

    //4. Opportunities
    it(`should update the previous stream if it already exists`, () => {});
  });
});
