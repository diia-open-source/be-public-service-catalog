import { GrpcAppAction } from '@diia-inhouse/diia-app'

import { ActionVersion, PublicServiceCode, SessionType } from '@diia-inhouse/types'
import { ValidationSchema } from '@diia-inhouse/validators'

import PublicServiceService from '@services/public'

import { ActionResult, CustomActionArguments } from '@interfaces/actions/v1/getPublicServiceSettings'

export default class GetPublicServiceSettingsAction implements GrpcAppAction {
    constructor(private readonly publicService: PublicServiceService) {}

    readonly sessionType: SessionType = SessionType.None

    readonly actionVersion: ActionVersion = ActionVersion.V1

    readonly name: string = 'getPublicServiceSettings'

    readonly validationRules: ValidationSchema<CustomActionArguments['params']> = {
        code: { type: 'string', enum: Object.values(PublicServiceCode) },
    }

    async handler(args: CustomActionArguments): Promise<ActionResult> {
        const {
            params: { code },
        } = args

        return await this.publicService.getPublicServiceByCode(code)
    }
}
