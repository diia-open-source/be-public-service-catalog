import { GrpcAppAction } from '@diia-inhouse/diia-app'

import { ActionVersion, PublicServiceCode, SessionType } from '@diia-inhouse/types'
import { ValidationSchema } from '@diia-inhouse/validators'

import PublicService from '@services/public'

import { ActionResult, CustomActionArguments } from '@interfaces/actions/v1/getPublicServiceContextMenu'

export default class GetPublicServiceContextMenuAction implements GrpcAppAction {
    constructor(private readonly publicService: PublicService) {}

    readonly sessionType: SessionType = SessionType.None

    readonly actionVersion: ActionVersion = ActionVersion.V1

    readonly name: string = 'getPublicServiceContextMenu'

    readonly validationRules: ValidationSchema<CustomActionArguments['params']> = {
        code: { type: 'string', enum: Object.values(PublicServiceCode) },
    }

    async handler(args: CustomActionArguments): Promise<ActionResult> {
        const {
            params: { code },
        } = args

        const contextMenu = await this.publicService.getPublicServiceContextMenu(code)

        return { contextMenu }
    }
}
