import { removeCustomers } from '../utils/customers-store'

export default eventHandler(async (event) => {
  const { ids } = await readBody<{ ids: number[] }>(event)

  if (!Array.isArray(ids)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ids must be an array of customer ids'
    })
  }

  removeCustomers(ids)

  return { success: true }
})
