import { PartnerActionArguments } from '@diia-inhouse/types'

import { PublicService, UpdatePublicServiceRequest } from '@src/generated'

export interface CustomActionArguments extends PartnerActionArguments {
    params: UpdatePublicServiceRequest
}

export type ActionResult = PublicService
