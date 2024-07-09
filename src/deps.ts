import { DepsFactoryFn, GrpcClientFactory, NameAndRegistrationPair, asClass, asFunction } from '@diia-inhouse/diia-app'

import { AnalyticsService } from '@diia-inhouse/analytics'
import { UserServiceDefinition } from '@diia-inhouse/user-service-client'

import { AppDeps, GrpcClientsDeps } from '@interfaces/application'
import { AppConfig } from '@interfaces/config'

export default async (config: AppConfig): ReturnType<DepsFactoryFn<AppConfig, AppDeps>> => {
    const grpcClientsDeps: NameAndRegistrationPair<GrpcClientsDeps> = {
        userServiceClient: asFunction((grpcClientFactory: GrpcClientFactory) =>
            grpcClientFactory.createGrpcClient(UserServiceDefinition, config.grpc.userServiceAddress),
        ).singleton(),
    }

    return {
        analytics: asClass(AnalyticsService).singleton(),

        ...grpcClientsDeps,
    }
}
