import TestKit from '@diia-inhouse/test'

import GetPublicServiceSettingsV2Action from '@src/actions/v2/getPublicServiceSettingsV2'

import publicServiceModel from '@models/publicService'

import { getApp } from '@tests/utils/getApp'

import { ActionResult } from '@interfaces/actions/v2/getPublicServiceSettingsV2'
import { PublicServiceModel } from '@interfaces/models/publicService'

describe(`Action ${GetPublicServiceSettingsV2Action.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let getPublicServiceSettingsAction: GetPublicServiceSettingsV2Action

    beforeAll(async () => {
        app = await getApp()

        getPublicServiceSettingsAction = app.container.build(GetPublicServiceSettingsV2Action)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    it('should return settings when valid code is provided', async () => {
        // Arrange
        const headers = testKit.session.getHeaders()

        // Act
        const code = 'penalties'
        const result = await getPublicServiceSettingsAction.handler({ headers, params: { code } })

        // Assert
        const publicService = <PublicServiceModel>await publicServiceModel.findOne({ code }).lean()

        expect(result).toEqual<ActionResult>({
            id: publicService._id.toString(),
            categories: publicService.categories,
            code,
            name: publicService.name,
            status: publicService.status,
            segments: publicService.segments,
            contextMenu: publicService.contextMenu,
            appVersions: publicService.appVersions,
            platformMinVersion: publicService.platformMinVersion,
            sessionTypes: publicService.sessionTypes,
            sortOrder: publicService.sortOrder,
            locales: publicService.locales,
            profileFeature: publicService.profileFeature,
        })
    })
})
