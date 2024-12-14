import { ServiceProviderEntity } from '../entities/service_provider.entity';

//1. Implementation
export class ServiceProviderRepository {
  constructor(private serviceProviders: ServiceProviderEntity[] = []) {
    this.serviceProviders = serviceProviders;
  }

  public get(): ServiceProviderEntity[] {
    return this.serviceProviders;
  }

  public findById(id: string): ServiceProviderEntity | undefined {
    return this.serviceProviders.find(serviceProvider => serviceProvider.id === id);
  }
}
