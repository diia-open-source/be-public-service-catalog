import TestKit, { mockInstance } from '@diia-inhouse/test'

import GetPublicServicesListAction from '@actions/v1/getPublicServicesList'

import PublicServiceService from '@services/public'

describe('GetPublicServicesListAction', () => {
    const testKit = new TestKit()
    const publicServiceServiceMock = mockInstance(PublicServiceService)
    const getPublicServiceCategoriesAction = new GetPublicServicesListAction(publicServiceServiceMock)

    describe('method `handler`', () => {
        it('should successfully get public services list', async () => {
            const args = {
                params: {},
                headers: testKit.session.getHeaders(),
                session: testKit.session.getPartnerSession(),
            }
            const expectedResult = {
                total: 0,
                publicServices: [],
            }

            jest.spyOn(publicServiceServiceMock, 'getPublicServicesList').mockResolvedValueOnce(expectedResult)

            expect(await getPublicServiceCategoriesAction.handler(args)).toEqual(expectedResult)

            expect(publicServiceServiceMock.getPublicServicesList).toHaveBeenCalledWith({ skip: 0, limit: 100 })
        })
    })
})
