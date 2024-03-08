import { Model, Schema, SchemaDefinition, model, models } from 'mongoose'

import {
    AppVersions,
    PlatformType,
    ProfileFeature,
    PublicServiceAppVersionsBySession,
    PublicServiceCategoryCode,
    PublicServiceCode,
    PublicServiceContextMenu,
    PublicServiceContextMenuType,
    PublicServiceStatus,
    SessionType,
} from '@diia-inhouse/types'

import { PublicService } from '@src/generated'

export const availableMinVersionsSchemaDefinition = Object.values(PlatformType).reduce(
    (acc: SchemaDefinition<AppVersions['minVersion']>, platformType) => {
        acc[platformType] = { type: String }

        return acc
    },
    {},
)

export const availableVersionsSchemaDefinition = Object.values(PlatformType).reduce(
    (acc: SchemaDefinition<AppVersions['versions']>, platformType) => {
        acc[platformType] = { type: [String], default: undefined }

        return acc
    },
    {},
)

const appVersionsSchema = new Schema<AppVersions>(
    {
        minVersion: availableMinVersionsSchemaDefinition,
        versions: availableVersionsSchemaDefinition,
    },
    { _id: false },
)

const appVersionsSchemaDefinition = Object.values(SessionType).reduce(
    (acc: SchemaDefinition<PublicServiceAppVersionsBySession>, session) => {
        acc[session] = appVersionsSchema

        return acc
    },
    {},
)

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

const localesSchema = new Schema<Record<string, string>>({}, { _id: false })

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
        categories: { type: [String], enum: Object.values(PublicServiceCategoryCode), required: true },
        code: { type: String, enum: Object.values(PublicServiceCode), unique: true, required: true },
        name: { type: String, required: true },
        status: { type: String, enum: Object.values(PublicServiceStatus), required: true },
        sortOrder: { type: Number, required: true },
        contextMenu: { type: [publicServiceContextMenuSchema], default: undefined },
        segments: { type: [String] },
        sessionTypes: { type: [String], enum: Object.values(SessionType), required: true },
        locales: { type: localesSchema, required: false },
        appVersions: { type: appVersionsBySessionSchema },
        platformMinVersion: { type: platformMinVersionSchema },
        profileFeature: { type: String, enum: Object.values(ProfileFeature) },
    },
    {
        timestamps: true,
    },
)

export const skipSyncIndexes = true

export default <Model<PublicService>>models.PublicService || model('PublicService', publicServiceSchema)
