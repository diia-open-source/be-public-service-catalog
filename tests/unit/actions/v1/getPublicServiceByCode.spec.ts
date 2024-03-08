import { randomUUID } from 'crypto'

import TestKit, { mockInstance } from '@diia-inhouse/test'
import { PublicServiceCode, PublicServiceStatus } from '@diia-inhouse/types'

import GetPublicServiceByCodeAction from '@actions/v1/getPublicServiceByCode'

import PublicServiceService from '@services/public'

describe('GetPublicServiceByCodeAction', () => {
    const testKit = new TestKit()
    const publicServiceServiceMock = mockInstance(PublicServiceService)
    const getPublicServiceByCodeAction = new GetPublicServiceByCodeAction(publicServiceServiceMock)

    describe('method `handler`', () => {
        it('should successfully get public service settings by code', async () => {
            const code = PublicServiceCode.criminalRecordCertificate
            const publicServiceSettings = {
                id: randomUUID(),
                categories: [],
                code,
                name: 'Name',
                status: PublicServiceStatus.active,
                segments: [],
                contextMenu: [],
                sessionTypes: [],
                sortOrder: 0,
                locales: {},
            }

            jest.spyOn(publicServiceServiceMock, 'getPublicServiceByCode').mockResolvedValueOnce(publicServiceSettings)

            expect(
                await getPublicServiceByCodeAction.handler({
                    params: { code },
                    session: testKit.session.getPartnerSession(),
                    headers: testKit.session.getHeaders(),
                }),
            ).toEqual(publicServiceSettings)

            expect(publicServiceServiceMock.getPublicServiceByCode).toHaveBeenCalledWith(code)
        })
    })
})
