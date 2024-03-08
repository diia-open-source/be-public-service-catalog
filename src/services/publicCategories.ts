import { FilterQuery } from 'mongoose'

import { MongoDBErrorCode } from '@diia-inhouse/db'
import { BadRequestError, ModelNotFoundError } from '@diia-inhouse/errors'
import { ActHeaders, AppUser, PublicServiceCategoryCode, UserFeatures } from '@diia-inhouse/types'
import { utils } from '@diia-inhouse/utils'

import {
    GetPublicServiceCategoriesListResponse,
    GetPublicServicesResponse,
    PublicServiceCategory,
    PublicServiceCategoryResult,
} from '@src/generated'

import PublicService from '@services/public'

import publicServiceCategoryModel from '@models/publicServiceCategory'

import PublicServiceCategoriesDataMapper from '@dataMappers/publicServiceCategoriesDataMapper'

import { GetPublicServiceCategoriesListOptions } from '@interfaces/services/publicCategories'

export default class PublicServiceCategoriesService {
    constructor(
        private readonly publicService: PublicService,
        private readonly publicServiceCategoriesDataMapper: PublicServiceCategoriesDataMapper,
    ) {}

    async createCategory(publicServiceCategory: PublicServiceCategory): Promise<PublicServiceCategory> {
        try {
            const newCategory: PublicServiceCategory = await publicServiceCategoryModel.create(publicServiceCategory)

            return newCategory
        } catch (e) {
            return utils.handleError(e, (err) => {
                if (err.getCode() === MongoDBErrorCode.DuplicateKey) {
                    throw new BadRequestError(`Category ${publicServiceCategory.category} already exists`)
                }

                throw err
            })
        }
    }

    async getPublicServicesCategories(user: AppUser, features: UserFeatures, headers: ActHeaders): Promise<GetPublicServicesResponse> {
        const [publicServiceCategories, publicServices] = await Promise.all([
            this.fetchPublicServicesCategories(),
            this.publicService.getPublicServices(user, features, headers),
        ])

        return this.publicServiceCategoriesDataMapper.toCategories(publicServiceCategories, publicServices)
    }

    async getPublicServiceCategoriesList({
        skip,
        limit,
    }: GetPublicServiceCategoriesListOptions): Promise<GetPublicServiceCategoriesListResponse> {
        const [total, publicServiceCategories] = await Promise.all([
            publicServiceCategoryModel.countDocuments(),
            publicServiceCategoryModel.find().skip(skip).limit(limit),
        ])

        return {
            total,
            publicServiceCategories: publicServiceCategories.map((publicServiceCategory) =>
                this.publicServiceCategoriesDataMapper.toEntity(publicServiceCategory),
            ),
        }
    }

    async getPublicServiceCategoryByCategory(category: PublicServiceCategoryCode): Promise<PublicServiceCategoryResult> {
        const query: FilterQuery<PublicServiceCategory> = { category }
        const publicServiceCategory = await publicServiceCategoryModel.findOne(query)
        if (!publicServiceCategory) {
            throw new ModelNotFoundError('Public service category', category)
        }

        return this.publicServiceCategoriesDataMapper.toEntity(publicServiceCategory)
    }

    async updateCategory(publicServiceCategory: Partial<PublicServiceCategory>): Promise<PublicServiceCategory> {
        const updatedCategory = await publicServiceCategoryModel
            .findOneAndUpdate({ category: publicServiceCategory.category }, { ...publicServiceCategory }, { new: true })
            .lean()

        if (!updatedCategory) {
            throw new ModelNotFoundError(publicServiceCategoryModel.modelName, publicServiceCategory.category)
        }

        return updatedCategory
    }

    private async fetchPublicServicesCategories(): Promise<PublicServiceCategory[]> {
        return await publicServiceCategoryModel.find({}).sort({ sortOrder: 1 }).lean()
    }
}
