import { ModelNotFoundError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'

import GetPublicServiceCategoryByCategoryAction from '@actions/v1/getPublicServiceCategoryByCategory'

import { getApp } from '@tests/utils/getApp'

import { ActionResult } from '@interfaces/actions/v1/getPublicServiceCategoryByCategory'

describe(`Action ${GetPublicServiceCategoryByCategoryAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let getPublicServiceCategoryByCategory: GetPublicServiceCategoryByCategoryAction

    beforeAll(async () => {
        app = await getApp()

        getPublicServiceCategoryByCategory = app.container.build(GetPublicServiceCategoryByCategoryAction)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    const headers = testKit.session.getHeaders()
    const session = testKit.session.getPartnerSession()
    const category = 'carServices'

    it('get public service category by category', async () => {
        // Act
        const publicServiceCategory: ActionResult = await getPublicServiceCategoryByCategory.handler({
            headers,
            session,
            params: { category },
        })

        // // Assert
        expect(publicServiceCategory).toBeDefined()
    })

    it("get throw if didn't find public service category by category", async () => {
        // Act
        await expect(
            getPublicServiceCategoryByCategory.handler({
                headers,
                session,
                params: { category: 'fake' },
            }),
        ).rejects.toThrow(ModelNotFoundError)
    })
})
