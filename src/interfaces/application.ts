import { AnalyticsService } from '@diia-inhouse/analytics'
import { UserServiceClient } from '@diia-inhouse/user-service-client'

export interface GrpcClientsDeps {
    userServiceClient: UserServiceClient
}

export type AppDeps = {
    analytics: AnalyticsService
} & GrpcClientsDeps

export enum GrpcServiceName {
    User = 'User',
}
