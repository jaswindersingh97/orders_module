import type {
  GetCustomerInput,
  GetCustomerResult,
  ListCustomersInput,
  ListCustomersResult,
} from "../customers.types";

export interface CustomersService {
  listCustomers(input: ListCustomersInput): Promise<ListCustomersResult>;
  getCustomer(input: GetCustomerInput): Promise<GetCustomerResult>;
}
