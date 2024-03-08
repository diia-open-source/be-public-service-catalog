import { ApiError, BadRequestError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'
import { PublicServiceCode } from '@diia-inhouse/types'

import CreatePublicServiceAction from '@actions/v1/createPublicService'

import publicServiceModel from '@models/publicService'

import { getApp } from '@tests/utils/getApp'

import { ActionResult } from '@interfaces/actions/v1/createPublicService'

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
        const code = PublicServiceCode.criminalRecordCertificate
        const publicService = await publicServiceModel.findOne({ code }).lean()

        await publicServiceModel.deleteOne({ code })

        let publicServiceInDb = await publicServiceModel.findOne({ code })

        expect(publicServiceInDb).toBeNull()

        // Act
        const createdPublicService: ActionResult = await action.handler({ headers, session, params: publicService! })

        expect(createdPublicService).toMatchObject(publicService!)

        publicServiceInDb = await publicServiceModel.findOne({ code })

        expect(publicServiceInDb).toBeDefined()
        expect(publicServiceInDb!.toObject()).toMatchObject(publicService!)
    })

    it('fails to create public service with unknown code', async () => {
        const headers = testKit.session.getHeaders()
        const session = testKit.session.getPartnerSession()
        const code = PublicServiceCode.criminalRecordCertificate
        const publicService = await publicServiceModel.findOne({ code }).lean()
        const serviceWithUnknownCode = { ...publicService!, code: <PublicServiceCode>'unknown' }

        // Act
        await expect(action.handler({ headers, session, params: serviceWithUnknownCode })).rejects.toThrow(ApiError)
    })

    it('fails to create public service if service already exists', async () => {
        const headers = testKit.session.getHeaders()
        const session = testKit.session.getPartnerSession()
        const code = PublicServiceCode.criminalRecordCertificate
        const publicService = await publicServiceModel.findOne({ code }).lean()

        // Act
        await expect(action.handler({ headers, session, params: publicService! })).rejects.toThrow(BadRequestError)
    })
})
