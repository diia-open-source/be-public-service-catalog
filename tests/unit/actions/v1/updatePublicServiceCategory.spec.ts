import TestKit, { mockInstance } from '@diia-inhouse/test'

import { PublicServiceCategoryStatus } from '@src/generated'

import UpdatePublicServiceCategoryAction from '@actions/v1/updatePublicServiceCategory'

import PublicServiceCategoriesService from '@services/publicCategories'

describe('UpdatePublicServiceCategoryAction', () => {
    const testKit = new TestKit()
    const publicServiceCategoriesServiceMock = mockInstance(PublicServiceCategoriesService)
    const action = new UpdatePublicServiceCategoryAction(publicServiceCategoriesServiceMock)

    describe('method `handler`', () => {
        it('should successfully update public service category', async () => {
            const args = {
                headers: testKit.session.getHeaders(),
                params: {
                    category: 'public-service-category-code',
                    icon: 'icon',
                    locales: {},
                    name: 'Name',
                    sortOrder: -1,
                    status: PublicServiceCategoryStatus.active,
                    tabCodes: [],
                },
                session: testKit.session.getPartnerSession(),
            }
            const { params: publicServiceCategory } = args

            jest.spyOn(publicServiceCategoriesServiceMock, 'updateCategory').mockResolvedValueOnce(publicServiceCategory)

            expect(await action.handler(args)).toEqual(publicServiceCategory)

            expect(publicServiceCategoriesServiceMock.updateCategory).toHaveBeenCalledWith(publicServiceCategory)
        })
    })
})
