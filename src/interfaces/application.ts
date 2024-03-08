import { GrpcService } from '@diia-inhouse/diia-app'

import { AnalyticsService } from '@diia-inhouse/analytics'
import { DatabaseService } from '@diia-inhouse/db'
import { HealthCheck } from '@diia-inhouse/healthcheck'
import { UserServiceClient } from '@diia-inhouse/user-service-client'

import Utils from '@src/utils'

import { AppConfig } from '@interfaces/config'

export interface GrpcClientsDeps {
    userServiceClient: UserServiceClient
}

export type AppDeps = {
    config: AppConfig
    healthCheck: HealthCheck
    database: DatabaseService
    analytics: AnalyticsService
    grpcService: GrpcService
    redlock: null
    utils: Utils
} & GrpcClientsDeps

export enum GrpcServiceName {
    User = 'User',
}
