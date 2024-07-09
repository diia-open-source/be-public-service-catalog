import 'module-alias/register'
import { mongo } from '@diia-inhouse/db'

const publicServicesCollectionName = 'publicservices'

export async function up(db: mongo.Db): Promise<void> {
    await db.collection(publicServicesCollectionName).updateOne({ code: 'properUser' }, { $set: { name: 'Шеринг авто' } })
}
