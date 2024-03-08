import { GrpcAppAction } from '@diia-inhouse/diia-app'

import { ActionVersion, SessionType } from '@diia-inhouse/types'
import { ValidationSchema, getListValidationSchema } from '@diia-inhouse/validators'

import PublicService from '@services/public'

import { ActionResult, CustomActionArguments } from '@interfaces/actions/v1/getPublicServicesList'

export default class GetPublicServicesListAction implements GrpcAppAction {
    constructor(private readonly publicService: PublicService) {}

    readonly sessionType: SessionType = SessionType.Partner

    readonly actionVersion: ActionVersion = ActionVersion.V1

    readonly name: string = 'getPublicServicesList'

    readonly validationRules: ValidationSchema<CustomActionArguments['params']> = getListValidationSchema()

    async handler(args: CustomActionArguments): Promise<ActionResult> {
        const {
            params: { skip = 0, limit = 100 },
        } = args

        return await this.publicService.getPublicServicesList({ skip, limit })
    }
}
