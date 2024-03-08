import { ApiError, BadRequestError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'
import { PublicServiceCategoryCode } from '@diia-inhouse/types'

import CreatePublicServiceCategoryAction from '@actions/v1/createPublicServiceCategory'

import publicServiceCategoryModel from '@models/publicServiceCategory'

import { getApp } from '@tests/utils/getApp'

import { ActionResult } from '@interfaces/actions/v1/createPublicServiceCategory'

describe(`Action ${CreatePublicServiceCategoryAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let createPublicServiceCategoryAction: CreatePublicServiceCategoryAction

    beforeAll(async () => {
        app = await getApp()

        createPublicServiceCategoryAction = app.container.build(CreatePublicServiceCategoryAction)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    const headers = testKit.session.getHeaders()
    const session = testKit.session.getPartnerSession()
    const categoryCode = PublicServiceCategoryCode.certificates

    it('creates new public service category', async () => {
        const publicServiceCategory = await publicServiceCategoryModel.findOne({ category: categoryCode }).lean()

        await publicServiceCategoryModel.deleteOne({ category: categoryCode })

        let publicServiceCategoryInDb = await publicServiceCategoryModel.findOne({ category: categoryCode })

        expect(publicServiceCategoryInDb).toBeNull()

        // Act
        const createdPublicServiceCategory: ActionResult = await createPublicServiceCategoryAction.handler({
            headers,
            session,
            params: publicServiceCategory!,
        })

        expect(createdPublicServiceCategory).toMatchObject(publicServiceCategory!)

        publicServiceCategoryInDb = await publicServiceCategoryModel.findOne({ category: categoryCode })

        expect(publicServiceCategoryInDb).toBeDefined()
        expect(publicServiceCategoryInDb!.toObject()).toMatchObject(publicServiceCategory!)
    })

    it('fails to create category with unknown category code', async () => {
        const publicServiceCategory = await publicServiceCategoryModel.findOne({ category: categoryCode }).lean()
        const categoryWithUnknownCode = { ...publicServiceCategory!, category: <PublicServiceCategoryCode>'unknown' }

        // Act
        await expect(createPublicServiceCategoryAction.handler({ headers, session, params: categoryWithUnknownCode })).rejects.toThrow(
            ApiError,
        )
    })

    it('fails to create public service category if category already exists', async () => {
        const publicServiceCategory = await publicServiceCategoryModel.findOne({ category: categoryCode }).lean()

        // Act
        await expect(createPublicServiceCategoryAction.handler({ headers, session, params: publicServiceCategory! })).rejects.toThrow(
            BadRequestError,
        )
    })
})
