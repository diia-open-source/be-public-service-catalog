import TestKit, { mockInstance } from '@diia-inhouse/test'
import { PublicServiceStatus, SessionType } from '@diia-inhouse/types'

import CreatePublicServiceAction from '@actions/v1/createPublicService'

import PublicServiceService from '@services/public'

describe('CreatePublicServiceAction', () => {
    const testKit = new TestKit()
    const publicServiceServiceMock = mockInstance(PublicServiceService)
    const action = new CreatePublicServiceAction(publicServiceServiceMock)

    describe('method `handler`', () => {
        it('should successfully handle public service creation', async () => {
            const args = {
                params: {
                    categories: ['public-service-category-code'],
                    code: 'public-service-code',
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

            expect(await action.handler(args)).toEqual(service)

            expect(publicServiceServiceMock.createPublicService).toHaveBeenCalledWith(service)
        })
    })
})
