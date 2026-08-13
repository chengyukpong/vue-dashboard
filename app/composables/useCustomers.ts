import type { CreateCustomerInput, User } from '~/types'

export function useCustomers() {
  const data = useState<User[]>('customers', () => [])
  const status = useState<'idle' | 'pending' | 'success' | 'error'>('customers-status', () => 'idle')

  async function refresh() {
    status.value = 'pending'
    try {
      data.value = await getCustomers()
      status.value = 'success'
    } catch {
      data.value = []
      status.value = 'error'
    }
  }

  async function create(input: CreateCustomerInput) {
    const customer = await createCustomer(input)
    await refresh()
    return customer
  }

  async function remove(ids: number[]) {
    await deleteCustomers(ids)
    await refresh()
  }

  return {
    data,
    status,
    refresh,
    create,
    remove
  }
}
