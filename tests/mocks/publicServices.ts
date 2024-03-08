import {
    PublicServiceCategoryCode,
    PublicServiceCode,
    PublicServiceContextMenuType,
    PublicServiceStatus,
    PublicServiceTabCode,
    SessionType,
} from '@diia-inhouse/types'

import { GetPublicServicesResponse, PublicService, PublicServiceCategory, PublicServiceCategoryStatus } from '@src/generated'

export const publicService: PublicService = {
    code: PublicServiceCode.criminalRecordCertificate,
    name: 'Довідка про несудимість',
    status: PublicServiceStatus.active,
    sortOrder: 100,
    contextMenu: [
        {
            type: PublicServiceContextMenuType.assistantScreen,
            code: PublicServiceCode.criminalRecordCertificate,
            name: 'Questions and answers',
        },
        {
            type: PublicServiceContextMenuType.assistantScreen,
            name: 'Support service',
        },
    ],
    appVersions: {
        [SessionType.User]: {
            minVersion: {
                Android: '3.0.8',
                iOS: '3.0.8',
            },
        },
    },
    sessionTypes: [SessionType.User],
    categories: [PublicServiceCategoryCode.certificates],
    segments: [],
    locales: {
        en: '',
    },
}

export const publicServiceCategories: PublicServiceCategory[] = [
    {
        category: PublicServiceCategoryCode.certificates,
        name: 'Residence',
        icon: '👦🏻',
        status: PublicServiceCategoryStatus.active,
        sortOrder: 100,
        tabCodes: [PublicServiceTabCode.citizen],
        locales: {
            EN: 'En',
        },
    },
]

export const publicServiceCategoryResponse: GetPublicServicesResponse = {
    publicServicesCategories: [
        {
            code: PublicServiceCategoryCode.certificates,
            name: 'Residence',
            icon: '👦🏻',
            status: PublicServiceCategoryStatus.active,
            sortOrder: 100,
            visibleSearch: false,
            tabCode: PublicServiceTabCode.citizen,
            tabCodes: [PublicServiceTabCode.citizen],
            publicServices: [
                {
                    code: PublicServiceCode.criminalRecordCertificate,
                    name: 'Довідка про несудимість',
                    status: PublicServiceStatus.active,
                    sortOrder: 100,
                    search: 'Довідка про несудимість',
                    contextMenu: [
                        {
                            type: PublicServiceContextMenuType.assistantScreen,
                            code: PublicServiceCode.criminalRecordCertificate,
                            name: 'Questions and answers',
                        },
                        {
                            type: PublicServiceContextMenuType.assistantScreen,
                            name: 'Support service',
                        },
                    ],
                },
            ],
        },
    ],
    tabs: [
        {
            code: PublicServiceTabCode.citizen,
            name: 'Громадянам',
        },
    ],
}
