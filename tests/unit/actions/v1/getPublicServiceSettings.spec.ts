import TestKit, { mockInstance } from '@diia-inhouse/test'
import { PublicServiceCode } from '@diia-inhouse/types'

import GetPublicServiceSettingsAction from '@actions/v1/getPublicServiceSettings'

import PublicServiceService from '@services/public'

describe('Action GetPublicServiceSettingsAction', () => {
    const service = mockInstance(PublicServiceService)
    const action = new GetPublicServiceSettingsAction(service)
    const testKit = new TestKit()

    const headers = testKit.session.getHeaders()
    const code = PublicServiceCode.criminalRecordCertificate

    it('should call extractProfileFeatures and publicCategoriesService', async () => {
        await action.handler({
            params: {
                code,
            },
            headers,
        })

        expect(service.getPublicServiceByCode).toHaveBeenCalledWith(code)
    })
})
