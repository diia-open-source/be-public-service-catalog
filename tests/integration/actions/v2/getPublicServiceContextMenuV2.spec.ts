import TestKit from '@diia-inhouse/test'

import GetPublicServiceContextMenuV2Action from '@src/actions/v2/getPublicServiceContextMenuV2'

import publicServiceModel from '@models/publicService'

import { getApp } from '@tests/utils/getApp'

import { ActionResult } from '@interfaces/actions/v2/getPublicServiceContextMenuV2'
import { PublicServiceModel } from '@interfaces/models/publicService'

describe(`Action ${GetPublicServiceContextMenuV2Action.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let action: GetPublicServiceContextMenuV2Action

    beforeAll(async () => {
        app = await getApp()

        action = app.container.build(GetPublicServiceContextMenuV2Action)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    it('should return settings when valid code is provided', async () => {
        // Arrange
        const headers = testKit.session.getHeaders()

        // Act
        const code = 'criminalRecordCertificate'
        const result = await action.handler({ headers, params: { code } })

        // Assert
        const publicService = <PublicServiceModel>await publicServiceModel.findOne({ code }).lean()

        expect(result).toEqual<ActionResult>({ contextMenu: publicService.contextMenu })
    })
})
