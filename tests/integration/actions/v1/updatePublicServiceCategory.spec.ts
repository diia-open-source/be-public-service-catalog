import { ModelNotFoundError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'
import { PublicServiceCategoryCode } from '@diia-inhouse/types'

import { PublicServiceCategory } from '@src/generated'

import UpdatePublicServiceCategoryAction from '@actions/v1/updatePublicServiceCategory'

import publicServiceCategoryModel from '@models/publicServiceCategory'

import { getApp } from '@tests/utils/getApp'

import { ActionResult } from '@interfaces/actions/v1/updatePublicServiceCategory'

describe(`Action ${UpdatePublicServiceCategoryAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let updatePublicServiceCategoryAction: UpdatePublicServiceCategoryAction

    const testCategoryCode = PublicServiceCategoryCode.medicalServices
    let testCategory: PublicServiceCategory | null

    beforeAll(async () => {
        app = await getApp()

        updatePublicServiceCategoryAction = app.container.build(UpdatePublicServiceCategoryAction)

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

    it('updates public service category and invalidates cache', async () => {
        const category: PublicServiceCategoryCode = PublicServiceCategoryCode.certificates
        const updatePublicServiceCategory = { name: 'New name', sortOrder: 999, tabCodes: [], locales: {} }

        let publicServiceCategoryInDb = await publicServiceCategoryModel.findOne({ category })

        expect(publicServiceCategoryInDb!.name).not.toEqual(updatePublicServiceCategory.name)
        expect(publicServiceCategoryInDb!.sortOrder).not.toEqual(updatePublicServiceCategory.sortOrder)

        // Act
        const result: ActionResult = await updatePublicServiceCategoryAction.handler({
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
        const updatePublicService = { category: <PublicServiceCategoryCode>'unknown', name: 'Not found', tabCodes: [], locales: {} }

        // Act
        await expect(updatePublicServiceCategoryAction.handler({ headers, session, params: updatePublicService })).rejects.toThrow(
            ModelNotFoundError,
        )
    })
})
