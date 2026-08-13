import type { CreateCustomerInput, User } from '~/types'

export function getCustomers() {
  return $fetch<User[]>('/api/customers')
}

export function createCustomer(input: CreateCustomerInput) {
  return $fetch<User>('/api/customers', {
    method: 'POST',
    body: input
  })
}

export function deleteCustomers(ids: number[]) {
  return $fetch<{ success: true }>('/api/customers', {
    method: 'DELETE',
    body: { ids }
  })
}
