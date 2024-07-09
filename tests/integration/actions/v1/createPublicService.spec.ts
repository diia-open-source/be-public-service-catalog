import { randomUUID } from 'node:crypto'

import { Document } from '@diia-inhouse/db'
import { BadRequestError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'
import { PublicServiceStatus, SessionType } from '@diia-inhouse/types'

import { PublicService } from '@src/generated'

import CreatePublicServiceAction from '@actions/v1/createPublicService'

import publicServiceModel from '@models/publicService'

import { getApp } from '@tests/utils/getApp'

describe(`Action ${CreatePublicServiceAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let action: CreatePublicServiceAction

    beforeAll(async () => {
        app = await getApp()

        action = app.container.build(CreatePublicServiceAction)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    it('creates new public service', async () => {
        const headers = testKit.session.getHeaders()
        const session = testKit.session.getPartnerSession()
        const code = `public-service-code-${randomUUID()}`
        const params = {
            code,
            categories: [`public-service-category-code-${randomUUID()}`],
            name: 'public-service-name',
            status: PublicServiceStatus.active,
            sortOrder: 134,
            segments: [],
            sessionTypes: [SessionType.User],
            locales: { en: 'en' },
            contextMenu: [],
        }

        // Act
        const createdPublicService = <Document<unknown, object, PublicService>>(<unknown>await action.handler({ headers, session, params }))

        expect(createdPublicService.toObject()).toMatchObject(params)

        const publicServiceInDb = await publicServiceModel.findOne({ code })

        expect(publicServiceInDb).toBeDefined()
        expect(publicServiceInDb!.toObject()).toMatchObject(params)

        await publicServiceModel.deleteOne({ code })
    })

    it('fails to create public service if service already exists', async () => {
        const headers = testKit.session.getHeaders()
        const session = testKit.session.getPartnerSession()
        const code = `public-service-code-${randomUUID()}`

        await publicServiceModel.create({
            code,
            categories: [`public-service-category-code-${randomUUID()}`],
            name: 'public-service-name',
            status: PublicServiceStatus.active,
            sortOrder: 134,
            segments: [],
            sessionTypes: [SessionType.User],
            locales: { en: 'en' },
            contextMenu: [],
        })

        const publicService = await publicServiceModel.findOne({ code }).lean()

        // Act
        await expect(action.handler({ headers, session, params: publicService! })).rejects.toThrow(BadRequestError)

        await publicServiceModel.deleteOne({ code })
    })
})
