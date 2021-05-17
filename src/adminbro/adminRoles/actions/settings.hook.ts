import { ActionRequest } from 'admin-bro'

export const before = async (request: ActionRequest): Promise<ActionRequest> => {
  if (request.payload) {
    let id = 0
    while (request.payload['roleSettings.' + id + '.canShow']) {
      request.payload['roleSettings.' + id + '.canShow'] =
        request.payload['roleSettings.' + id + '.canShow'] === 'true'
      request.payload['roleSettings.' + id + '.canEdit'] =
        request.payload['roleSettings.' + id + '.canEdit'] === 'true'
      request.payload['roleSettings.' + id + '.canCreate'] =
        request.payload['roleSettings.' + id + '.canCreate'] === 'true'
      request.payload['roleSettings.' + id + '.canDelete'] =
        request.payload['roleSettings.' + id + '.canDelete'] === 'true'
      request.payload['roleSettings.' + id + '.canShowList'] =
        request.payload['roleSettings.' + id + '.canShowList'] === 'true'
      id++
    }
  }
  return request
}
