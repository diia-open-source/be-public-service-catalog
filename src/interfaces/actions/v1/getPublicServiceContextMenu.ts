import { ServiceActionArguments } from '@diia-inhouse/types'

import { GetPublicServiceContextMenuRequest, GetPublicServiceContextMenuResponse } from '@src/generated'

export interface CustomActionArguments extends ServiceActionArguments {
    params: GetPublicServiceContextMenuRequest
}

export type ActionResult = GetPublicServiceContextMenuResponse
