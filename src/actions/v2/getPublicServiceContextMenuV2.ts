import { GrpcAppAction } from '@diia-inhouse/diia-app'

import { ActionVersion, SessionType } from '@diia-inhouse/types'
import { ValidationSchema } from '@diia-inhouse/validators'

import PublicService from '@services/public'

import { ActionResult, CustomActionArguments } from '@interfaces/actions/v2/getPublicServiceContextMenuV2'

export default class GetPublicServiceContextMenuV2Action implements GrpcAppAction {
    constructor(private readonly publicService: PublicService) {}

    readonly sessionType: SessionType = SessionType.None

    readonly actionVersion: ActionVersion = ActionVersion.V2

    readonly name: string = 'getPublicServiceContextMenuV2'

    readonly validationRules: ValidationSchema<CustomActionArguments['params']> = {
        code: { type: 'string' },
    }

    async handler(args: CustomActionArguments): Promise<ActionResult> {
        const {
            params: { code },
        } = args

        const contextMenu = await this.publicService.getPublicServiceContextMenu(code)

        return { contextMenu }
    }
}
