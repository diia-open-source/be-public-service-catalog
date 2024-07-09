import { Model, Schema, SchemaDefinition, model, models } from '@diia-inhouse/db'
import {
    AppVersions,
    PlatformType,
    ProfileFeature,
    PublicServiceAppVersionsBySession,
    PublicServiceContextMenu,
    PublicServiceContextMenuType,
    PublicServiceStatus,
    SessionType,
} from '@diia-inhouse/types'

import { PublicService } from '@src/generated'

export const availableMinVersionsSchemaDefinition = ((): SchemaDefinition<AppVersions['minVersion']> => {
    const acc: SchemaDefinition<AppVersions['minVersion']> = {}

    for (const platformType of Object.values(PlatformType)) {
        acc[platformType] = { type: String }
    }

    return acc
})()

export const availableVersionsSchemaDefinition = ((): SchemaDefinition<AppVersions['versions']> => {
    const acc: SchemaDefinition<AppVersions['versions']> = {}

    for (const platformType of Object.values(PlatformType)) {
        acc[platformType] = { type: [String], default: undefined }
    }

    return acc
})()

const appVersionsSchema = new Schema<AppVersions>(
    {
        minVersion: availableMinVersionsSchemaDefinition,
        versions: availableVersionsSchemaDefinition,
    },
    { _id: false },
)

const appVersionsSchemaDefinition = ((): SchemaDefinition<PublicServiceAppVersionsBySession> => {
    const acc: SchemaDefinition<PublicServiceAppVersionsBySession> = {}

    for (const session of Object.values(SessionType)) {
        acc[session] = appVersionsSchema
    }

    return acc
})()

const appVersionsBySessionSchema = new Schema<PublicServiceAppVersionsBySession>(appVersionsSchemaDefinition, { _id: false })

const publicServiceContextMenuSchema = new Schema<PublicServiceContextMenu>(
    {
        type: { type: String, enum: Object.values(PublicServiceContextMenuType), required: true },
        name: { type: String, required: true },
        code: { type: String },
        appVersions: { type: appVersionsSchema },
    },
    {
        _id: false,
    },
)

const platformMinVersionSchema = new Schema<PublicService['platformMinVersion']>(
    {
        [PlatformType.iOS]: { type: String },
        [PlatformType.Android]: { type: String },
        [PlatformType.Huawei]: { type: String },
    },
    { _id: false },
)

export const publicServiceSchema = new Schema<PublicService>(
    {
        categories: { type: [String], required: true },
        code: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        status: { type: String, enum: Object.values(PublicServiceStatus), required: true },
        sortOrder: { type: Number, required: true },
        contextMenu: { type: [publicServiceContextMenuSchema], default: undefined },
        segments: { type: [String] },
        sessionTypes: { type: [String], enum: Object.values(SessionType), required: true },
        locales: { type: Object, required: false },
        appVersions: { type: appVersionsBySessionSchema },
        platformMinVersion: { type: platformMinVersionSchema },
        profileFeature: { type: String, enum: Object.values(ProfileFeature) },
    },
    {
        timestamps: true,
    },
)

export default <Model<PublicService>>models.PublicService || model('PublicService', publicServiceSchema)
