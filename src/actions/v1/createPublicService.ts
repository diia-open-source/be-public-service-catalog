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

import Utils from '@src/utils'

import PublicService from '@services/public'

import { ActionResult, CustomActionArguments } from '@interfaces/actions/v1/createPublicService'

export default class CreatePublicServiceAction implements GrpcAppAction {
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
        private readonly publicService: PublicService,
        private readonly utils: Utils,
    ) {}

    readonly sessionType: SessionType = SessionType.Partner

    readonly actionVersion: ActionVersion = ActionVersion.V1

    readonly name: string = 'createPublicService'

    readonly validationRules: ValidationSchema = {
        code: { type: 'string', enum: Object.values(PublicServiceCode) },
        name: { type: 'string' },
        status: { type: 'string', enum: Object.values(PublicServiceStatus) },
        sortOrder: { type: 'number', convert: true },
        sessionTypes: { type: 'array', items: { type: 'string', enum: Object.values(SessionType) } },
        categories: {
            type: 'array',
            items: { type: 'string' },
            enum: Object.values(PublicServiceCategoryCode),
            optional: true,
        },
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
        segments: { type: 'array', items: { type: 'string' }, optional: true },
        availableMinVersion: { type: 'any', optional: true },
        availableVersions: { type: 'any', optional: true },
        appVersions: { type: 'any', optional: true },
        locales: { type: 'any', optional: true },
        profileFeature: { type: 'string', enum: Object.values(ProfileFeature), optional: true },
    }

    async handler(args: CustomActionArguments): Promise<ActionResult> {
        const { params: service } = args

        return await this.publicService.createPublicService(service)
    }
}
