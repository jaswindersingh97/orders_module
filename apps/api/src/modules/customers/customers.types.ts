import type {
  CustomerDto,
  PaginatedResult,
  PaginationQuery,
} from "@acme/shared";

export type ListCustomersInput = PaginationQuery;

export type ListCustomersResult = PaginatedResult<CustomerDto>;

export interface GetCustomerInput {
  customerId: number;
}

export type GetCustomerResult = CustomerDto | null;
