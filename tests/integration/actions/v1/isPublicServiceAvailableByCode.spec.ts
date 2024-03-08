import TestKit from '@diia-inhouse/test'
import { PlatformType, PublicServiceCode, SessionType } from '@diia-inhouse/types'

import IsPublicServiceAvailableByCodeAction from '@actions/v1/isPublicServiceAvailableByCode'

import { getApp } from '@tests/utils/getApp'

describe(`Action ${IsPublicServiceAvailableByCodeAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let action: IsPublicServiceAvailableByCodeAction

    beforeAll(async () => {
        app = await getApp()

        action = app.container.build(IsPublicServiceAvailableByCodeAction)

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
            { code: <PublicServiceCode>'invalid-public-service-code', sessionType: SessionType.User, features: {} },
        ],
        [
            false,
            'platformType is not provided in headers',
            testKit.session.getHeaders({ platformType: undefined }),
            { code: PublicServiceCode.criminalRecordCertificate, sessionType: SessionType.User, features: {} },
        ],
        [
            false,
            'appVersion is not provided in headers',
            testKit.session.getHeaders({ appVersion: undefined }),
            { code: PublicServiceCode.criminalRecordCertificate, sessionType: SessionType.User, features: {} },
        ],
        [
            false,
            'platformVersion is not provided in headers',
            testKit.session.getHeaders({ platformVersion: undefined }),
            { code: PublicServiceCode.criminalRecordCertificate, sessionType: SessionType.User, features: {} },
        ],
        [
            false,
            'public service does not support user`s session type',
            testKit.session.getHeaders(),
            { code: PublicServiceCode.criminalRecordCertificate, sessionType: SessionType.EResident, features: {} },
        ],
        [
            false,
            'user has less than minimum supported by public service application version',
            testKit.session.getHeaders({ platformType: PlatformType.Android, appVersion: '2.0.1' }),
            { code: PublicServiceCode.criminalRecordCertificate, sessionType: SessionType.User, features: {} },
        ],
        [
            true,
            'user has minimum supported by public service application version',
            testKit.session.getHeaders({ platformType: PlatformType.Android, appVersion: '3.0.33' }),
            { code: PublicServiceCode.criminalRecordCertificate, sessionType: SessionType.User, features: {} },
        ],
        [
            true,
            'user has greater than supported by public service application version',
            testKit.session.getHeaders({ platformType: PlatformType.Android, appVersion: '4.0.1' }),
            { code: PublicServiceCode.criminalRecordCertificate, sessionType: SessionType.User, features: {} },
        ],
    ])('should return %s if %s', async (expected, _msg, headers, params) => {
        const result = await action.handler({ headers, params })

        expect(result).toEqual({ isAvailable: expected })
    })
})
