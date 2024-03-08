import { PublicServiceSettings, ServiceActionArguments } from '@diia-inhouse/types'

import { PublicServiceSettingsRequest } from '@src/generated'

export interface CustomActionArguments extends ServiceActionArguments {
    params: PublicServiceSettingsRequest
}

export type ActionResult = PublicServiceSettings
