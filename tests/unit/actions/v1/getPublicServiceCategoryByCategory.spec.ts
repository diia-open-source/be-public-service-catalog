import { randomUUID } from 'crypto'

import TestKit, { mockInstance } from '@diia-inhouse/test'
import { PublicServiceCategoryCode } from '@diia-inhouse/types'

import { PublicServiceCategoryResult, PublicServiceCategoryStatus } from '@src/generated'

import GetPublicServiceCategoryByCategoryAction from '@actions/v1/getPublicServiceCategoryByCategory'

import PublicServiceCategoriesService from '@services/publicCategories'

describe('GetPublicServiceCategoryByCategoryAction', () => {
    const testKit = new TestKit()
    const publicServiceCategoriesServiceMock = mockInstance(PublicServiceCategoriesService)
    const getPublicServiceCategoryByCategoryAction = new GetPublicServiceCategoryByCategoryAction(publicServiceCategoriesServiceMock)

    describe('method `handler`', () => {
        it('should successfully get public service category by category', async () => {
            const category = PublicServiceCategoryCode.certificates
            const args = {
                params: { category },
                headers: testKit.session.getHeaders(),
                session: testKit.session.getPartnerSession(),
            }
            const expectedResult: PublicServiceCategoryResult = {
                category,
                name: 'Name',
                icon: 'icon',
                sortOrder: 0,
                status: PublicServiceCategoryStatus.active,
                tabCodes: [],
                locales: {},
                id: randomUUID(),
            }

            jest.spyOn(publicServiceCategoriesServiceMock, 'getPublicServiceCategoryByCategory').mockResolvedValueOnce(expectedResult)

            expect(await getPublicServiceCategoryByCategoryAction.handler(args)).toEqual(expectedResult)

            expect(publicServiceCategoriesServiceMock.getPublicServiceCategoryByCategory).toHaveBeenCalledWith(category)
        })
    })
})
