import { PublicServiceContextMenuType, PublicServiceStatus, SessionType } from '@diia-inhouse/types'

import {
    GetPublicServicesResponse,
    PublicService,
    PublicServiceCategory,
    PublicServiceCategoryStatus,
    PublicServiceTabCode,
} from '@src/generated'

export const publicService: PublicService = {
    code: 'childResidenceRegistration',
    name: 'Child residence registration',
    status: PublicServiceStatus.active,
    sortOrder: 100,
    contextMenu: [
        {
            type: PublicServiceContextMenuType.assistantScreen,
            code: 'childResidenceRegistration',
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
    categories: ['residence'],
    segments: [],
    locales: {
        en: '',
    },
}

export const publicServiceCategories: PublicServiceCategory[] = [
    {
        category: 'residence',
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
            code: 'residence',
            name: 'Residence',
            icon: '👦🏻',
            status: PublicServiceCategoryStatus.active,
            sortOrder: 100,
            visibleSearch: false,
            tabCode: PublicServiceTabCode.citizen,
            tabCodes: [PublicServiceTabCode.citizen],
            publicServices: [
                {
                    code: 'childResidenceRegistration',
                    name: 'Child residence registration',
                    status: PublicServiceStatus.active,
                    sortOrder: 100,
                    search: 'Child residence registration',
                    contextMenu: [
                        {
                            type: PublicServiceContextMenuType.assistantScreen,
                            code: 'childResidenceRegistration',
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
