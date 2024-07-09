const utilsMock = {
    handleError: jest.fn(),
    filterByAppVersions: jest.fn(),
}
const compareVersionsMock = { compare: jest.fn() }

jest.mock('@diia-inhouse/utils', () => {
    const originUtils = jest.requireActual('@diia-inhouse/utils')

    return {
        ...originUtils,
        utils: {
            ...originUtils.utils,
            ...utilsMock,
        },
    }
})
jest.mock('compare-versions', () => compareVersionsMock)

import { AsyncLocalStorage } from 'node:async_hooks'

import { clone, merge } from 'lodash'

import { MongoDBErrorCode } from '@diia-inhouse/db'
import { ApiError, BadRequestError, ModelNotFoundError } from '@diia-inhouse/errors'
import TestKit, { mockInstance } from '@diia-inhouse/test'
import MongooseMock from '@diia-inhouse/test/mongooseMock'
import { AlsData, PlatformType, ProfileFeature, PublicServiceStatus, SessionType, UserFeatures } from '@diia-inhouse/types'

import PublicServiceService from '@services/public'

import publicServiceModel from '@models/publicService'

import PublicServiceDataMapper from '@dataMappers/publicServiceDataMapper'

import { userServiceClient } from '@tests/mocks/grpc/clients'
import { publicService } from '@tests/mocks/publicServices'

describe(`Service PublicService`, () => {
    const mongooseMock = new MongooseMock()
    const testKit = new TestKit()
    const publicServiceDataMapper: PublicServiceDataMapper = mockInstance(PublicServiceDataMapper)
    const asyncStorage = mockInstance(AsyncLocalStorage<AlsData>)

    const service = new PublicServiceService(publicServiceDataMapper, asyncStorage, userServiceClient)

    describe('method: getPublicServiceByCode', () => {
        it('should throw ModelNotFoundError if return nothing', async () => {
            const code = 'administrativeFees'

            mongooseMock.setResultChain(['findOne', 'lean'], undefined)
            await expect(service.getPublicServiceByCode(code)).rejects.toEqual(new ModelNotFoundError('Public service', code))
        })

        it('should return publicService', async () => {
            const copyPublicService = clone(publicService)
            const code = 'administrativeFees'
            const publicServiceSettings = merge({ id: 'id' }, copyPublicService)

            mongooseMock.setResultChain(['findOne', 'lean'], copyPublicService)
            jest.spyOn(publicServiceDataMapper, 'toEntity').mockReturnValueOnce(publicServiceSettings)

            await expect(service.getPublicServiceByCode(code)).resolves.toEqual(publicServiceSettings)
        })
    })

    describe('method: getPublicServices', () => {
        it('should return publicService without changes when headers is incomplete', async () => {
            const copyPublicService = clone(publicService)
            const session = testKit.session.getUserSession()
            const headers = testKit.session.getHeaders({
                appVersion: undefined,
            })

            mongooseMock.setResultChain(['find', 'sort', 'lean'], [copyPublicService])
            utilsMock.filterByAppVersions.mockReturnValueOnce(copyPublicService.contextMenu)

            await expect(service.getPublicServices(session.user, {}, headers)).resolves.toEqual([copyPublicService])
        })

        it('should return publicService inactive when segments is unsubscribed', async () => {
            const copyPublicService = clone(publicService)
            const session = testKit.session.getUserSession()
            const headers = testKit.session.getHeaders()
            const segments = ['segment']

            const publicServiceWithSegments = merge(copyPublicService, {
                segments,
            })

            const expectedResponse = [
                merge(publicServiceWithSegments, {
                    status: PublicServiceStatus.inactive,
                }),
            ]

            const publicServicesWithSegments = [publicServiceWithSegments]

            mongooseMock.setResultChain(['find', 'sort', 'lean'], publicServicesWithSegments)
            utilsMock.filterByAppVersions.mockReturnValueOnce(publicServiceWithSegments.contextMenu)

            await expect(service.getPublicServices(session.user, {}, headers)).resolves.toEqual(expectedResponse)
        })

        it('should return publicService inactive when segments second', async () => {
            const copyPublicService = clone(publicService)
            const session = testKit.session.getUserSession()
            const headers = testKit.session.getHeaders()
            const segments = ['segment']

            const publicServiceWithSegments = merge(copyPublicService, {
                segments,
                appVersions: undefined,
            })

            const expectedResponse = [
                merge(publicServiceWithSegments, {
                    status: PublicServiceStatus.inactive,
                }),
            ]

            mongooseMock.setResultChain(['find', 'sort', 'lean'], [publicServiceWithSegments])
            utilsMock.filterByAppVersions.mockReturnValueOnce(publicServiceWithSegments.contextMenu)

            await expect(service.getPublicServices(session.user, {}, headers)).resolves.toEqual(expectedResponse)
        })

        it.each([
            [
                PublicServiceStatus.inactive,
                'platform version is less then min required version',
                {},
                testKit.session.getHeaders({
                    platformVersion: '12',
                    platformType: PlatformType.Android,
                }),
                [
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.active,
                        platformMinVersion: {
                            [PlatformType.Android]: '13',
                        },
                    },
                ],
                (): void => {
                    utilsMock.filterByAppVersions.mockReturnValueOnce([])
                    compareVersionsMock.compare.mockReturnValueOnce(true)
                },
                [
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.inactive,
                        contextMenu: [],
                        profileFeature: undefined,
                    },
                ],
            ],
            [
                PublicServiceStatus.inactive,
                'office official workspace is not allowed',
                <UserFeatures>{
                    office: {
                        googleWorkspace: 'false',
                    },
                },
                testKit.session.getHeaders({
                    platformVersion: '12',
                    platformType: PlatformType.Android,
                }),
                [
                    {
                        ...clone(publicService),
                        code: 'officeOfficialWorkspace',
                        status: PublicServiceStatus.active,
                        platformMinVersion: {
                            [PlatformType.Android]: '13',
                        },
                    },
                ],
                (): void => {
                    utilsMock.filterByAppVersions.mockReturnValueOnce([])
                    compareVersionsMock.compare.mockReturnValueOnce(false)
                },
                [
                    {
                        ...clone(publicService),
                        code: 'officeOfficialWorkspace',
                        status: PublicServiceStatus.inactive,
                        contextMenu: [],
                        profileFeature: undefined,
                    },
                ],
            ],
            [
                PublicServiceStatus.active,
                'no app versions by session',
                {},
                testKit.session.getHeaders({
                    platformVersion: '12',
                    platformType: PlatformType.Android,
                }),
                [
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.active,
                        platformMinVersion: {
                            [PlatformType.Android]: '13',
                        },
                        appVersions: undefined,
                        segments: [],
                    },
                ],
                (): void => {
                    utilsMock.filterByAppVersions.mockReturnValueOnce([])
                    compareVersionsMock.compare.mockReturnValueOnce(false)
                },
                [
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.active,
                        contextMenu: [],
                        profileFeature: undefined,
                        appVersions: undefined,
                        segments: [],
                    },
                ],
            ],
            [
                PublicServiceStatus.active,
                'public service version by session type is equal to required app version',
                {},
                testKit.session.getHeaders({
                    platformVersion: '12',
                    platformType: PlatformType.Android,
                    appVersion: '1.0.0',
                }),
                [
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.active,
                        platformMinVersion: {
                            [PlatformType.Android]: '13',
                        },
                        appVersions: { [SessionType.User]: { versions: { [PlatformType.Android]: ['1.0.0'] } } },
                        segments: [],
                    },
                ],
                (): void => {
                    utilsMock.filterByAppVersions.mockReturnValueOnce([])
                    compareVersionsMock.compare.mockReturnValueOnce(false).mockReturnValueOnce(true)
                },
                [
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.active,
                        contextMenu: [],
                        profileFeature: undefined,
                        appVersions: { [SessionType.User]: { versions: { [PlatformType.Android]: ['1.0.0'] } } },
                        segments: [],
                    },
                ],
            ],
            [
                PublicServiceStatus.active,
                'public service min version by session type is equal or less then required min version by platform type',
                {},
                testKit.session.getHeaders({
                    platformVersion: '12',
                    platformType: PlatformType.Android,
                    appVersion: '1.0.0',
                }),
                [
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.active,
                        platformMinVersion: {
                            [PlatformType.Android]: '13',
                        },
                        appVersions: {
                            [SessionType.User]: {
                                versions: { [PlatformType.Android]: ['1.0.0'] },
                                minVersion: { [PlatformType.Android]: '1.0.0' },
                            },
                        },
                        segments: [],
                    },
                ],
                (): void => {
                    utilsMock.filterByAppVersions.mockReturnValueOnce([])
                    compareVersionsMock.compare.mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(true)
                },
                [
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.active,
                        contextMenu: [],
                        profileFeature: undefined,
                        appVersions: {
                            [SessionType.User]: {
                                versions: { [PlatformType.Android]: ['1.0.0'] },
                                minVersion: { [PlatformType.Android]: '1.0.0' },
                            },
                        },
                        segments: [],
                    },
                ],
            ],
            [
                PublicServiceStatus.inactive,
                'none of desired conditions are met related to app version or user features',
                {},
                testKit.session.getHeaders({
                    platformVersion: '12',
                    platformType: PlatformType.Android,
                    appVersion: '1.0.0',
                }),
                [
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.active,
                        platformMinVersion: {
                            [PlatformType.Android]: '13',
                        },
                        appVersions: {
                            [SessionType.User]: {
                                versions: { [PlatformType.Android]: ['1.0.0'] },
                                minVersion: { [PlatformType.Android]: '1.0.0' },
                            },
                        },
                        segments: [],
                    },
                ],
                (): void => {
                    utilsMock.filterByAppVersions.mockReturnValueOnce([])
                    compareVersionsMock.compare.mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(false)
                },
                [
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.inactive,
                        contextMenu: [],
                        profileFeature: undefined,
                        appVersions: {
                            [SessionType.User]: {
                                versions: { [PlatformType.Android]: ['1.0.0'] },
                                minVersion: { [PlatformType.Android]: '1.0.0' },
                            },
                        },
                        segments: [],
                    },
                ],
            ],
            [
                'correct status (active or inactive)',
                'segments list is not empty',
                {},
                testKit.session.getHeaders({
                    platformVersion: '12',
                    platformType: PlatformType.Android,
                }),
                [
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.active,
                        platformMinVersion: {
                            [PlatformType.Android]: '13',
                        },
                        appVersions: undefined,
                        segments: ['segment1'],
                    },
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.active,
                        platformMinVersion: {
                            [PlatformType.Android]: '13',
                        },
                        appVersions: undefined,
                        segments: ['segment2'],
                    },
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.active,
                        platformMinVersion: {
                            [PlatformType.Android]: '13',
                        },
                        appVersions: undefined,
                        segments: [],
                        contextMenu: undefined,
                    },
                ],
                (): void => {
                    utilsMock.filterByAppVersions.mockReturnValueOnce([]).mockReturnValueOnce([])
                    compareVersionsMock.compare.mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(true)
                    userServiceClient.getSubscribedSegments
                        .mockResolvedValueOnce({ segments: ['segment1'] })
                        .mockResolvedValueOnce({ segments: ['segment1'] })
                        .mockResolvedValueOnce({ segments: ['segment1'] })
                },
                [
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.active,
                        contextMenu: [],
                        profileFeature: undefined,
                        appVersions: undefined,
                        segments: ['segment1'],
                    },
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.inactive,
                        contextMenu: [],
                        profileFeature: undefined,
                        appVersions: undefined,
                        segments: ['segment2'],
                    },
                    {
                        ...clone(publicService),
                        status: PublicServiceStatus.inactive,
                        contextMenu: undefined,
                        profileFeature: undefined,
                        appVersions: undefined,
                        segments: [],
                    },
                ],
            ],
        ])(
            'should transform publicService to %s when %s',
            async (_status, _msg, features, headers, foundPublicServices, defineSpies, expectedResponse) => {
                const session = testKit.session.getUserSession()

                mongooseMock.setResultChain(['find', 'sort', 'lean'], foundPublicServices)
                defineSpies()

                await expect(service.getPublicServices(session.user, features, headers)).resolves.toEqual(expectedResponse)
            },
        )
    })

    describe('method: isPublicServiceAvailableByCode', () => {
        it('should return false when publicService by code not found', async () => {
            const copyPublicService = clone(publicService)
            const headers = testKit.session.getHeaders()

            mongooseMock.setResultChain(['find', 'sort', 'lean'], [copyPublicService])

            await expect(service.isPublicServiceAvailableByCode('administrativeFees', SessionType.User, {}, headers)).resolves.toBeFalsy()
        })

        it('should return false when publicService is inactive', async () => {
            const copyPublicService = clone(publicService)
            const headers = testKit.session.getHeaders()

            const inactivePublicService = merge(copyPublicService, {
                status: PublicServiceStatus.inactive,
            })

            mongooseMock.setResultChain(['find', 'sort', 'lean'], [inactivePublicService])

            await expect(
                service.isPublicServiceAvailableByCode(inactivePublicService.code, SessionType.User, {}, headers),
            ).resolves.toBeFalsy()
        })

        it.each([
            [
                testKit.session.getHeaders({
                    platformType: undefined,
                }),
            ],
            [
                testKit.session.getHeaders({
                    appVersion: undefined,
                }),
            ],

            [
                testKit.session.getHeaders({
                    platformVersion: undefined,
                }),
            ],
        ])('should return false when headers has incomplete information', async (headers) => {
            const copyPublicService = clone(publicService)

            mongooseMock.setResultChain(['find', 'sort', 'lean'], [copyPublicService])

            await expect(service.isPublicServiceAvailableByCode(copyPublicService.code, SessionType.User, {}, headers)).resolves.toBeFalsy()
        })

        it('should return false for sessionType which is not present in publicService', async () => {
            const copyPublicService = clone(publicService)
            const headers = testKit.session.getHeaders()

            mongooseMock.setResultChain(['find', 'sort', 'lean'], [copyPublicService])

            await expect(
                service.isPublicServiceAvailableByCode(copyPublicService.code, SessionType.CabinetUser, {}, headers),
            ).resolves.toBeFalsy()
        })

        it('should return false when publicService has featureProfiles but user hasn`t', async () => {
            const copyPublicService = clone(publicService)
            const headers = testKit.session.getHeaders()
            const publicServiceWithFeatureProfiles = merge(copyPublicService, {
                profileFeature: [ProfileFeature.office],
            })

            mongooseMock.setResultChain(['find', 'sort', 'lean'], [publicServiceWithFeatureProfiles])

            await expect(service.isPublicServiceAvailableByCode(copyPublicService.code, SessionType.User, {}, headers)).resolves.toBeFalsy()
        })

        it('should return false when user headers has lover version then publicService', async () => {
            const copyPublicService = clone(publicService)
            const headers = testKit.session.getHeaders({
                appVersion: '3.0.0',
                platformType: PlatformType.Android,
            })
            const publicServiceWithFeatureProfiles = merge(copyPublicService, {
                profileFeature: [ProfileFeature.office],
            })

            mongooseMock.setResultChain(['find', 'sort', 'lean'], [publicServiceWithFeatureProfiles])

            await expect(service.isPublicServiceAvailableByCode(copyPublicService.code, SessionType.User, {}, headers)).resolves.toBeFalsy()
        })
    })

    describe('method: createPublicService', () => {
        it('should successfully create new public service', async () => {
            const publicServiceInstance = new publicServiceModel(publicService)

            jest.spyOn(publicServiceModel, 'create').mockResolvedValueOnce([publicServiceInstance])

            expect(await service.createPublicService(publicService)).toEqual([publicServiceInstance])

            expect(publicServiceModel.create).toHaveBeenCalledWith(publicService)
        })

        it.each([
            [
                'duplicate key',
                new ApiError('Duplicate key', MongoDBErrorCode.DuplicateKey),
                new BadRequestError(`Public service ${publicService.code} already exists`),
            ],
            ['unknown error', new ApiError('Unknown error', 0), new ApiError('Unknown error', 0)],
        ])('should fail with error in case %s', async (_msg, rejectedError, expectedError) => {
            utilsMock.handleError.mockImplementationOnce((err, cb) => {
                cb(err)
            })
            jest.spyOn(publicServiceModel, 'create').mockRejectedValueOnce(rejectedError)

            await expect(async () => {
                await service.createPublicService(publicService)
            }).rejects.toEqual(expectedError)

            expect(publicServiceModel.create).toHaveBeenCalledWith(publicService)
        })
    })

    describe('method: getPublicServiceContextMenu', () => {
        it('should successfully return public service context menu', async () => {
            const code = 'childResidenceRegistration'
            const headers = testKit.session.getHeaders()
            const publicServiceInstance = new publicServiceModel(publicService)

            mongooseMock.setResultChain(['find', 'sort', 'lean'], [publicServiceInstance])
            jest.spyOn(asyncStorage, 'getStore').mockReturnValueOnce({ headers })
            utilsMock.filterByAppVersions.mockReturnValueOnce(publicServiceInstance.contextMenu)

            expect(await service.getPublicServiceContextMenu(code)).toEqual(publicServiceInstance.contextMenu)

            expect(asyncStorage.getStore).toHaveBeenCalledWith()
            expect(utilsMock.filterByAppVersions).toHaveBeenCalledWith(publicServiceInstance.contextMenu, headers)
        })

        it('should successfully return empty public service context menu in case public service not found', async () => {
            const code = 'administrativeFees'
            const publicServiceInstance = new publicServiceModel(publicService)

            mongooseMock.setResultChain(['find', 'sort', 'lean'], [publicServiceInstance])

            expect(await service.getPublicServiceContextMenu(code)).toEqual([])
        })
    })

    describe('method: getPublicServicesList', () => {
        it('should successfully get public services list', async () => {
            const publicServiceInstance = new publicServiceModel(publicService)
            const mappedPublicService = {
                ...publicService,
                id: publicServiceInstance._id.toString(),
            }

            jest.spyOn(publicServiceModel, 'countDocuments').mockResolvedValueOnce(1)
            mongooseMock.setResultChain(['find', 'sort', 'lean'], [publicServiceInstance])
            jest.spyOn(publicServiceDataMapper, 'toEntity').mockReturnValueOnce(mappedPublicService)

            expect(await service.getPublicServicesList({ skip: 0, limit: 10 })).toEqual({
                total: 1,
                publicServices: [mappedPublicService],
            })

            expect(publicServiceModel.countDocuments).toHaveBeenCalledWith()
            expect(publicServiceDataMapper.toEntity).toHaveBeenCalledWith(publicServiceInstance)
        })
    })

    describe('method: updatePublicService', () => {
        it('should successfully update public service', async () => {
            const publicServiceInstance = new publicServiceModel(publicService)

            mongooseMock.setResultChain(['findOneAndUpdate', 'lean'], publicServiceInstance)

            expect(await service.updatePublicService(publicServiceInstance)).toEqual(publicServiceInstance)
        })

        it('should fail with error in case public service not found for update', async () => {
            const publicServiceInstance = new publicServiceModel(publicService)

            mongooseMock.setResultChain(['findOneAndUpdate', 'lean'], null)

            await expect(async () => {
                await service.updatePublicService(publicServiceInstance)
            }).rejects.toEqual(new ModelNotFoundError(publicServiceModel.modelName, publicService.code))
        })
    })
})
