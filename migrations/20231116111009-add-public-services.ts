import 'module-alias/register'
import { mongo } from '@diia-inhouse/db'
import { Env } from '@diia-inhouse/env'
import { PlatformType, ProfileFeature, PublicServiceContextMenuType, PublicServiceStatus, SessionType } from '@diia-inhouse/types'

const collectionName = 'publicservices'

export async function up(db: mongo.Db): Promise<void> {
    const isProd = process.env.NODE_ENV === Env.Prod
    const ratingContextMenuItem = {
        type: PublicServiceContextMenuType.rating,
        name: 'Оцінити послугу',
    }
    const ratingContextMenuItemWithAppVersions = {
        ...ratingContextMenuItem,
        appVersions: {
            minVersion: {
                [PlatformType.Android]: '3.0.0',
                [PlatformType.Huawei]: '3.0.00',
                [PlatformType.iOS]: '3.0.0',
                [PlatformType.Browser]: '',
            },
        },
    }
    const publicServices: Record<string, unknown>[] = [
        {
            code: 'penalties',
            name: 'Штрафи ПДР',
            status: PublicServiceStatus.active,
            sortOrder: 610,
            categories: ['carServices'],
            sessionTypes: [SessionType.User],
        },
        {
            code: 'debts',
            name: 'Виконавчі провадження',
            status: PublicServiceStatus.active,
            sortOrder: 1510,
            categories: ['debts'],
            sessionTypes: [SessionType.User],
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'debts',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ...(isProd ? [] : [ratingContextMenuItem]),
            ],
        },
        {
            code: 'residenceRegistration',
            name: 'Реєстрація місця проживання',
            status: PublicServiceStatus.active,
            sortOrder: 710,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'residenceRegistration',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ...(isProd ? [{ ...ratingContextMenuItem }] : [ratingContextMenuItemWithAppVersions]),
            ],
            categories: ['residence'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.62.1233' : '2.0.17',
                        [PlatformType.Android]: isProd ? '3.0.72.1185' : '2.0.33',
                        [PlatformType.Huawei]: isProd ? '3.0.72.1185' : '2.0.33',
                    },
                },
            },
        },
        {
            code: 'socialAssistancePrograms',
            name: 'Одноразова допомога ФОПам та найманим працівникам',
            status: PublicServiceStatus.inactive,
            sortOrder: 130,
            categories: ['socialPayments'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '2.0.29',
                        [PlatformType.Huawei]: '2.0.29',
                        [PlatformType.iOS]: '2.0.14',
                    },
                },
            },
        },
        {
            code: 'replacementDriverLicense',
            name: 'Заміна посвідчення водія',
            status: PublicServiceStatus.active,
            sortOrder: 630,
            sessionTypes: [SessionType.User],
            categories: ['carServices'],
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'replacementDriverLicense',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: isProd ? '3.0.64.1260' : '3.0.0',
                            [PlatformType.Android]: isProd ? '3.0.73.1214' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.73.1214' : '3.0.00',
                            [PlatformType.Browser]: '',
                        },
                    },
                },
            ],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.59.1137' : '2.0.17',
                        [PlatformType.Android]: isProd ? '3.0.68.1133' : '2.0.33',
                        [PlatformType.Huawei]: isProd ? '3.0.67.1129' : '2.0.33',
                    },
                },
            },
        },
        {
            code: 'covidVaccination',
            name: 'Вакцинація',
            status: PublicServiceStatus.inactive,
            sortOrder: 120,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'covidVaccination',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['medicalServices'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '2.0.27',
                        [PlatformType.Huawei]: '2.0.27',
                        [PlatformType.iOS]: '2.0.11',
                    },
                },
            },
        },
        {
            code: 'privateEntrepreneur',
            name: 'Податки ФОП',
            status: PublicServiceStatus.active,
            sortOrder: 1110,
            categories: ['taxServices'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.2.369' : '2.0.17',
                        [PlatformType.Android]: isProd ? '3.0.8' : '2.0.33',
                        [PlatformType.Huawei]: isProd ? '3.0.8' : '2.0.33',
                    },
                },
            },
        },
        {
            code: 'administrativeFees',
            name: 'Сплата послуг за QR-кодом',
            status: PublicServiceStatus.inactive,
            sortOrder: 170,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'administrativeFees',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['payments'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '2.0.33',
                        [PlatformType.Huawei]: '2.0.33',
                        [PlatformType.iOS]: '2.0.17',
                    },
                },
            },
        },
        {
            code: 'petitions',
            name: 'Петиції',
            status: PublicServiceStatus.inactive,
            sortOrder: 145,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'petitions',
                },
                {
                    type: PublicServiceContextMenuType.communityContacts,
                    name: 'Контакти громади',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['petitions'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.3',
                        [PlatformType.Huawei]: '3.0.3',
                        [PlatformType.iOS]: '3.0.3',
                    },
                },
            },
        },
        {
            code: 'vaccinationCertificate',
            name: 'COVID-сертифікати',
            status: PublicServiceStatus.active,
            sortOrder: 1810,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'vaccinationCertificate',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['medicalServices'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.8',
                        [PlatformType.Huawei]: '3.0.8',
                        [PlatformType.iOS]: '3.0.8',
                    },
                },
            },
        },
        {
            code: 'childVaccinationCertificate',
            name: 'COVID-сертифікати моїх дітей',
            status: PublicServiceStatus.active,
            sortOrder: 1820,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'vaccinationCertificate',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['medicalServices'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.16',
                        [PlatformType.Huawei]: '3.0.16',
                        [PlatformType.iOS]: '3.0.20',
                    },
                },
            },
        },
        {
            code: 'poll',
            name: 'Опитування',
            status: PublicServiceStatus.active,
            sortOrder: 810,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'poll',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: isProd ? '3.0.64.1257' : '3.0.0',
                            [PlatformType.Android]: isProd ? '3.0.73.1199' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.73.1199' : '3.0.00',
                        },
                    },
                },
            ],
            categories: ['poll'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.42' : '3.0.30',
                        [PlatformType.Android]: isProd ? '3.0.51.954' : '3.0.30',
                        [PlatformType.Huawei]: isProd ? '3.0.51.954' : '3.0.30',
                    },
                },
            },
        },
        {
            code: 'vaccinationAid',
            name: 'єПідтримка',
            status: PublicServiceStatus.inactive,
            sortOrder: 2010,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'vaccinationAid',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['socialSupport'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: isProd ? '3.0.19' : '3.0.20',
                        [PlatformType.Huawei]: isProd ? '3.0.19' : '3.0.20',
                        [PlatformType.iOS]: isProd ? '3.0.22' : '3.0.23',
                    },
                },
            },
        },
        {
            code: 'ok5Certificate',
            name: 'Довідка ОК-5',
            status: PublicServiceStatus.active,
            sortOrder: 1610,
            categories: ['certificates'],
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'okCertificates',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: isProd ? '3.0.62.1233' : '3.0.0',
                            [PlatformType.Android]: isProd ? '3.0.71.1178' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.71.1178' : '3.0.00',
                        },
                    },
                },
            ],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.30',
                        [PlatformType.Huawei]: '3.0.30',
                        [PlatformType.iOS]: '3.0.30',
                    },
                },
            },
        },
        {
            code: 'ok7Certificate',
            name: 'Довідка ОК-7',
            status: PublicServiceStatus.active,
            sortOrder: 1620,
            categories: ['certificates'],
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'okCertificates',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: isProd ? '3.0.62.1233' : '3.0.0',
                            [PlatformType.Android]: isProd ? '3.0.71.1178' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.71.1178' : '3.0.00',
                        },
                    },
                },
            ],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.30',
                        [PlatformType.Huawei]: '3.0.30',
                        [PlatformType.iOS]: '3.0.30',
                    },
                },
            },
        },
        {
            code: 'criminalRecordCertificate',
            name: isProd ? 'Витяг про несудимість' : 'Довідка про несудимість',
            status: PublicServiceStatus.active,
            sortOrder: 1630,
            categories: ['certificates'],
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'criminalRecordCertificate',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: isProd ? '3.0.64.1260' : '3.0.0',
                            [PlatformType.Android]: isProd ? '3.0.73.1214' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.73.1214' : '3.0.00',
                        },
                    },
                },
            ],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.57.1106' : '3.0.30',
                        [PlatformType.Android]: isProd ? '3.0.64.1105' : '3.0.30',
                        [PlatformType.Huawei]: isProd ? '3.0.64.1105' : '3.0.30',
                    },
                },
            },
        },
        {
            code: 'properUser',
            name: 'Належний користувач',
            status: PublicServiceStatus.active,
            sortOrder: 620,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'properUser',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: isProd ? '3.0.64.1260' : '3.0.0',
                            [PlatformType.Android]: isProd ? '3.0.73.1214' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.73.1214' : '3.0.00',
                        },
                    },
                },
            ],
            categories: ['carServices'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.43.892' : '3.0.30',
                        [PlatformType.Android]: isProd ? '3.0.50.945' : '3.0.30',
                        [PlatformType.Huawei]: isProd ? '3.0.50.945' : '3.0.30',
                    },
                },
            },
        },
        {
            code: 'militaryDonation',
            name: 'Допомога армії',
            status: PublicServiceStatus.active,
            sortOrder: 110,
            contextMenu: isProd
                ? []
                : [
                      {
                          type: PublicServiceContextMenuType.fundDetails,
                          name: 'Детальніше про фонд',
                      },
                      {
                          type: PublicServiceContextMenuType.supportServiceScreen,
                          name: 'Служба підтримки',
                      },
                  ],
            categories: ['donation'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.34',
                        [PlatformType.Huawei]: '3.0.34',
                        [PlatformType.iOS]: '3.0.33',
                    },
                },
            },
        },
        {
            code: 'enemyTrack',
            name: 'єВорог',
            status: isProd ? PublicServiceStatus.inactive : PublicServiceStatus.active,
            sortOrder: 90,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['trackTogether'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.34',
                        [PlatformType.Huawei]: '3.0.34',
                        [PlatformType.iOS]: '3.0.33',
                    },
                },
            },
        },
        {
            code: 'diiaTv',
            name: 'Дія.TV',
            status: PublicServiceStatus.active,
            sortOrder: 1710,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: isProd ? 'diiaTv' : 'diiaRadio',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: isProd ? '3.0.61.1211' : '3.0.0',
                            [PlatformType.Android]: isProd ? '3.0.70.1169' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.70.1169' : '3.0.00',
                        },
                    },
                },
            ],
            categories: ['games'],
            sessionTypes: isProd ? [SessionType.User, 'InternationalUser'] : [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.35',
                        [PlatformType.Huawei]: '3.0.35',
                        [PlatformType.iOS]: '3.0.34',
                    },
                },
            },
        },
        {
            code: 'diiaRadio',
            name: 'Дія.Радіо',
            status: PublicServiceStatus.active,
            sortOrder: 1720,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'diiaRadio',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: isProd ? '3.0.61.1211' : '3.0.0',
                            [PlatformType.Android]: isProd ? '3.0.70.1169' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.70.1169' : '3.0.00',
                        },
                    },
                },
            ],
            categories: ['games'],
            sessionTypes: isProd ? [SessionType.User, 'InternationalUser'] : [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.37',
                        [PlatformType.Huawei]: '3.0.37',
                        [PlatformType.iOS]: '3.0.35',
                    },
                },
            },
        },
        {
            code: 'patientConsultation',
            name: 'Отримати консультацію лікаря',
            status: PublicServiceStatus.inactive,
            sortOrder: 2110,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['medicalConsultations'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.38',
                        [PlatformType.Huawei]: '3.0.38',
                        [PlatformType.iOS]: '3.0.36',
                    },
                },
            },
        },
        {
            code: 'doctorConsultation',
            name: 'Я — лікар та хочу надавати консультації',
            status: PublicServiceStatus.inactive,
            sortOrder: 2120,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['medicalConsultations'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.38',
                        [PlatformType.Huawei]: '3.0.38',
                        [PlatformType.iOS]: '3.0.36',
                    },
                },
            },
        },
        {
            code: 'bayraktar',
            name: 'єБайрактар',
            status: PublicServiceStatus.inactive,
            sortOrder: 220,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['games'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.39',
                        [PlatformType.Huawei]: '3.0.39',
                        [PlatformType.iOS]: isProd ? '3.0.36' : '3.0.38',
                    },
                },
            },
            platformMinVersion: {
                [PlatformType.Android]: '5.1',
                [PlatformType.Huawei]: '5.1',
            },
        },
        {
            code: 'damagedProperty',
            name: 'Повідомити про пошкоджене майно',
            status: PublicServiceStatus.active,
            sortOrder: 510,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'damagedProperty',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ratingContextMenuItem,
            ],
            sessionTypes: [SessionType.User],
            categories: ['property'],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.40',
                        [PlatformType.Huawei]: '3.0.40',
                        [PlatformType.iOS]: '3.0.37',
                    },
                },
            },
        },
        {
            code: 'internallyDisplacedPerson',
            name: 'Допомога для ВПО',
            status: isProd ? PublicServiceStatus.inactive : PublicServiceStatus.active,
            sortOrder: 1010,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'referenceInternallyDisplacedPerson',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ratingContextMenuItem,
            ],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.41' : '3.0.38',
                        [PlatformType.Android]: isProd ? '3.0.45' : '3.0.40',
                        [PlatformType.Huawei]: isProd ? '3.0.45' : '3.0.40',
                    },
                },
            },
            categories: ['internallyDisplacedPersons'],
            sessionTypes: [SessionType.User],
        },
        {
            code: 'unemploymentStatus',
            name: 'Отримати статус безробітного',
            status: PublicServiceStatus.active,
            sortOrder: 1210,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'unemploymentBenefits',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: isProd ? '3.0.64.1257' : '3.0.0',
                            [PlatformType.Android]: isProd ? '3.0.73.1199' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.73.1199' : '3.0.00',
                        },
                    },
                },
            ],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: isProd ? '3.0.45' : '3.0.42',
                        [PlatformType.Huawei]: isProd ? '3.0.45' : '3.0.42',
                        [PlatformType.iOS]: isProd ? '3.0.41' : '3.0.40',
                    },
                },
            },
            categories: ['unemploymentBenefits'],
            sessionTypes: [SessionType.User],
        },
        {
            code: 'unemploymentStatusCanceling',
            name: 'Скасувати статус безробітного',
            status: PublicServiceStatus.active,
            sortOrder: 1220,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'unemploymentBenefits',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: isProd ? '3.0.64.1257' : '3.0.0',
                            [PlatformType.Android]: isProd ? '3.0.73.1199' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.73.1199' : '3.0.00',
                        },
                    },
                },
            ],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: isProd ? '3.0.45' : '3.0.42',
                        [PlatformType.Huawei]: isProd ? '3.0.45' : '3.0.42',
                        [PlatformType.iOS]: isProd ? '3.0.41' : '3.0.40',
                    },
                },
            },
            categories: ['unemploymentBenefits'],
            sessionTypes: [SessionType.User],
        },
        {
            code: 'itForces',
            name: 'Посвідчення ІТ-сил',
            status: PublicServiceStatus.inactive,
            sortOrder: 0,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'itForces',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            sessionTypes: [SessionType.User],
            categories: [],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.44',
                        [PlatformType.Huawei]: '3.0.44',
                        [PlatformType.iOS]: '3.0.44',
                    },
                },
            },
        },
        {
            code: 'residenceCert',
            name: 'Витяг про місце проживання',
            status: PublicServiceStatus.active,
            sortOrder: 1640,
            categories: ['certificates'],
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'residenceCert',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: '3.0.64.1260',
                            [PlatformType.Android]: '3.0.73.1214',
                            [PlatformType.Huawei]: '3.0.73.1214',
                            [PlatformType.Browser]: '',
                        },
                    },
                },
            ],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: isProd ? '3.0.56.986' : '3.0.44',
                        [PlatformType.Huawei]: isProd ? '3.0.56.986' : '3.0.44',
                        [PlatformType.iOS]: isProd ? '3.0.49.974' : '3.0.44',
                    },
                },
            },
        },
        {
            code: 'residenceCertChildren',
            name: 'Витяг про місце проживання дитини',
            status: PublicServiceStatus.active,
            sortOrder: 1650,
            categories: ['certificates'],
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'residenceCert',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.Android]: '3.0.73.1214',
                            [PlatformType.Huawei]: '3.0.73.1214',
                            [PlatformType.iOS]: '3.0.64.1260',
                        },
                    },
                },
            ],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: isProd ? '3.0.56.986' : '3.0.44',
                        [PlatformType.Huawei]: isProd ? '3.0.56.986' : '3.0.44',
                        [PlatformType.iOS]: isProd ? '3.0.49.974' : '3.0.44',
                    },
                },
            },
        },
        {
            code: 'courtCases',
            name: isProd ? 'Судові справи' : 'Судові послуги',
            status: PublicServiceStatus.active,
            sortOrder: 1310,
            categories: ['courtServices'],
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'courtCases',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ratingContextMenuItemWithAppVersions,
            ],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: isProd ? '3.0.60.1032' : '3.0.44',
                        [PlatformType.Huawei]: isProd ? '3.0.60.1032' : '3.0.44',
                        [PlatformType.iOS]: isProd ? '3.0.54.1049' : '3.0.44',
                    },
                },
            },
        },
        {
            code: 'ledExchange',
            name: 'Обмін лампочок',
            status: PublicServiceStatus.active,
            sortOrder: 910,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: isProd ? 'ledExchange' : 'damagedProperty',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.Android]: isProd ? '3.0.73.1214' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.73.1214' : '3.0.00',
                            [PlatformType.iOS]: isProd ? '3.0.64.1260' : '3.0.0',
                        },
                    },
                },
            ],
            sessionTypes: [SessionType.User],
            categories: ['ledExchange'],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: isProd ? '3.0.61.1039' : '3.0.40',
                        [PlatformType.Huawei]: isProd ? '3.0.61.1039' : '3.0.40',
                        [PlatformType.iOS]: isProd ? '3.0.54.1049' : '3.0.38',
                    },
                },
            },
        },
        {
            code: 'droneArmy',
            name: 'Армія дронів',
            status: PublicServiceStatus.active,
            sortOrder: 1730,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'droneArmy',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['games'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: isProd ? '3.0.63.1096' : '3.0.0',
                        [PlatformType.Huawei]: isProd ? '3.0.63.1096' : '3.0.00',
                        [PlatformType.iOS]: isProd ? '3.0.56.1104' : '3.0.0',
                    },
                },
            },
        },
        {
            code: 'courtPenalties',
            name: 'Судові штрафи',
            status: PublicServiceStatus.active,
            sortOrder: 1320,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'courtPenalties',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ratingContextMenuItemWithAppVersions,
            ],
            sessionTypes: [SessionType.User],
            categories: ['courtServices'],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: isProd ? '3.0.78.1290' : '3.0.0',
                        [PlatformType.Huawei]: isProd ? '3.0.78.1290' : '3.0.00',
                        [PlatformType.iOS]: isProd ? '3.0.70.1353' : '3.0.0',
                    },
                },
            },
        },
        {
            code: 'officeOfficialSearch',
            name: 'Пошук колег',
            status: PublicServiceStatus.active,
            sortOrder: 2310,
            sessionTypes: [SessionType.User],
            categories: ['officeOfficialSearch'],
            profileFeature: ProfileFeature.office,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'ServicesStateServant',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ...(isProd ? [] : [ratingContextMenuItemWithAppVersions]),
            ],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.40',
                        [PlatformType.Huawei]: '3.0.40',
                        [PlatformType.iOS]: '3.0.38',
                    },
                },
            },
        },
        {
            code: 'officeBadges',
            name: 'Бейджі',
            status: PublicServiceStatus.active,
            sortOrder: 2210,
            sessionTypes: [SessionType.User],
            categories: ['officeBadges'],
            profileFeature: ProfileFeature.office,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'ServicesStateServant',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ...(isProd ? [] : [ratingContextMenuItemWithAppVersions]),
            ],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.40',
                        [PlatformType.Huawei]: '3.0.40',
                        [PlatformType.iOS]: '3.0.38',
                    },
                },
            },
        },
        {
            code: 'officeOfficialWorkspace',
            name: 'Воркспейс',
            status: PublicServiceStatus.active,
            sortOrder: 252,
            sessionTypes: [SessionType.User],
            categories: ['officeWorkspace'],
            profileFeature: ProfileFeature.office,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'ServicesStateServant',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ...(isProd ? [] : [ratingContextMenuItemWithAppVersions]),
            ],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.40',
                        [PlatformType.Huawei]: '3.0.40',
                        [PlatformType.iOS]: '3.0.38',
                    },
                },
            },
        },
        {
            code: 'officePolls',
            name: 'Опитування для колег',
            status: PublicServiceStatus.active,
            sortOrder: 2410,
            sessionTypes: [SessionType.User],
            categories: ['officePolls'],
            profileFeature: ProfileFeature.office,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'ServicesStateServant',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ...(isProd ? [] : [ratingContextMenuItemWithAppVersions]),
            ],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: '3.0.40',
                        [PlatformType.Huawei]: '3.0.40',
                        [PlatformType.iOS]: '3.0.38',
                    },
                },
            },
        },
        {
            code: 'trafficViolationPenalties',
            name: 'Штрафи ПДР',
            status: PublicServiceStatus.inactive,
            sortOrder: 241,
            sessionTypes: [SessionType.User],
            categories: ['penalties'],
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'penalties',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ...(isProd
                    ? [
                          {
                              ...ratingContextMenuItem,
                              appVersions: {
                                  minVersion: {
                                      [PlatformType.Android]: '3.0.73.1214',
                                      [PlatformType.Huawei]: '3.0.73.1214',
                                      [PlatformType.iOS]: '3.0.64.1260',
                                  },
                              },
                          },
                      ]
                    : []),
            ],
        },
        {
            code: 'militaryBonds',
            name: 'Військові облігації',
            status: PublicServiceStatus.active,
            sortOrder: 310,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'militaryBonds',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ...(isProd ? [] : [ratingContextMenuItemWithAppVersions]),
            ],
            sessionTypes: [SessionType.User],
            categories: ['bonds'],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.Android]: isProd ? '3.0.52.958' : '3.0.40',
                        [PlatformType.Huawei]: isProd ? '3.0.52.958' : '3.0.40',
                        [PlatformType.iOS]: isProd ? '3.0.44.909' : '3.0.38',
                    },
                },
            },
        },
        {
            code: 'eResidentPrivateEntrepreneur',
            name: 'e-Resident Entrepreneur',
            status: isProd ? PublicServiceStatus.inactive : PublicServiceStatus.active,
            sortOrder: 501,
            sessionTypes: [SessionType.EResident],
            categories: ['EResidentPrivateEntrepreneur'],
            contextMenu: undefined,
            appVersions: {
                [SessionType.EResident]: {
                    minVersion: {
                        [PlatformType.Android]: '1.0.0',
                        [PlatformType.Huawei]: '1.0.0',
                        [PlatformType.iOS]: '1.0.0',
                    },
                },
            },
        },
        {
            code: 'depositGuaranteePayments',
            name: 'Повернення вкладів',
            status: PublicServiceStatus.active,
            sortOrder: 1910,
            sessionTypes: [SessionType.User],
            categories: ['depositGuarantee'],
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    code: 'depositGuaranteePayments',
                    name: 'Питання та відповіді',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ...(isProd ? [] : [ratingContextMenuItemWithAppVersions]),
            ],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.66.1298' : '3.0.0',
                        [PlatformType.Android]: isProd ? '3.0.74.1234' : '3.0.0',
                        [PlatformType.Huawei]: isProd ? '3.0.74.1234' : '3.0.00',
                    },
                },
            },
        },
        {
            code: 'eResidentStatusTermination',
            name: 'Terminate e-Resident status',
            status: isProd ? PublicServiceStatus.inactive : PublicServiceStatus.active,
            sortOrder: 511,
            categories: ['eResidentStatusTermination'],
            sessionTypes: [SessionType.EResident],
        },
        {
            code: 'invincibilityPoints',
            name: isProd ? 'Мапа пунктів незламності' : 'Пункти Незламності та укриття',
            status: PublicServiceStatus.active,
            sortOrder: 210,
            contextMenu: [
                {
                    type: 'downloadList',
                    name: 'Завантажені мапи',
                    appVersions: {
                        minVersion: {
                            [PlatformType.iOS]: isProd ? '3.0.76.1420' : '3.0.0',
                            [PlatformType.Android]: isProd ? '3.0.83.1350' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.83.1350' : '3.0.00',
                            [PlatformType.Browser]: '',
                        },
                    },
                },
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'invincibilityPoints',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ratingContextMenuItem,
            ],
            categories: ['invincibilityPoints'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.68.1325' : '3.0.0',
                        [PlatformType.Android]: isProd ? '3.0.76.1262' : '3.0.0',
                        [PlatformType.Huawei]: isProd ? '3.0.76.1262' : '3.0.00',
                    },
                },
            },
        },
        {
            code: 'mortgage',
            name: 'єОселя',
            status: PublicServiceStatus.active,
            sortOrder: 1410,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'mortgage',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
            ],
            categories: ['lendingPrograms'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.53.1007' : '3.0.0',
                        [PlatformType.Android]: isProd ? '3.0.59.1009' : '3.0.0',
                        [PlatformType.Huawei]: isProd ? '3.0.59.1009' : '3.0.00',
                    },
                },
            },
        },
        {
            code: 'editInternallyDisplacedPersonAddress',
            name: 'Зміна адреси фактичного проживання ВПО',
            status: PublicServiceStatus.active,
            sortOrder: 1020,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'referenceInternallyDisplacedPerson',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.Android]: isProd ? '3.0.70.1169' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.70.1169' : '3.0.00',
                            [PlatformType.iOS]: isProd ? '3.0.61.1211' : '3.0.0',
                        },
                    },
                },
            ],
            categories: ['internallyDisplacedPersons'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.51.996' : '3.0.0',
                        [PlatformType.Android]: isProd ? '3.0.58.1002' : '3.0.0',
                        [PlatformType.Huawei]: isProd ? '3.0.58.1002' : '3.0.00',
                    },
                },
            },
        },
        {
            code: 'cancelInternallyDisplacedPerson',
            name: 'Скасувати статус ВПО',
            status: PublicServiceStatus.active,
            sortOrder: 1030,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'referenceInternallyDisplacedPerson',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    ...ratingContextMenuItem,
                    appVersions: {
                        minVersion: {
                            [PlatformType.Android]: isProd ? '3.0.70.1169' : '3.0.0',
                            [PlatformType.Huawei]: isProd ? '3.0.70.1169' : '3.0.00',
                            [PlatformType.iOS]: isProd ? '3.0.61.1211' : '3.0.0',
                        },
                    },
                },
            ],
            categories: ['internallyDisplacedPersons'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.51.996' : '3.0.0',
                        [PlatformType.Android]: isProd ? '3.0.58.1002' : '3.0.0',
                        [PlatformType.Huawei]: isProd ? '3.0.58.1002' : '3.0.00',
                    },
                },
            },
        },
        {
            code: 'damagedPropertyRecovery',
            name: 'Заяви про виплату',
            status: PublicServiceStatus.active,
            sortOrder: 520,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'damagedProperty',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ratingContextMenuItem,
            ],
            categories: ['property'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.58.1127' : '3.0.0',
                        [PlatformType.Android]: isProd ? '3.0.66.1125' : '3.0.0',
                        [PlatformType.Huawei]: isProd ? '3.0.66.1125' : '3.0.00',
                    },
                },
            },
        },
        {
            code: 'housingCertificates',
            name: 'Сертифікати на житло',
            status: PublicServiceStatus.active,
            sortOrder: 530,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'damagedProperty',
                },
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                ratingContextMenuItem,
            ],
            categories: ['property'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '3.0.65.1285' : '3.0.0',
                        [PlatformType.Android]: isProd ? '3.0.74.1234' : '3.0.0',
                        [PlatformType.Huawei]: isProd ? '3.0.74.1234' : '3.0.00',
                    },
                },
            },
        },
        {
            code: 'vehicleReRegistration',
            name: 'Продати транспортний засіб',
            status: PublicServiceStatus.active,
            sortOrder: 640,
            contextMenu: [
                {
                    type: PublicServiceContextMenuType.supportServiceScreen,
                    name: 'Служба підтримки',
                },
                {
                    type: PublicServiceContextMenuType.faqCategory,
                    name: 'Питання та відповіді',
                    code: 'vehicleReRegistration',
                },
                ratingContextMenuItem,
            ],
            categories: ['carServices'],
            sessionTypes: [SessionType.User],
            appVersions: {
                [SessionType.User]: {
                    minVersion: {
                        [PlatformType.iOS]: isProd ? '4.0.0.1440' : '3.0.0',
                        [PlatformType.Android]: isProd ? '4.0.0.1373' : '3.0.0',
                        [PlatformType.Huawei]: isProd ? '4.0.0.1373' : '3.0.00',
                    },
                },
            },
        },
        {
            code: 'eResidentBankAccount',
            name: 'Open Bank account',
            status: isProd ? PublicServiceStatus.inactive : PublicServiceStatus.active,
            sortOrder: 511,
            categories: ['eResidentBankAccount'],
            sessionTypes: [SessionType.EResident],
        },
    ]

    await db.collection(collectionName).insertMany(publicServices)
}

export async function down(db: mongo.Db): Promise<void> {
    await db.dropCollection(collectionName)
}
