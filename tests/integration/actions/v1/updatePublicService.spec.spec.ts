import { ModelNotFoundError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'

import { PublicService } from '@src/generated'

import UpdatePublicServiceAction from '@actions/v1/updatePublicService'

import publicServiceModel from '@models/publicService'

import { getApp } from '@tests/utils/getApp'

import { ActionResult } from '@interfaces/actions/v1/updatePublicService'

describe(`Action ${UpdatePublicServiceAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let action: UpdatePublicServiceAction

    const testServiceCode = 'vaccinationCertificate'
    let testService: PublicService | null

    beforeAll(async () => {
        app = await getApp()

        action = app.container.build(UpdatePublicServiceAction)

        await app.start()

        testService = await publicServiceModel.findOne({ code: testServiceCode }).lean()
    })

    afterAll(async () => {
        await app.stop()
    })

    const headers = testKit.session.getHeaders()
    const session = testKit.session.getPartnerSession()

    beforeEach(async () => {
        await publicServiceModel.updateOne({ code: testServiceCode }, { ...testService }, { upsert: true })
    })

    it('updates public service', async () => {
        const code = 'vaccinationCertificate'
        const updatePublicService = {
            name: 'New name',
            sortOrder: 999,
            segments: [],
            categories: [],
            contextMenu: [],
            sessionTypes: [],
            locales: {},
        }

        let publicServiceInDb = await publicServiceModel.findOne({ code })

        expect(publicServiceInDb!.name).not.toEqual(updatePublicService.name)
        expect(publicServiceInDb!.sortOrder).not.toEqual(updatePublicService.sortOrder)

        // Act
        const updatedPublicService: ActionResult = await action.handler({
            headers,
            session,
            params: { ...updatePublicService, code },
        })

        expect(updatedPublicService).toEqual(expect.objectContaining(updatePublicService))

        publicServiceInDb = await publicServiceModel.findOne({ code })
        expect(publicServiceInDb!.name).toEqual(updatePublicService.name)
        expect(publicServiceInDb!.sortOrder).toEqual(updatePublicService.sortOrder)
    })

    it('fails to update public service when service not found', async () => {
        const updatePublicService = {
            code: 'unknown',
            name: 'Not found',
            segments: [],
            categories: [],
            contextMenu: [],
            sessionTypes: [],
            locales: {},
        }

        // Act
        await expect(action.handler({ headers, session, params: updatePublicService })).rejects.toThrow(ModelNotFoundError)
    })
})
