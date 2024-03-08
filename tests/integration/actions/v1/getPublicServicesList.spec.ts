import TestKit from '@diia-inhouse/test'

import GetPublicServicesList from '@actions/v1/getPublicServicesList'

import publicServiceModel from '@models/publicService'

import { getApp } from '@tests/utils/getApp'

describe(`Action ${GetPublicServicesList.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let getPublicServicesList: GetPublicServicesList

    beforeAll(async () => {
        app = await getApp()

        getPublicServicesList = app.container.build(GetPublicServicesList)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    const headers = testKit.session.getHeaders()
    const session = testKit.session.getPartnerSession()

    it('get all public services without skip and limit', async () => {
        // Act
        const [publicServicesList, countDocs] = await Promise.all([
            getPublicServicesList.handler({ session, params: {}, headers }),
            publicServiceModel.countDocuments(),
        ])

        // Assert
        expect(publicServicesList).toBeDefined()
        const { total, publicServices } = publicServicesList

        expect(total).toBe(countDocs)
        expect(publicServices).toHaveLength(countDocs)
    })
})
