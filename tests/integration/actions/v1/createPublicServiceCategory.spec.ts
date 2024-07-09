import { randomUUID } from 'node:crypto'

import { Document } from '@diia-inhouse/db'
import { BadRequestError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'

import { PublicServiceCategory, PublicServiceCategoryStatus } from '@src/generated'

import CreatePublicServiceCategoryAction from '@actions/v1/createPublicServiceCategory'

import publicServiceCategoryModel from '@models/publicServiceCategory'

import { getApp } from '@tests/utils/getApp'

describe(`Action ${CreatePublicServiceCategoryAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let action: CreatePublicServiceCategoryAction

    beforeAll(async () => {
        app = await getApp()

        action = app.container.build(CreatePublicServiceCategoryAction)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    const headers = testKit.session.getHeaders()
    const session = testKit.session.getPartnerSession()

    it('creates new public service category', async () => {
        const category = `public-service-category-code-${randomUUID()}`
        const params = {
            category,
            name: 'public-servicve-category-name',
            icon: 'i',
            status: PublicServiceCategoryStatus.active,
            sortOrder: 100500,
            tabCodes: [],
            locales: { en: 'en' },
        }

        // Act
        const createdPublicServiceCategory = <Document<unknown, object, PublicServiceCategory>>(<unknown>await action.handler({
            headers,
            session,
            params,
        }))

        expect(createdPublicServiceCategory.toObject()).toMatchObject(params)

        const publicServiceCategoryInDb = await publicServiceCategoryModel.findOne({ category }).lean()

        expect(publicServiceCategoryInDb).toBeDefined()
        expect(publicServiceCategoryInDb).toMatchObject(params)

        await publicServiceCategoryModel.deleteOne({ category })
    })

    it('fails to create public service category if category already exists', async () => {
        const category = `public-service-category-code-${randomUUID()}`

        await publicServiceCategoryModel.create({
            category,
            name: 'public-servicve-category-name',
            icon: 'i',
            status: PublicServiceCategoryStatus.active,
            sortOrder: 100500,
        })

        const publicServiceCategory = await publicServiceCategoryModel.findOne({ category }).lean()

        // Act
        await expect(action.handler({ headers, session, params: publicServiceCategory! })).rejects.toThrow(BadRequestError)

        await publicServiceCategoryModel.deleteOne({ category })
    })
})
