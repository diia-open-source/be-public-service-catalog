import TestKit from '@diia-inhouse/test'
import { PublicServiceCode } from '@diia-inhouse/types'

import GetPublicServiceContextMenuAction from '@src/actions/v1/getPublicServiceContextMenu'

import publicServiceModel from '@models/publicService'

import { getApp } from '@tests/utils/getApp'

import { ActionResult } from '@interfaces/actions/v1/getPublicServiceContextMenu'
import { PublicServiceModel } from '@interfaces/models/publicService'

describe(`Action ${GetPublicServiceContextMenuAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let action: GetPublicServiceContextMenuAction

    beforeAll(async () => {
        app = await getApp()

        action = app.container.build(GetPublicServiceContextMenuAction)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    it('should return settings when valid code is provided', async () => {
        // Arrange
        const headers = testKit.session.getHeaders()

        // Act
        const code = PublicServiceCode.criminalRecordCertificate
        const result = await action.handler({ headers, params: { code } })

        // Assert
        const publicService = <PublicServiceModel>await publicServiceModel.findOne({ code }).lean()

        expect(result).toEqual<ActionResult>({ contextMenu: publicService.contextMenu })
    })
})
