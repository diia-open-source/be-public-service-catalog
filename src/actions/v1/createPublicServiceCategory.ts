import { GrpcAppAction } from '@diia-inhouse/diia-app'

import { ActionVersion, PublicServiceCategoryCode, SessionType } from '@diia-inhouse/types'
import { ValidationSchema } from '@diia-inhouse/validators'

import { PublicServiceCategoryStatus } from '@src/generated'

import PublicCategoriesService from '@services/publicCategories'

import { ActionResult, CustomActionArguments } from '@interfaces/actions/v1/createPublicServiceCategory'

export default class CreatePublicServiceCategoryAction implements GrpcAppAction {
    constructor(private readonly publicCategoriesService: PublicCategoriesService) {}

    readonly sessionType: SessionType = SessionType.Partner

    readonly actionVersion: ActionVersion = ActionVersion.V1

    readonly name: string = 'createPublicServiceCategory'

    readonly validationRules: ValidationSchema = {
        category: { type: 'string', enum: Object.values(PublicServiceCategoryCode) },
        name: { type: 'string' },
        icon: { type: 'string' },
        status: { type: 'string', enum: Object.values(PublicServiceCategoryStatus) },
        sortOrder: { type: 'number', convert: true },
        locales: { type: 'any', optional: true },
    }

    async handler(args: CustomActionArguments): Promise<ActionResult> {
        const { params: publicServiceCategory } = args

        return await this.publicCategoriesService.createCategory(publicServiceCategory)
    }
}
