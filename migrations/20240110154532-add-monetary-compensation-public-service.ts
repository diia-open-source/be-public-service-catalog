import 'module-alias/register'
import { mongo } from '@diia-inhouse/db'
import { Env } from '@diia-inhouse/env'
import { PublicServiceContextMenuType, PublicServiceStatus, SessionType } from '@diia-inhouse/types'

const publicServicesCollectionName = 'publicservices'

export async function up(db: mongo.Db): Promise<void> {
    const isProd = process.env.NODE_ENV === Env.Prod

    const publicServices: Record<string, unknown>[] = [
        {
            code: 'monetaryCompensation',
            name: 'Виплата на будівництво',
            status: isProd ? PublicServiceStatus.inactive : PublicServiceStatus.active,
            sortOrder: 540,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'damaged-property',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['property'],
            sessionTypes: [SessionType.User],
        },
    ]

    await db.collection(publicServicesCollectionName).insertMany(publicServices)
}
