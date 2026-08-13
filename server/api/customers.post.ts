import type { CreateCustomerInput } from '~/types'
import { addCustomer } from '../utils/customers-store'

export default eventHandler(async (event) => {
  const body = await readBody<CreateCustomerInput>(event)

  if (!body?.name || !body?.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'name and email are required'
    })
  }

  return addCustomer(body)
})
