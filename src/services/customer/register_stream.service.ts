import { CustomerRepository } from '../../providers/adapters/customer.repository';
import { CustomerEntity } from '../../providers/entities/customer.entity';
import { ServiceProviderRepository } from '../../providers/adapters/service_provider.repository';
import * as crypto from 'crypto';

/*
  2. Refactoring
*/
type CustomerErrorMessage = { error: 'Customer not found' };
type ServiceProviderErrorMessage = { error: 'Service provider not found' };
type StreamErrorMessage = { error: 'Stream not found' };
type PickupDateErrorMessage = { error: 'Pick up date not available' };

type RegisterStreamError =
  | CustomerErrorMessage
  | ServiceProviderErrorMessage
  | StreamErrorMessage
  | PickupDateErrorMessage

export type RegisterStreamResponse =
  | CustomerEntity
  | RegisterStreamError;

export class RegisterStreamService {
  constructor(private readonly customerRepository: CustomerRepository, private readonly serviceProviderRepository: ServiceProviderRepository) {}

  public registerStream(
    customerId: string,
    streamId: string,
    serviceProviderId: string,
    pickupDate: Date,
    quantity: number,
  ): RegisterStreamResponse {
    const customer = this.customerRepository.findById(customerId);

    if (!customer) {
      return {
        error: 'Customer not found',
      };
    }

    /*
      1. Implementation & 2. Refactoring
      - How do you make sure the stream exists?
      - How do you make sure the service provider exists?
      - How do you make sure that the pickup date is available for the service provider? */

    const serviceProvider = this.serviceProviderRepository.findById(serviceProviderId);

    if (!serviceProvider) {
      return {
        error: 'Service provider not found',
      };
    }

    const coverages = serviceProvider.coverages.filter(coverage => {
      return coverage.stream.id === streamId;
    });

    if (coverages.length === 0) {
      return {
        error: 'Stream not found',
      };
    }

    const coverageAvailabilityDates = coverages
      .flatMap(
        coverage => coverage.coverage_availability
          .map(
            availability => availability.date
          )
      )

    if (!coverageAvailabilityDates.find(date => date.getTime() === pickupDate.getTime())) {
      return {
        error: 'Pick up date not available',
      };
    }

    /*
      4. Opportunities
      - How about a Rich Domain Model instead of an Anemic Domain Model?
      - How about a Domain Event to notify the service provider?
      - How about a Domain Event to notify the customer?
      - Can you spot improvements to avoid duplicates? (immutability vs mutability perhaps?)
    */

    customer.streams.push({
      id: crypto.randomUUID(),
      stream_id: streamId,
      service_provider_id: serviceProviderId,
      pickup_date: pickupDate,
      quantity: quantity,
    });

    this.customerRepository.save(customer);

    return customer;
  }
}
