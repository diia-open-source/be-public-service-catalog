import { GrpcAppAction } from '@diia-inhouse/diia-app'

import { ActionVersion, SessionType } from '@diia-inhouse/types'

import PublicCategoriesService from '@services/publicCategories'

import { ActionResult, CustomActionArguments } from '@interfaces/actions/v3/getPublicServices'

export default class GetPublicServicesAction implements GrpcAppAction {
    constructor(private readonly publicCategoriesService: PublicCategoriesService) {}

    readonly sessionType: SessionType = SessionType.User

    readonly actionVersion: ActionVersion = ActionVersion.V3

    readonly name: string = 'getPublicServices'

    async handler(args: CustomActionArguments): Promise<ActionResult> {
        const { session, headers } = args
        const { user, features = {} } = session

        return await this.publicCategoriesService.getPublicServicesCategories(user, features, headers)
    }
}
