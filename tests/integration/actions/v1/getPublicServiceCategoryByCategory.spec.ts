import { ModelNotFoundError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'
import { PublicServiceCategoryCode } from '@diia-inhouse/types'

import GetPublicServiceCategoryByCategory from '@actions/v1/getPublicServiceCategoryByCategory'

import { getApp } from '@tests/utils/getApp'

import { ActionResult } from '@interfaces/actions/v1/getPublicServiceCategoryByCategory'

describe(`Action ${GetPublicServiceCategoryByCategory.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let getPublicServiceCategoryByCategory: GetPublicServiceCategoryByCategory

    beforeAll(async () => {
        app = await getApp()

        getPublicServiceCategoryByCategory = app.container.build(GetPublicServiceCategoryByCategory)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    const headers = testKit.session.getHeaders()
    const session = testKit.session.getPartnerSession()
    const category = PublicServiceCategoryCode.certificates

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
                params: { category: <PublicServiceCategoryCode>(<unknown>'fake') },
            }),
        ).rejects.toThrow(ModelNotFoundError)
    })
})
