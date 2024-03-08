import 'module-alias/register'
import { Db } from 'mongodb'

import { PublicServiceCategoryCode, PublicServiceTabCode } from '@diia-inhouse/types'

import { PublicServiceCategoryStatus } from '@src/generated'

const collectionName = 'publicservicecategories'

export async function up(db: Db): Promise<void> {
    const publicServiceCategories: Record<string, unknown>[] = [
        {
            category: PublicServiceCategoryCode.certificates,
            name: 'Довідки та витяги',
            icon: '📋',
            status: PublicServiceCategoryStatus.active,
            sortOrder: 1600,
            tabCodes: [PublicServiceTabCode.citizen],
        },
    ]

    await db.collection(collectionName).insertMany(publicServiceCategories)
}

export async function down(db: Db): Promise<void> {
    await db.dropCollection(collectionName)
}
