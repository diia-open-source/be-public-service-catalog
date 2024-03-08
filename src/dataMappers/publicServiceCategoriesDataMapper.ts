import { head } from 'lodash'

import { PublicServiceCategoryCode, PublicServiceStatus, PublicServiceTabCode } from '@diia-inhouse/types'

import {
    GetPublicServicesResponse,
    PublicService,
    PublicServiceCategory,
    PublicServiceCategoryResponse,
    PublicServiceCategoryResult,
    PublicServiceCategoryStatus,
    PublicServiceResponse,
} from '@src/generated'

import { PublicServiceCategoryModel } from '@interfaces/models/publicServiceCategory'

export default class PublicServiceCategoriesDataMapper {
    private readonly visibleSearchThreshold: number = 5

    private readonly tabCodesOrder: PublicServiceTabCode[] = [PublicServiceTabCode.citizen, PublicServiceTabCode.office]

    private readonly nameByPublicServiceTabCode: Record<PublicServiceTabCode, string> = {
        [PublicServiceTabCode.citizen]: 'Громадянам',
        [PublicServiceTabCode.office]: 'Держслужбовцям',
    }

    toCategories(publicServiceCategories: PublicServiceCategory[], publicServices: PublicService[]): GetPublicServicesResponse {
        const publicServicesByCategoryCode: Map<PublicServiceCategoryCode, PublicServiceResponse[]> = new Map()
        const categoryStatusByCategoryCode: Map<PublicServiceCategoryCode, PublicServiceCategoryStatus> = new Map()
        const categoriesResponse: PublicServiceCategoryResponse[] = []
        const tabs = new Set<PublicServiceTabCode>()

        publicServices.forEach((publicService: PublicService) => {
            const { categories, code, name, status, contextMenu, sortOrder } = publicService
            if (status === PublicServiceStatus.inactive) {
                return
            }

            categories.forEach((category: PublicServiceCategoryCode) => {
                const items: PublicServiceResponse[] = publicServicesByCategoryCode.get(category) || []
                const categoryStatus = categoryStatusByCategoryCode.get(category)

                if (!categoryStatus) {
                    categoryStatusByCategoryCode.set(category, PublicServiceCategoryStatus.inactive)
                }

                if (status === PublicServiceStatus.active) {
                    categoryStatusByCategoryCode.set(category, PublicServiceCategoryStatus.active)
                }

                items.push({
                    code,
                    name,
                    status: status === PublicServiceStatus.active ? status : PublicServiceStatus.inactive,
                    sortOrder,
                    search: name,
                    contextMenu,
                })
                publicServicesByCategoryCode.set(category, items)
            })
        })

        publicServiceCategories.forEach(({ category, icon, name, status, sortOrder, tabCodes = [] }) => {
            const publicServicesByCategory = publicServicesByCategoryCode.get(category)
            if (!publicServicesByCategory) {
                return
            }

            const calculatedStatus =
                status === PublicServiceCategoryStatus.inactive ? status : categoryStatusByCategoryCode.get(category) || status

            if (calculatedStatus === PublicServiceCategoryStatus.inactive) {
                return
            }

            const tabCode = head(tabCodes)!

            for (const code of tabCodes) {
                tabs.add(code)
            }

            categoriesResponse.push({
                code: category,
                icon,
                name,
                status: calculatedStatus,
                visibleSearch: publicServicesByCategory.length > this.visibleSearchThreshold,
                sortOrder,
                publicServices: publicServicesByCategory,
                tabCode,
                tabCodes,
            })
        })

        return {
            publicServicesCategories: categoriesResponse,
            tabs: this.tabCodesOrder
                .filter((code) => tabs.has(code))
                .map((code) => {
                    return {
                        code,
                        name: this.nameByPublicServiceTabCode[code],
                    }
                }),
        }
    }

    toEntity(model: PublicServiceCategoryModel): PublicServiceCategoryResult {
        const { _id: id, category, name, locales, icon, status, sortOrder, tabCodes = [] } = model

        return {
            id: id.toString(),
            category,
            name,
            locales,
            icon,
            status,
            sortOrder,
            tabCodes,
        }
    }
}
