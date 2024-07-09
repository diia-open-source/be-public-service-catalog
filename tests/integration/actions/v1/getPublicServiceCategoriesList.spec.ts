import TestKit from '@diia-inhouse/test'

import GetPublicServiceCategoriesListAction from '@actions/v1/getPublicServiceCategoriesList'

import { getApp } from '@tests/utils/getApp'

describe(`Action ${GetPublicServiceCategoriesListAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let getPublicServiceCategoriesList: GetPublicServiceCategoriesListAction

    beforeAll(async () => {
        app = await getApp()

        getPublicServiceCategoriesList = app.container.build(GetPublicServiceCategoriesListAction)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    const headers = testKit.session.getHeaders()
    const session = testKit.session.getPartnerSession()

    it('get all public service categories without skip and limit', async () => {
        // Act
        const publicServiceCategoriesList = await getPublicServiceCategoriesList.handler({ session, headers, params: {} })

        // Assert
        expect(publicServiceCategoriesList).toBeDefined()
        const { publicServiceCategories } = publicServiceCategoriesList

        expect(publicServiceCategories.length).toBeLessThanOrEqual(100)
    })

    it('get limit public service categories', async () => {
        const limit = 10

        // Act
        const publicServiceCategoriesList = await getPublicServiceCategoriesList.handler({ session, headers, params: { limit } })

        // Assert
        expect(publicServiceCategoriesList).toBeDefined()
        const { publicServiceCategories } = publicServiceCategoriesList

        expect(publicServiceCategories.length).toBeLessThanOrEqual(limit)
    })
})
