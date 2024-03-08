import { AsyncLocalStorage } from 'async_hooks'

import compareVersions from 'compare-versions'
import { FilterQuery } from 'mongoose'

import { clientCallOptions } from '@diia-inhouse/diia-app'

import { MongoDBErrorCode } from '@diia-inhouse/db'
import { BadRequestError, ModelNotFoundError } from '@diia-inhouse/errors'
import {
    ActHeaders,
    ActionVersion,
    AlsData,
    AppUser,
    PlatformType,
    ProfileFeature,
    PublicServiceCode,
    PublicServiceContextMenu,
    PublicServiceSettings,
    PublicServiceStatus,
    SessionType,
    UserFeatures,
} from '@diia-inhouse/types'
import { UserServiceClient } from '@diia-inhouse/user-service-client'
import { profileFeaturesToList, utils } from '@diia-inhouse/utils'

import { GetPublicServicesListResponse, PublicService } from '@src/generated'

import publicServiceModel from '@models/publicService'

import PublicServiceDataMapper from '@dataMappers/publicServiceDataMapper'

import { PublicServiceModel } from '@interfaces/models/publicService'
import { GetPublicServicesListOptions } from '@interfaces/services/public'

export default class PublicServiceService {
    constructor(
        private readonly publicServiceDataMapper: PublicServiceDataMapper,
        private readonly asyncLocalStorage: AsyncLocalStorage<AlsData>,
        private readonly userServiceClient: UserServiceClient,
    ) {}

    private readonly serviceAvailabilityStrategies: Partial<Record<PublicServiceCode, (features: UserFeatures) => boolean>> = {
        [PublicServiceCode.officeOfficialWorkspace]: (features) => features[ProfileFeature.office]?.googleWorkspace === 'true',
    }

    async createPublicService(publicService: PublicService): Promise<PublicService> {
        try {
            const newPublicService = await publicServiceModel.create(publicService)

            return newPublicService
        } catch (e) {
            return utils.handleError(e, (err) => {
                if (err.getCode() === MongoDBErrorCode.DuplicateKey) {
                    throw new BadRequestError(`Public service ${publicService.code} already exists`)
                }

                throw err
            })
        }
    }

    async getPublicServiceByCode(code: PublicServiceCode): Promise<PublicServiceSettings> {
        const query: FilterQuery<PublicService> = { code }
        const publicService = await publicServiceModel.findOne(query).lean()

        if (!publicService) {
            throw new ModelNotFoundError('Public service', code)
        }

        return this.publicServiceDataMapper.toEntity(publicService)
    }

    async getPublicServiceContextMenu(code: PublicServiceCode): Promise<PublicServiceContextMenu[]> {
        const publicService = await this.getPublicService(code)
        if (!publicService) {
            return []
        }

        return publicService.contextMenu && utils.filterByAppVersions(publicService.contextMenu, this.asyncLocalStorage.getStore()?.headers)
    }

    async getPublicServices(user: AppUser, features: UserFeatures, headers: ActHeaders): Promise<PublicService[]> {
        const { identifier: userIdentifier, sessionType } = user
        const { platformType, appVersion, platformVersion } = headers

        const publicServices = await this.fetchPublicServices()

        let hasSegments = false
        const validatedPublicServices = publicServices.map((publicService: PublicServiceModel) => {
            const { code, name, status, contextMenu, appVersions, sortOrder, categories, segments, sessionTypes, locales, profileFeature } =
                publicService

            const result: PublicService = {
                code,
                name,
                status,
                contextMenu: contextMenu && utils.filterByAppVersions(contextMenu, this.asyncLocalStorage.getStore()?.headers),
                appVersions,
                sortOrder,
                categories,
                segments,
                sessionTypes,
                locales,
                profileFeature,
            }

            if (status !== PublicServiceStatus.active) {
                return result
            }

            if (!platformType || !appVersion || !platformVersion) {
                return result
            }

            const isAvailable: boolean = this.isPublicServiceAvailable(
                publicService,
                sessionType,
                platformType,
                appVersion,
                platformVersion,
                features,
            )
            if (segments?.length && isAvailable) {
                hasSegments = true
            }

            return isAvailable ? result : { ...result, status: PublicServiceStatus.inactive }
        })

        if (!hasSegments) {
            return validatedPublicServices
        }

        const { segments: subscribedSegments } = await this.userServiceClient.getSubscribedSegments(
            { userIdentifier },
            clientCallOptions({ version: ActionVersion.V2 }),
        )
        const subscribedSegmentsSet: Set<string> = new Set(subscribedSegments)

        return validatedPublicServices.map((publicService) => {
            const { segments, status } = publicService
            if (status === PublicServiceStatus.inactive || !segments.length) {
                return publicService
            }

            const isAvailable = segments.every((segment: string) => subscribedSegmentsSet.has(segment))

            return isAvailable ? publicService : { ...publicService, status: PublicServiceStatus.inactive }
        })
    }

    async getPublicServicesList({ skip, limit }: GetPublicServicesListOptions): Promise<GetPublicServicesListResponse> {
        const [total, publicServices] = await Promise.all([
            publicServiceModel.countDocuments(),
            publicServiceModel.find().skip(skip).limit(limit).lean(),
        ])

        return { total, publicServices: publicServices.map((publicService) => this.publicServiceDataMapper.toEntity(publicService)) }
    }

    async isPublicServiceAvailableByCode(
        code: PublicServiceCode,
        sessionType: SessionType,
        userFeatures: UserFeatures,
        headers: ActHeaders,
    ): Promise<boolean> {
        const publicService = await this.getPublicService(code)

        if (!publicService) {
            return false
        }

        const { status } = publicService

        if (status !== PublicServiceStatus.active) {
            return false
        }

        const { platformType, appVersion, platformVersion } = headers

        if (!platformType || !appVersion || !platformVersion) {
            return false
        }

        const isAvailable: boolean = this.isPublicServiceAvailable(
            publicService,
            sessionType,
            platformType,
            appVersion,
            platformVersion,
            userFeatures,
        )

        return isAvailable
    }

    async updatePublicService(publicService: Partial<PublicService>): Promise<PublicService> {
        const updatedPublicService = await publicServiceModel
            .findOneAndUpdate({ code: publicService.code }, { ...publicService }, { new: true })
            .lean()

        if (!updatedPublicService) {
            throw new ModelNotFoundError(publicServiceModel.modelName, publicService.code)
        }

        return updatedPublicService
    }

    private async fetchPublicServices(): Promise<PublicServiceModel[]> {
        const query: FilterQuery<PublicServiceModel> = {
            status: { $in: [PublicServiceStatus.active, PublicServiceStatus.inDevelopment] },
        }
        const publicServices: PublicServiceModel[] = await publicServiceModel.find(query).sort({ sortOrder: 1 }).lean()

        return publicServices
    }

    private async getPublicService(code: PublicServiceCode): Promise<PublicServiceModel | undefined> {
        const publicServices = await this.fetchPublicServices()

        return publicServices.find((service) => service.code === code)
    }

    private isPublicServiceAvailable(
        publicService: PublicServiceModel,
        sessionType: SessionType,
        platformType: PlatformType,
        appVersion: string,
        platformVersion: string,
        userFeatures: UserFeatures,
    ): boolean {
        const { appVersions, sessionTypes, platformMinVersion, profileFeature, code } = publicService
        if (!sessionTypes.includes(sessionType)) {
            return false
        }

        const featuresList = profileFeaturesToList(userFeatures)
        if (profileFeature && !featuresList?.includes(profileFeature)) {
            return false
        }

        const platformMinVersionValue = platformMinVersion?.[platformType]
        if (platformMinVersionValue && compareVersions.compare(platformVersion, platformMinVersionValue, '<')) {
            return false
        }

        const strategy = this.serviceAvailabilityStrategies[code]
        if (strategy && !strategy(userFeatures)) {
            return false
        }

        const appVersionsBySession = appVersions?.[sessionType]
        if (!appVersionsBySession) {
            return true
        }

        const publicServiceVersions = appVersionsBySession.versions?.[platformType]
        if (publicServiceVersions?.some((version: string) => compareVersions.compare(appVersion, version, '='))) {
            return true
        }

        const publicServiceMinVersion = appVersionsBySession.minVersion?.[platformType]
        if (publicServiceMinVersion && compareVersions.compare(appVersion, publicServiceMinVersion, '>=')) {
            return true
        }

        return false
    }
}
