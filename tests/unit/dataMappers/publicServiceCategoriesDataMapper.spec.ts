import { PublicServiceCategoryCode, PublicServiceStatus } from '@diia-inhouse/types'

import { PublicServiceCategoryStatus } from '@src/generated'

import publicServiceCategoryModel from '@models/publicServiceCategory'

import PublicServiceCategoriesDataMapper from '@dataMappers/publicServiceCategoriesDataMapper'

import { publicService, publicServiceCategories, publicServiceCategoryResponse } from '@tests/mocks/publicServices'

import { PublicServiceCategoryModel } from '@interfaces/models/publicServiceCategory'

describe('publicServiceCategoriesDataMapper', () => {
    const dataMapper = new PublicServiceCategoriesDataMapper()

    describe(`method toCategories`, () => {
        it('should transform PublicServiceCategoryModel[] and PublicService[] to PublicServiceCategoryResponse[]', () => {
            const result = dataMapper.toCategories(<PublicServiceCategoryModel[]>publicServiceCategories, [publicService])

            expect(result).toEqual(publicServiceCategoryResponse)
        })

        it('should omit inactive public services', () => {
            const result = dataMapper.toCategories(<PublicServiceCategoryModel[]>publicServiceCategories, [
                { ...publicService, status: PublicServiceStatus.inactive },
            ])

            expect(result).toEqual({ publicServicesCategories: [], tabs: [] })
        })

        it('should omit not active public services', () => {
            const result = dataMapper.toCategories(<PublicServiceCategoryModel[]>publicServiceCategories, [
                { ...publicService, status: <PublicServiceStatus>'unknown-status' },
            ])

            expect(result).toEqual({ publicServicesCategories: [], tabs: [] })
        })

        it('should omit empty categories', () => {
            const result = dataMapper.toCategories(
                <PublicServiceCategoryModel[]>[
                    {
                        ...publicServiceCategories[0],
                        category: <PublicServiceCategoryCode>'fake-category',
                    },
                ],
                [publicService],
            )

            expect(result).toEqual({ publicServicesCategories: [], tabs: [] })
        })

        it('should omit inactive categories', () => {
            const result = dataMapper.toCategories(
                <PublicServiceCategoryModel[]>[
                    {
                        ...publicServiceCategories[0],
                        status: PublicServiceCategoryStatus.inactive,
                    },
                ],
                [publicService],
            )

            expect(result).toEqual({ publicServicesCategories: [], tabs: [] })
        })
    })

    describe('method to toEntity', () => {
        it('should successfully transform public service category model to entity', () => {
            const publicServiceCategory = new publicServiceCategoryModel(publicServiceCategories[0])
            const result = dataMapper.toEntity(publicServiceCategory)

            expect(result).toEqual({
                id: publicServiceCategory._id.toString(),
                category: publicServiceCategory.category,
                name: publicServiceCategory.name,
                locales: publicServiceCategory.locales,
                icon: publicServiceCategory.icon,
                status: publicServiceCategory.status,
                sortOrder: publicServiceCategory.sortOrder,
                tabCodes: publicServiceCategory.tabCodes,
            })
        })
    })
})
