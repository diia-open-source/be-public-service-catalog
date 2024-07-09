import { ModelNotFoundError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'

import GetPublicServiceByCodeAction from '@actions/v1/getPublicServiceByCode'

import { getApp } from '@tests/utils/getApp'

import { ActionResult } from '@interfaces/actions/v1/getPublicServiceByCode'

describe(`Action ${GetPublicServiceByCodeAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let getPublicServiceByCode: GetPublicServiceByCodeAction

    beforeAll(async () => {
        app = await getApp()

        getPublicServiceByCode = app.container.build(GetPublicServiceByCodeAction)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    const headers = testKit.session.getHeaders()
    const session = testKit.session.getPartnerSession()
    const code = 'poll'

    it('get public service by code', async () => {
        // Act
        const publicService: ActionResult = await getPublicServiceByCode.handler({ headers, session, params: { code } })

        // // Assert
        expect(publicService).toBeDefined()
    })

    it("get throw if didn't find public service by code", async () => {
        // Act
        await expect(getPublicServiceByCode.handler({ headers, session, params: { code: 'fake' } })).rejects.toThrow(ModelNotFoundError)
    })
})
