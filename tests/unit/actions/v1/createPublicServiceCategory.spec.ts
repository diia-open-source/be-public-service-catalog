import TestKit, { mockInstance } from '@diia-inhouse/test'

import { PublicServiceCategoryStatus } from '@src/generated'

import CreatePublicServiceCategoryAction from '@actions/v1/createPublicServiceCategory'

import PublicServiceCategoriesService from '@services/publicCategories'

describe('CreatePublicServiceCategoryAction', () => {
    const testKit = new TestKit()
    const publicServiceCategoriesServiceMock = mockInstance(PublicServiceCategoriesService)
    const action = new CreatePublicServiceCategoryAction(publicServiceCategoriesServiceMock)

    describe('method `handler`', () => {
        it('should successfully handle public service category creation', async () => {
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

            jest.spyOn(publicServiceCategoriesServiceMock, 'createCategory').mockResolvedValueOnce(publicServiceCategory)

            expect(await action.handler(args)).toEqual(publicServiceCategory)

            expect(publicServiceCategoriesServiceMock.createCategory).toHaveBeenCalledWith(publicServiceCategory)
        })
    })
})
