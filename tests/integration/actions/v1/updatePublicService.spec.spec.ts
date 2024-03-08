import { ModelNotFoundError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'
import { PublicServiceCode } from '@diia-inhouse/types'

import { PublicService } from '@src/generated'

import UpdatePublicServiceAction from '@actions/v1/updatePublicService'

import publicServiceModel from '@models/publicService'

import { getApp } from '@tests/utils/getApp'

import { ActionResult } from '@interfaces/actions/v1/updatePublicService'

describe(`Action ${UpdatePublicServiceAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let updatePublicServiceAction: UpdatePublicServiceAction

    const testServiceCode = PublicServiceCode.criminalRecordCertificate
    let testService: PublicService | null

    beforeAll(async () => {
        app = await getApp()

        updatePublicServiceAction = app.container.build(UpdatePublicServiceAction)

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
        const code = PublicServiceCode.criminalRecordCertificate
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
        const updatedPublicService: ActionResult = await updatePublicServiceAction.handler({
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
            code: <PublicServiceCode>'unknown',
            name: 'Not found',
            segments: [],
            categories: [],
            contextMenu: [],
            sessionTypes: [],
            locales: {},
        }

        // Act
        await expect(updatePublicServiceAction.handler({ headers, session, params: updatePublicService })).rejects.toThrow(
            ModelNotFoundError,
        )
    })
})
