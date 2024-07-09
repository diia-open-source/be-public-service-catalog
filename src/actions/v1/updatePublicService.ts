import { GrpcAppAction } from '@diia-inhouse/diia-app'

import {
    ActionVersion,
    AppVersions,
    PlatformType,
    ProfileFeature,
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
    constructor(private readonly publicService: PublicServiceService) {}

    readonly sessionType: SessionType = SessionType.Partner

    readonly actionVersion: ActionVersion = ActionVersion.V1

    readonly name: string = 'updatePublicService'

    private readonly appVersionValidationRules: ObjectRule<AppVersions> = {
        type: 'object',
        props: {
            versions: Utils.toObjectValidationRule(Object.values(PlatformType), {
                type: 'array',
                items: { type: 'string' },
                optional: true,
            }),
            minVersion: Utils.toObjectValidationRule(Object.values(PlatformType), { type: 'string', optional: true }),
            maxVersion: Utils.toObjectValidationRule(Object.values(PlatformType), { type: 'string', optional: true }),
        },
        optional: true,
    }

    readonly validationRules: ValidationSchema<Omit<CustomActionArguments['params'], 'locales'>> = {
        code: { type: 'string' },
        categories: {
            type: 'array',
            items: { type: 'string' },
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
        appVersions: Utils.toObjectValidationRule(Object.values(SessionType), this.appVersionValidationRules),
        segments: { type: 'array', items: { type: 'string' }, optional: true },
        sessionTypes: { type: 'array', items: { type: 'string', enum: Object.values(SessionType) }, optional: true },
        platformMinVersion: Utils.toObjectValidationRule(Object.values(PlatformType), { type: 'string', optional: true }),
        profileFeature: { type: 'string', enum: Object.values(ProfileFeature), optional: true },
    }

    async handler(args: CustomActionArguments): Promise<ActionResult> {
        const { params: service } = args

        return await this.publicService.updatePublicService(<Partial<PublicService>>service)
    }
}
