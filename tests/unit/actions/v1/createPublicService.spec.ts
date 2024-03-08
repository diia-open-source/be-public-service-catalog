import TestKit, { mockInstance } from '@diia-inhouse/test'
import { PublicServiceCategoryCode, PublicServiceCode, PublicServiceStatus, SessionType } from '@diia-inhouse/types'

import Utils from '@src/utils'

import CreatePublicServiceAction from '@actions/v1/createPublicService'

import PublicServiceService from '@services/public'

describe('CreatePublicServiceAction', () => {
    const testKit = new TestKit()
    const publicServiceServiceMock = mockInstance(PublicServiceService)
    const utilsMock = mockInstance(Utils)
    const createPublicServiceAction = new CreatePublicServiceAction(publicServiceServiceMock, utilsMock)

    describe('method `handler`', () => {
        it('should successfully handle public service creation', async () => {
            const args = {
                params: {
                    categories: [PublicServiceCategoryCode.certificates],
                    code: PublicServiceCode.criminalRecordCertificate,
                    contextMenu: [],
                    locales: {},
                    name: 'Name',
                    segments: [],
                    sessionTypes: [SessionType.User],
                    sortOrder: -1,
                    status: PublicServiceStatus.active,
                },
                session: testKit.session.getPartnerSession(),
                headers: testKit.session.getHeaders(),
            }
            const { params: service } = args

            jest.spyOn(publicServiceServiceMock, 'createPublicService').mockResolvedValueOnce(service)

            expect(await createPublicServiceAction.handler(args)).toEqual(service)

            expect(publicServiceServiceMock.createPublicService).toHaveBeenCalledWith(service)
        })
    })
})
