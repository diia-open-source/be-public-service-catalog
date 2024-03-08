import { GrpcAppAction } from '@diia-inhouse/diia-app'

import {
    ActionVersion,
    AppVersions,
    PlatformType,
    ProfileFeature,
    PublicServiceCategoryCode,
    PublicServiceCode,
    PublicServiceContextMenuType,
    PublicServiceStatus,
    SessionType,
} from '@diia-inhouse/types'
import { ObjectRule, ValidationSchema } from '@diia-inhouse/validators'

import { PublicService } from '@src/generated'
import Utils from '@src/utils'

import PublicServiceService from '@services/public'

import { ActionResult, CustomActionArguments } from '@interfaces/actions/v1/updatePublicService'

export default class UpdatePublicServiceAction implements GrpcAppAction {
    private readonly appVersionValidationRules: ObjectRule<AppVersions> = {
        type: 'object',
        props: {
            versions: this.utils.toObjectValidationRule(Object.values(PlatformType), {
                type: 'array',
                items: { type: 'string' },
                optional: true,
            }),
            minVersion: this.utils.toObjectValidationRule(Object.values(PlatformType), { type: 'string', optional: true }),
            maxVersion: this.utils.toObjectValidationRule(Object.values(PlatformType), { type: 'string', optional: true }),
        },
        optional: true,
    }

    constructor(
        private readonly publicService: PublicServiceService,
        private readonly utils: Utils,
    ) {}

    readonly sessionType: SessionType = SessionType.Partner

    readonly actionVersion: ActionVersion = ActionVersion.V1

    readonly name: string = 'updatePublicService'

    readonly validationRules: ValidationSchema<Omit<CustomActionArguments['params'], 'locales'>> = {
        code: { type: 'string', enum: Object.values(PublicServiceCode) },
        categories: {
            type: 'array',
            items: { type: 'string' },
            enum: Object.values(PublicServiceCategoryCode),
            optional: true,
        },
        name: { type: 'string', optional: true },
        status: { type: 'string', enum: Object.values(PublicServiceStatus), optional: true },
        sortOrder: { type: 'number', convert: true, optional: true },
        contextMenu: {
            type: 'array',
            items: {
                type: 'object',
                props: {
                    type: { type: 'string', enum: Object.values(PublicServiceContextMenuType) },
                    name: { type: 'string' },
                    code: { type: 'string', optional: true },
                    appVersions: this.appVersionValidationRules,
                },
            },
            optional: true,
        },
        appVersions: this.utils.toObjectValidationRule(Object.values(SessionType), this.appVersionValidationRules),
        segments: { type: 'array', items: { type: 'string' }, optional: true },
        sessionTypes: { type: 'array', items: { type: 'string', enum: Object.values(SessionType) }, optional: true },
        platformMinVersion: this.utils.toObjectValidationRule(Object.values(PlatformType), { type: 'string', optional: true }),
        profileFeature: { type: 'string', enum: Object.values(ProfileFeature), optional: true },
    }

    async handler(args: CustomActionArguments): Promise<ActionResult> {
        const { params: service } = args

        return await this.publicService.updatePublicService(<Partial<PublicService>>service)
    }
}
