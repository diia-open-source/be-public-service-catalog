import TestKit, { mockInstance } from '@diia-inhouse/test'

import GetPublicServiceSettingsV2Action from '@actions/v2/getPublicServiceSettingsV2'

import PublicServiceService from '@services/public'

describe('Action GetPublicServiceSettingsV2Action', () => {
    const service = mockInstance(PublicServiceService)
    const action = new GetPublicServiceSettingsV2Action(service)
    const testKit = new TestKit()

    const headers = testKit.session.getHeaders()
    const code = 'public-service-code'

    it('should call extractProfileFeatures and publicCategoriesService', async () => {
        await action.handler({
            params: { code },
            headers,
        })

        expect(service.getPublicServiceByCode).toHaveBeenCalledWith(code)
    })
})
