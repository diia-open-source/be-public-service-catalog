import { GrpcAppAction } from '@diia-inhouse/diia-app'

import { ActionVersion, SessionType } from '@diia-inhouse/types'
import { ValidationSchema } from '@diia-inhouse/validators'

import PublicServiceService from '@services/public'

import { ActionResult, CustomActionArguments } from '@interfaces/actions/v2/getPublicServiceSettingsV2'

export default class GetPublicServiceSettingsV2Action implements GrpcAppAction {
    constructor(private readonly publicService: PublicServiceService) {}

    readonly sessionType: SessionType = SessionType.None

    readonly actionVersion: ActionVersion = ActionVersion.V2

    readonly name: string = 'getPublicServiceSettingsV2'

    readonly validationRules: ValidationSchema<CustomActionArguments['params']> = {
        code: { type: 'string' },
    }

    async handler(args: CustomActionArguments): Promise<ActionResult> {
        const {
            params: { code },
        } = args

        return await this.publicService.getPublicServiceByCode(code)
    }
}
