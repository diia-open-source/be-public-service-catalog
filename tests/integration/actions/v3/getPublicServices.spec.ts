import { head } from 'lodash'

import TestKit from '@diia-inhouse/test'
import { DiiaOfficeStatus, ProfileFeature, PublicServiceCode, PublicServiceStatus, PublicServiceTabCode } from '@diia-inhouse/types'

import GetPublicServicesAction from '@actions/v3/getPublicServices'

import publicServiceModel from '@models/publicService'

import { getApp } from '@tests/utils/getApp'

import { PublicServiceModel } from '@interfaces/models/publicService'

describe(`Action ${GetPublicServicesAction.name}`, () => {
    let app: Awaited<ReturnType<typeof getApp>>
    const testKit = new TestKit()
    let getPublicServicesAction: GetPublicServicesAction

    beforeAll(async () => {
        app = await getApp()

        getPublicServicesAction = app.container.build(GetPublicServicesAction)

        await app.start()
    })

    afterAll(async () => {
        await app.stop()
    })

    it('should filter service that not available for an user by app version', async () => {
        // arrange
        const { headers, session } = testKit.session.getUserActionArguments({}, { appVersion: '3.0.1' })
        const code = PublicServiceCode.criminalRecordCertificate
        const { categories } = <PublicServiceModel>await publicServiceModel.findOne({ code, status: PublicServiceStatus.active })

        // act
        const { publicServicesCategories } = await getPublicServicesAction.handler({ headers, session })

        // assert
        const publicService = publicServicesCategories
            .find((item) => categories.includes(item.code))
            ?.publicServices.find((item) => item.code === code)

        expect(publicService).toBeUndefined()
    })

    it('should return service that available for an user by app version', async () => {
        // arrange
        const { headers, session } = testKit.session.getUserActionArguments()
        const code = PublicServiceCode.criminalRecordCertificate
        const { categories } = <PublicServiceModel>await publicServiceModel.findOne({ code, status: PublicServiceStatus.active })

        // act
        const { publicServicesCategories } = await getPublicServicesAction.handler({ headers, session })

        // assert
        const publicService = publicServicesCategories
            .find((item) => categories.includes(item.code))!
            .publicServices.find((item) => item.code === code)

        expect(publicService!.status).toBe(PublicServiceStatus.active)
    })

    it('must not return office tab for user without office feature', async () => {
        // arrange
        const { headers, session } = testKit.session.getUserActionArguments()

        // act
        const { tabs } = await getPublicServicesAction.handler({ headers, session })

        // assert
        const officeTab = tabs.find((item) => item.code === PublicServiceTabCode.office)

        expect(officeTab).toBeUndefined()
    })

    it('must not return office tab for user which office feature is not ACTIVE', async () => {
        // arrange
        const { headers, session } = testKit.session.getUserActionArguments()
        const features = {
            [ProfileFeature.office]: {
                officeIdentifier: 'test',
                profileId: 'test',
                unitId: 'test',
                status: DiiaOfficeStatus.DISMISSED,
                tokenFailedAt: undefined,
                isOrganizationAdmin: false,
                organizationId: 'test',
                scopes: [],
            },
        }

        // act
        const { tabs } = await getPublicServicesAction.handler({ headers, session: { ...session, features } })

        // assert
        const officeTab = tabs.find((item) => item.code === PublicServiceTabCode.office)

        expect(officeTab).toBeUndefined()
    })

    it('should match legacy tabCode with first tabCodes', async () => {
        // arrange
        const { headers, session } = testKit.session.getUserActionArguments()
        const features = {
            [ProfileFeature.office]: {
                officeIdentifier: 'test',
                profileId: 'test',
                unitId: 'test',
                status: DiiaOfficeStatus.ACTIVE,
                tokenFailedAt: undefined,
                isOrganizationAdmin: false,
                organizationId: 'test',
                scopes: [],
            },
        }

        // act
        const { publicServicesCategories } = await getPublicServicesAction.handler({ headers, session: { ...session, features } })

        // assert
        publicServicesCategories.forEach((category) => {
            expect(category.tabCode).toBe(head(category.tabCodes))
        })
    })
})
