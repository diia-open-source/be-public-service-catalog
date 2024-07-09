const utilsMock = { handleError: jest.fn() }

jest.mock('@diia-inhouse/utils', () => {
    const originUtils = jest.requireActual('@diia-inhouse/utils')

    return {
        ...originUtils,
        utils: {
            ...originUtils.utils,
            ...utilsMock,
        },
    }
})

import { MongoDBErrorCode } from '@diia-inhouse/db'
import { ApiError, BadRequestError, ModelNotFoundError } from '@diia-inhouse/errors'
import TestKit, { mockInstance } from '@diia-inhouse/test'
import MongooseMock from '@diia-inhouse/test/mongooseMock'

import PublicService from '@services/public'
import PublicServiceCategoriesService from '@services/publicCategories'

import publicServiceCategoryModel from '@models/publicServiceCategory'

import PublicServiceCategoriesDataMapper from '@dataMappers/publicServiceCategoriesDataMapper'

import { publicService, publicServiceCategories } from '@tests/mocks/publicServices'

describe('service: PublicCategories', () => {
    const testKit = new TestKit()
    const publicServiceMock = mockInstance(PublicService)
    const dataMapperMock = mockInstance(PublicServiceCategoriesDataMapper)
    const mongooseMock = new MongooseMock()

    const service = new PublicServiceCategoriesService(publicServiceMock, dataMapperMock)

    describe('method: getPublicServicesCategories', () => {
        it('should return publicServiceCategory from database and store to cache', async () => {
            const { user } = testKit.session.getUserSession()
            const headers = testKit.session.getHeaders()

            mongooseMock.setResultChain(['find', 'sort'], publicServiceCategories)
            jest.spyOn(publicServiceMock, 'getPublicServices').mockResolvedValueOnce([publicService])

            await service.getPublicServicesCategories(user, {}, headers)

            expect(dataMapperMock.toCategories).toHaveBeenCalledWith(publicServiceCategories, [publicService])
        })
    })

    describe('method: createCategory', () => {
        it('should successfully create new category', async () => {
            const publicServiceCategory = new publicServiceCategoryModel(publicServiceCategories[0])

            jest.spyOn(publicServiceCategoryModel, 'create').mockResolvedValueOnce([publicServiceCategory])

            expect(await service.createCategory(publicServiceCategories[0])).toEqual([publicServiceCategory])

            expect(publicServiceCategoryModel.create).toHaveBeenCalledWith(publicServiceCategories[0])
        })

        it.each([
            [
                'duplicate key',
                new ApiError('Duplicate key', MongoDBErrorCode.DuplicateKey),
                new BadRequestError(`Category ${publicServiceCategories[0].category} already exists`),
            ],
            ['unknown error', new ApiError('Unknown error', 0), new ApiError('Unknown error', 0)],
        ])('should fail with error in case %s', async (_msg, rejectedError, expectedError) => {
            utilsMock.handleError.mockImplementationOnce((err, cb) => {
                cb(err)
            })
            jest.spyOn(publicServiceCategoryModel, 'create').mockRejectedValueOnce(rejectedError)

            await expect(async () => {
                await service.createCategory(publicServiceCategories[0])
            }).rejects.toEqual(expectedError)

            expect(publicServiceCategoryModel.create).toHaveBeenCalledWith(publicServiceCategories[0])
        })
    })

    describe('method: getPublicServiceCategoriesList', () => {
        it('should successfully get public service categories list', async () => {
            const publicServiceCategory = new publicServiceCategoryModel(publicServiceCategories[0])
            const mappedPublicService = {
                ...publicServiceCategories[0],
                id: publicServiceCategory._id.toString(),
            }

            jest.spyOn(publicServiceCategoryModel, 'countDocuments').mockResolvedValueOnce(1)
            mongooseMock.setResultChain(['find', 'sort', 'lean'], [publicServiceCategory])
            jest.spyOn(dataMapperMock, 'toEntity').mockReturnValueOnce(mappedPublicService)

            expect(await service.getPublicServiceCategoriesList({ skip: 0, limit: 10 })).toEqual({
                total: 1,
                publicServiceCategories: [mappedPublicService],
            })

            expect(publicServiceCategoryModel.countDocuments).toHaveBeenCalledWith()
            expect(dataMapperMock.toEntity).toHaveBeenCalledWith(publicServiceCategory)
        })
    })

    describe('method: getPublicServiceCategoryByCategory', () => {
        it('should successfully get public service category by category', async () => {
            const category = 'certificates'
            const publicServiceCategory = new publicServiceCategoryModel(publicServiceCategories[0])
            const mappedPublicService = {
                ...publicServiceCategories[0],
                id: publicServiceCategory._id.toString(),
            }

            jest.spyOn(publicServiceCategoryModel, 'findOne').mockResolvedValueOnce(publicServiceCategory)
            jest.spyOn(dataMapperMock, 'toEntity').mockReturnValueOnce(mappedPublicService)

            expect(await service.getPublicServiceCategoryByCategory(category)).toEqual(mappedPublicService)

            expect(publicServiceCategoryModel.findOne).toHaveBeenCalledWith({ category })
            expect(dataMapperMock.toEntity).toHaveBeenCalledWith(publicServiceCategory)
        })

        it('should fail with error in case public service category not found', async () => {
            const category = 'certificates'

            jest.spyOn(publicServiceCategoryModel, 'findOne').mockResolvedValueOnce(null)

            await expect(async () => {
                await service.getPublicServiceCategoryByCategory(category)
            }).rejects.toEqual(new ModelNotFoundError('Public service category', category))

            expect(publicServiceCategoryModel.findOne).toHaveBeenCalledWith({ category })
        })
    })

    describe('method: updateCategory', () => {
        it('should successfully update category', async () => {
            const publicServiceCategory = new publicServiceCategoryModel(publicServiceCategories[0])

            mongooseMock.setResultChain(['findOneAndUpdate', 'lean'], publicServiceCategory)

            expect(await service.updateCategory(publicServiceCategory)).toEqual(publicServiceCategory)
        })

        it('should fail with error in case category not found for update', async () => {
            const publicServiceCategory = new publicServiceCategoryModel(publicServiceCategories[0])

            mongooseMock.setResultChain(['findOneAndUpdate', 'lean'], null)

            await expect(async () => {
                await service.updateCategory(publicServiceCategory)
            }).rejects.toEqual(new ModelNotFoundError(publicServiceCategoryModel.modelName, publicServiceCategory.category))
        })
    })
})
