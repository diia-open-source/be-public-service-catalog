import { Application, ServiceContext, ServiceOperator } from '@diia-inhouse/diia-app'

import configFactory from '@src/config'

import { TestDeps } from '@tests/interfaces'
import deps from '@tests/utils/getDeps'

import { AppDeps } from '@interfaces/application'
import { AppConfig } from '@interfaces/config'

export async function getApp(): Promise<ServiceOperator<AppConfig, AppDeps & TestDeps>> {
    const serviceName = 'PublicServiceCatalog'
    const app = new Application<ServiceContext<AppConfig, AppDeps & TestDeps>>(serviceName)

    await app.setConfig(configFactory)
    await app.setDeps(deps)
    const appOperator = await app.initialize()

    await appOperator.start()

    return appOperator
}
