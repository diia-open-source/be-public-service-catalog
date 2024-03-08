import { randomUUID } from 'crypto'

import TestKit, { mockInstance } from '@diia-inhouse/test'
import { PublicServiceCode, PublicServiceStatus } from '@diia-inhouse/types'

import Utils from '@src/utils'

import UpdatePublicServiceAction from '@actions/v1/updatePublicService'

import PublicServiceService from '@services/public'

describe('UpdatePublicServiceAction', () => {
    const testKit = new TestKit()
    const publicServiceServiceMock = mockInstance(PublicServiceService)
    const utilsMock = mockInstance(Utils)
    const updatePublicServiceAction = new UpdatePublicServiceAction(publicServiceServiceMock, utilsMock)

    describe('method `handler`', () => {
        it('should successfully update public service', async () => {
            const args = {
                params: {
                    id: randomUUID(),
                    categories: [],
                    code: PublicServiceCode.criminalRecordCertificate,
                    name: 'Name',
                    status: PublicServiceStatus.active,
                    segments: [],
                    contextMenu: [],
                    sessionTypes: [],
                    sortOrder: 0,
                    locales: {},
                },
                headers: testKit.session.getHeaders(),
                session: testKit.session.getPartnerSession(),
            }
            const { params: publicService } = args

            jest.spyOn(publicServiceServiceMock, 'updatePublicService').mockResolvedValueOnce(publicService)

            expect(await updatePublicServiceAction.handler(args)).toEqual(publicService)

            expect(publicServiceServiceMock.updatePublicService).toHaveBeenCalledWith(publicService)
        })
    })
})
