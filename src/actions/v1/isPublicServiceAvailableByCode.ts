import { GrpcAppAction } from '@diia-inhouse/diia-app'

import { ActionVersion, DiiaOfficeStatus, ProfileFeature, PublicServiceCode, SessionType } from '@diia-inhouse/types'
import { ValidationSchema } from '@diia-inhouse/validators'

import PublicService from '@services/public'

import { ActionResult, CustomActionArguments } from '@interfaces/actions/v1/isPublicServiceAvailableByCode'

export default class IsPublicServiceAvailableByCodeAction implements GrpcAppAction {
    constructor(private readonly publicService: PublicService) {}

    readonly sessionType: SessionType = SessionType.None

    readonly actionVersion: ActionVersion = ActionVersion.V1

    readonly name: string = 'isPublicServiceAvailableByCode'

    readonly validationRules: ValidationSchema = {
        code: { type: 'string', enum: Object.values(PublicServiceCode) },
        sessionType: { type: 'string', enum: Object.values(SessionType) },
        features: {
            type: 'object',
            optional: true,
            props: {
                [ProfileFeature.office]: {
                    type: 'object',
                    optional: true,
                    props: {
                        officeIdentifier: { type: 'string' },
                        profileId: { type: 'string' },
                        organizationId: { type: 'string' },
                        unitId: { type: 'string' },
                        isOrganizationAdmin: { type: 'boolean' },
                        scopes: { type: 'array', items: { type: 'string' } },
                        status: { type: 'string', enum: Object.values(DiiaOfficeStatus) },
                        tokenError: { type: 'string', optional: true },
                        tokenFailedAt: { type: 'date', convert: true, optional: true },
                        googleWorkspace: { type: 'string', optional: true },
                    },
                },
            },
        },
    }

    async handler(args: CustomActionArguments): Promise<ActionResult> {
        const {
            params: { code, sessionType, features = {} },
            headers,
        } = args

        const isAvailable = await this.publicService.isPublicServiceAvailableByCode(code, sessionType, features, headers)

        return {
            isAvailable,
        }
    }
}
