import 'module-alias/register'
import { Db } from 'mongodb'

import { Env } from '@diia-inhouse/env'
import {
    PlatformType,
    PublicServiceCategoryCode,
    PublicServiceCode,
    PublicServiceContextMenuType,
    PublicServiceStatus,
    SessionType,
} from '@diia-inhouse/types'

const collectionName = 'publicservices'

export async function up(db: Db): Promise<void> {
    const isProd = process.env.NODE_ENV === Env.Prod
    const ratingContextMenuItem = {
        type: PublicServiceContextMenuType.rating,
        name: 'Оцінити послугу',
    }

    const publicServices: Record<string, unknown>[] = [
        {
            code: PublicServiceCode.criminalRecordCertificate,
            name: isProd ? 'Витяг про несудимість' : 'Довідка про несудимість',
            status: PublicServiceStatus.active,
            sortOrder: 1630,
            categories: [PublicServiceCategoryCode.certificates],
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'criminalRecordCertificate',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: isProd ? '3.0.64.1260' : '3.0.0',
                            [PlatformType.Android]: isProd ? '3.0.73.1214' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.73.1214' : '3.0.00',
                        },
                    },
                },
            ],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.57.1106' : '3.0.30',
                        [PlatformType.Android]: isProd ? '3.0.64.1105' : '3.0.30',
                        [PlatformType.Huawei]: isProd ? '3.0.64.1105' : '3.0.30',
                    },
                },
            },
        },
    ]

    await db.collection(collectionName).insertMany(publicServices)
}

export async function down(db: Db): Promise<void> {
    await db.dropCollection(collectionName)
}
