import TestKit, { mockInstance } from '@diia-inhouse/test'

import GetPublicServiceCategoriesListAction from '@actions/v1/getPublicServiceCategoriesList'

import PublicCategoriesService from '@services/publicCategories'

describe('Action GetPublicServiceCategoriesListAction', () => {
    const service = mockInstance(PublicCategoriesService)
    const action = new GetPublicServiceCategoriesListAction(service)
    const testKit = new TestKit()
    const headers = testKit.session.getHeaders()
    const session = testKit.session.getPartnerSession()

    it('should call extractProfileFeatures and publicCategoriesService', async () => {
        const params = {
            skip: 10,
            limit: 10,
        }

        await action.handler({
            headers,
            session,
            params,
        })

        expect(service.getPublicServiceCategoriesList).toHaveBeenCalledWith(params)
    })
})
