import { randomUUID } from 'node:crypto'

import TestKit, { mockInstance } from '@diia-inhouse/test'
import { PublicServiceStatus } from '@diia-inhouse/types'

import UpdatePublicServiceAction from '@actions/v1/updatePublicService'

import PublicServiceService from '@services/public'

describe('UpdatePublicServiceAction', () => {
    const testKit = new TestKit()
    const publicServiceServiceMock = mockInstance(PublicServiceService)
    const action = new UpdatePublicServiceAction(publicServiceServiceMock)

    describe('method `handler`', () => {
        it('should successfully update public service', async () => {
            const args = {
                params: {
                    id: randomUUID(),
                    categories: [],
                    code: 'public-service-code',
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

            expect(await action.handler(args)).toEqual(publicService)

            expect(publicServiceServiceMock.updatePublicService).toHaveBeenCalledWith(publicService)
        })
    })
})
