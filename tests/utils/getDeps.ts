import { asClass } from 'awilix'

import { DepsFactoryFn } from '@diia-inhouse/diia-app'

import { IdentifierService } from '@diia-inhouse/crypto'
import TestKit from '@diia-inhouse/test'

import deps from '@src/deps'

import { TestDeps } from '@tests/interfaces'

import { AppDeps } from '@interfaces/application'
import { AppConfig } from '@interfaces/config'

export default (config: AppConfig): ReturnType<DepsFactoryFn<AppConfig, AppDeps & TestDeps>> => {
    return {
        ...deps(config),
        testKit: asClass(TestKit).singleton(),
        identifier: asClass(IdentifierService, { injector: () => ({ identifierConfig: { salt: 'TEST_SALT' } }) }).singleton(),
    }
}
