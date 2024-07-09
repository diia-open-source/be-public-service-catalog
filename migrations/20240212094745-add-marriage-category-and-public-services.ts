import 'module-alias/register'
import { mongo } from '@diia-inhouse/db'
import { Env } from '@diia-inhouse/env'
import { PublicServiceContextMenuType, PublicServiceStatus, SessionType } from '@diia-inhouse/types'

import { PublicServiceCategoryStatus, PublicServiceTabCode } from '@src/generated'

const publicServicesCollectionName = 'publicservices'
const categoriesCollectionName = 'publicservicecategories'

export async function up(db: mongo.Db): Promise<void> {
    const isProd = process.env.NODE_ENV === Env.Prod

    const publicServices: Record<string, unknown>[] = [
        {
            code: 'proposal',
            name: 'Зробити пропозицію',
            status: isProd ? PublicServiceStatus.inactive : PublicServiceStatus.active,
            sortOrder: 860,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'proposal',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    type: PublicServiceContextMenuType.rating,
                    name: 'Оцінити послугу',
                },
            ],
            categories: ['marriage'],
            sessionTypes: [SessionType.User],
        },
        {
            code: 'marriage',
            name: 'Заява про шлюб',
            status: isProd ? PublicServiceStatus.inactive : PublicServiceStatus.active,
            sortOrder: 861,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'marriage',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    type: PublicServiceContextMenuType.rating,
                    name: 'Оцінити послугу',
                },
            ],
            categories: ['marriage'],
            sessionTypes: [SessionType.User],
        },
    ]

    const publicServiceCategories: Record<string, unknown>[] = [
        {
            category: 'marriage',
            name: 'Онлайн шлюб',
            icon: '',
            status: isProd ? PublicServiceCategoryStatus.inactive : PublicServiceCategoryStatus.active,
            sortOrder: 850,
            tabCodes: [PublicServiceTabCode.citizen],
        },
    ]

    await db.collection(publicServicesCollectionName).insertMany(publicServices)
    await db.collection(categoriesCollectionName).insertMany(publicServiceCategories)
}
