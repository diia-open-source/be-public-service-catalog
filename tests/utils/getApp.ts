import { asClass } from 'awilix'

import { Application, GrpcService, ServiceContext, ServiceOperator } from '@diia-inhouse/diia-app'

import { mockClass } from '@diia-inhouse/test'

import configFactory from '@src/config'

import { TestDeps } from '@tests/interfaces'
import deps from '@tests/utils/getDeps'

import { AppDeps } from '@interfaces/application'
import { AppConfig } from '@interfaces/config'

export async function getApp(): Promise<ServiceOperator<AppConfig, AppDeps & TestDeps>> {
    const serviceName = 'PublicServiceCatalog'
    const app = new Application<ServiceContext<AppConfig, AppDeps & TestDeps>>(serviceName)

    await app.setConfig(configFactory)

    app.setDeps(deps)
    app.overrideDeps({
        grpcService: asClass(mockClass(GrpcService)).singleton(),
    })

    return app.initialize()
}
