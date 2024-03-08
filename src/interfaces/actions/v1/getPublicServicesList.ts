import { PartnerActionArguments } from '@diia-inhouse/types'

import { GetPublicServicesListRequest, GetPublicServicesListResponse } from '@src/generated'

export interface CustomActionArguments extends PartnerActionArguments {
    params: GetPublicServicesListRequest
}

export type ActionResult = GetPublicServicesListResponse
