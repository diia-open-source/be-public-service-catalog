import TestKit from '@diia-inhouse/test'
import { PublicServiceStatus, SessionType } from '@diia-inhouse/types'

import IsPublicServiceAvailableByCodeV2Action from '@actions/v2/isPublicServiceAvailableByCodeV2'

import { getApp } from '@tests/utils/getApp'

describe(`Action ${IsPublicServiceAvailableByCodeV2Action.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let action: IsPublicServiceAvailableByCodeV2Action

    beforeAll(async () => {
        app = await getApp()

        action = app.container.build(IsPublicServiceAvailableByCodeV2Action)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    it.each([
        [
            false,
            'public service cannot be found by provided code',
            testKit.session.getHeaders(),
            { code: 'invalid-public-service-code', sessionType: SessionType.User, features: {} },
        ],
        [
            false,
            `public service status is not ${PublicServiceStatus.active}`,
            testKit.session.getHeaders(),
            { code: 'vaccinationAid', sessionType: SessionType.User, features: {} },
        ],
        [
            false,
            'platformType is not provided in headers',
            testKit.session.getHeaders({ platformType: undefined }),
            { code: 'penalties', sessionType: SessionType.User, features: {} },
        ],
        [
            false,
            'appVersion is not provided in headers',
            testKit.session.getHeaders({ appVersion: undefined }),
            { code: 'penalties', sessionType: SessionType.User, features: {} },
        ],
        [
            false,
            'platformVersion is not provided in headers',
            testKit.session.getHeaders({ platformVersion: undefined }),
            { code: 'penalties', sessionType: SessionType.User, features: {} },
        ],
        [
            false,
            'public service does not support user`s session type',
            testKit.session.getHeaders(),
            { code: 'eResidentPrivateEntrepreneur', sessionType: SessionType.User, features: {} },
        ],
        [
            false,
            'user has no required by public service features',
            testKit.session.getHeaders(),
            { code: 'officeOfficialSearch', sessionType: SessionType.User, features: {} },
        ],
        [
            false,
            'platform version is not supported',
            testKit.session.getHeaders({ platformVersion: '4' }),
            { code: 'bayraktar', sessionType: SessionType.User, features: {} },
        ],
        [
            true,
            'public service supports all app versions',
            testKit.session.getHeaders(),
            { code: 'penalties', sessionType: SessionType.User, features: {} },
        ],
        [
            true,
            'user has minimum supported by public service application version',
            testKit.session.getHeaders({ appVersion: '2.0.33' }),
            { code: 'replacementDriverLicense', sessionType: SessionType.User, features: {} },
        ],
        [
            true,
            'user has greater than supported by public service application version',
            testKit.session.getHeaders(),
            { code: 'replacementDriverLicense', sessionType: SessionType.User, features: {} },
        ],
    ])('should return %s if %s', async (expected, _msg, headers, params) => {
        const result = await action.handler({ headers, params })

        expect(result).toEqual({ isAvailable: expected })
    })
})
