import TestKit, { mockInstance } from '@diia-inhouse/test'

import GetPublicServicesAction from '@actions/v3/getPublicServices'

import PublicServiceCategoriesService from '@services/publicCategories'

describe('GetPublicServicesAction', () => {
    const testKit = new TestKit()
    const publicServiceCategoriesServiceMock = mockInstance(PublicServiceCategoriesService)
    const getPublicServicesAction = new GetPublicServicesAction(publicServiceCategoriesServiceMock)

    describe('method `handler`', () => {
        it('should successfully get public services list', async () => {
            const args = {
                headers: testKit.session.getHeaders(),
                session: testKit.session.getUserSession(),
            }
            const {
                headers,
                session: { user, features = {} },
            } = args
            const expectedResult = {
                publicServicesCategories: [],
                tabs: [],
            }

            jest.spyOn(publicServiceCategoriesServiceMock, 'getPublicServicesCategories').mockResolvedValueOnce(expectedResult)

            expect(await getPublicServicesAction.handler(args)).toEqual(expectedResult)

            expect(publicServiceCategoriesServiceMock.getPublicServicesCategories).toHaveBeenCalledWith(user, features, headers)
        })
    })
})
