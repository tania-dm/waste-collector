import { ServiceProviderRepository } from '../../providers/adapters/service_provider.repository';

/*
  1. Implementation
  - How do you find the available service providers?
  - How to model correctly the response according to the expectation?
*/

type ServiceProviderAvailabilityServiceResponse = {
  serviceProviderName: string,
  streamIds: string[]
}

export class ServiceProviderAvailabilityService {
  constructor(private serviceProviderRepository: ServiceProviderRepository) {
    this.serviceProviderRepository = serviceProviderRepository;
  }

  public findAvailabilityAt(postalCode: string, date: Date): ServiceProviderAvailabilityServiceResponse[] {
    const serviceProviders = this.serviceProviderRepository.get();

    const availableServiceProviders = serviceProviders.reduce((acc, serviceProvider) => {
      const serviceProviderCoverages = serviceProvider.coverages;
      const response: ServiceProviderAvailabilityServiceResponse = {
        serviceProviderName: serviceProvider.name,
        streamIds: []
      }

      const coveragesForPostcode = serviceProviderCoverages.filter(coverage => {
        return Number(coverage.postal_code_start) < Number(postalCode) && Number(coverage.postal_code_end) > Number(postalCode);
      })

      response.streamIds = coveragesForPostcode.reduce((acc, coverage) => {
        const dateAvailable = coverage.coverage_availability.find(availability => date.getTime() === availability.date.getTime());

        if (dateAvailable) {
          acc.push(coverage.stream.label);
        }
        return acc;
      }, [] as string[])

      if (response.streamIds.length > 0) {
       acc.push(response);
      }

      return acc;
    }, [] as ServiceProviderAvailabilityServiceResponse[])

    return availableServiceProviders;
  }
}
