import { Model, Schema, model, models } from 'mongoose'

import { PublicServiceCategoryCode, PublicServiceTabCode } from '@diia-inhouse/types'

import { PublicServiceCategory, PublicServiceCategoryStatus } from '@src/generated'

const localesSchema = new Schema<Record<string, string>>({}, { _id: false })

export const publicServiceCategorySchema = new Schema<PublicServiceCategory>(
    {
        category: { type: String, enum: Object.values(PublicServiceCategoryCode), unique: true, required: true },
        name: { type: String, required: true },
        icon: { type: String, required: true },
        locales: { type: localesSchema, required: false },
        status: { type: String, enum: Object.values(PublicServiceCategoryStatus), required: true },
        sortOrder: { type: Number, required: true },
        tabCodes: { type: [String], enum: Object.values(PublicServiceTabCode), default: [] },
    },
    {
        timestamps: true,
    },
)

export const skipSyncIndexes = true

export default <Model<PublicServiceCategory>>models.PublicServiceCategory || model('PublicServiceCategory', publicServiceCategorySchema)
