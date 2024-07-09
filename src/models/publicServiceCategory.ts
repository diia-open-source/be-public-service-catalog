import { Model, Schema, model, models } from '@diia-inhouse/db'

import { PublicServiceCategory, PublicServiceCategoryStatus } from '@src/generated'

export const publicServiceCategorySchema = new Schema<PublicServiceCategory>(
    {
        category: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        icon: { type: String, required: true },
        locales: { type: Object, required: false },
        status: { type: String, enum: Object.values(PublicServiceCategoryStatus), required: true },
        sortOrder: { type: Number, required: true },
        tabCodes: { type: [String], default: [] },
    },
    {
        timestamps: true,
    },
)

export default <Model<PublicServiceCategory>>models.PublicServiceCategory || model('PublicServiceCategory', publicServiceCategorySchema)
