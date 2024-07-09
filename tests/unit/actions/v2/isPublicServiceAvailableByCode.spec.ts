import TestKit, { mockInstance } from '@diia-inhouse/test'
import { SessionType } from '@diia-inhouse/types'

import IsPublicServiceAvailableByCodeV2Action from '@actions/v2/isPublicServiceAvailableByCodeV2'

import PublicServiceService from '@services/public'

describe('Action IsPublicServiceAvailableByCodeV2Action', () => {
    const service = mockInstance(PublicServiceService)
    const action = new IsPublicServiceAvailableByCodeV2Action(service)
    const testKit = new TestKit()

    const headers = testKit.session.getHeaders()
    const code = 'public-service-code'

    it('should call extractProfileFeatures and publicCategoriesService', async () => {
        const isAvailable = true

        jest.spyOn(service, 'isPublicServiceAvailableByCode').mockResolvedValueOnce(isAvailable)

        await expect(
            action.handler({
                headers,
                params: {
                    sessionType: SessionType.User,
                    features: {},
                    code,
                },
            }),
        ).resolves.toEqual({
            isAvailable,
        })

        expect(service.isPublicServiceAvailableByCode).toHaveBeenCalledWith(code, SessionType.User, {}, headers)
    })
})
