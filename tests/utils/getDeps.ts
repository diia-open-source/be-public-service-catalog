import { DepsFactoryFn, GrpcService, asClass } from '@diia-inhouse/diia-app'

import { IdentifierService } from '@diia-inhouse/crypto'
import TestKit, { mockClass } from '@diia-inhouse/test'

import deps from '@src/deps'

import { TestDeps } from '@tests/interfaces'

import { AppDeps } from '@interfaces/application'
import { AppConfig } from '@interfaces/config'

export default async (config: AppConfig): ReturnType<DepsFactoryFn<AppConfig, AppDeps & TestDeps>> => {
    return {
        ...(await deps(config)),
        testKit: asClass(TestKit).singleton(),
        identifier: asClass(IdentifierService, { injector: () => ({ identifierConfig: { salt: 'TEST_SALT' } }) }).singleton(),
        grpcService: asClass(mockClass(GrpcService)).singleton(),
    }
}
