import { ModelNotFoundError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'

import { PublicServiceCategory } from '@src/generated'

import UpdatePublicServiceCategoryAction from '@actions/v1/updatePublicServiceCategory'

import publicServiceCategoryModel from '@models/publicServiceCategory'

import { getApp } from '@tests/utils/getApp'

import { ActionResult } from '@interfaces/actions/v1/updatePublicServiceCategory'

describe(`Action ${UpdatePublicServiceCategoryAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let action: UpdatePublicServiceCategoryAction

    const testCategoryCode = 'medicalServices'
    let testCategory: PublicServiceCategory | null

    beforeAll(async () => {
        app = await getApp()

        action = app.container.build(UpdatePublicServiceCategoryAction)

        await app.start()

        testCategory = await publicServiceCategoryModel.findOne({ category: testCategoryCode }).lean()
    })

    afterAll(async () => {
        await app.stop()
    })

    const headers = testKit.session.getHeaders()
    const session = testKit.session.getPartnerSession()

    beforeEach(async () => {
        await publicServiceCategoryModel.updateOne({ category: testCategoryCode }, { ...testCategory }, { upsert: true })
    })

    it('updates public service category', async () => {
        const category = 'medicalServices'
        const updatePublicServiceCategory = { name: 'New name', sortOrder: 999, tabCodes: [], locales: {} }

        let publicServiceCategoryInDb = await publicServiceCategoryModel.findOne({ category })

        expect(publicServiceCategoryInDb!.name).not.toEqual(updatePublicServiceCategory.name)
        expect(publicServiceCategoryInDb!.sortOrder).not.toEqual(updatePublicServiceCategory.sortOrder)

        // Act
        const result: ActionResult = await action.handler({
            headers,
            session,
            params: { ...updatePublicServiceCategory, category },
        })

        expect(result).toEqual(expect.objectContaining(updatePublicServiceCategory))

        publicServiceCategoryInDb = await publicServiceCategoryModel.findOne({ category })
        expect(publicServiceCategoryInDb!.name).toEqual(updatePublicServiceCategory.name)
        expect(publicServiceCategoryInDb!.sortOrder).toEqual(updatePublicServiceCategory.sortOrder)
    })

    it('fails to update public service when service not found', async () => {
        const updatePublicService = { category: 'unknown', name: 'Not found', tabCodes: [], locales: {} }

        // Act
        await expect(action.handler({ headers, session, params: updatePublicService })).rejects.toThrow(ModelNotFoundError)
    })
})
