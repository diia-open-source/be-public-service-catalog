import { PartnerActionArguments } from '@diia-inhouse/types'

import { PublicServiceCategory, UpdatePublicServiceCategoryRequest } from '@src/generated'

export interface CustomActionArguments extends PartnerActionArguments {
    params: UpdatePublicServiceCategoryRequest
}

export type ActionResult = PublicServiceCategory
