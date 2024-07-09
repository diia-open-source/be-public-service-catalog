import { BaseConfig } from '@diia-inhouse/diia-app'

import { ReplicaSetNodeConfig } from '@diia-inhouse/db'
import { EnvService } from '@diia-inhouse/env'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async (envService: EnvService) =>
    ({
        healthCheck: {
            isEnabled: process.env.HEALTH_CHECK_IS_ENABLED === 'true',
            port: process.env.HEALTH_CHECK_IS_PORT ? Number.parseInt(process.env.HEALTH_CHECK_IS_PORT, 10) : 3000,
        },

        metrics: {
            custom: {
                disabled: envService.getVar('METRICS_CUSTOM_DISABLED', 'boolean', false),
                port: envService.getVar('METRICS_CUSTOM_PORT', 'number', 3030),
                disableDefaultMetrics: envService.getVar('METRICS_CUSTOM_DISABLE_DEFAULT_METRICS', 'boolean', false),
                defaultLabels: envService.getVar('METRICS_CUSTOM_DEFAULT_LABELS', 'object', {}),
            },
        },

        grpcServer: {
            isEnabled: envService.getVar('GRPC_SERVER_ENABLED', 'boolean', false),
            port: envService.getVar('GRPC_SERVER_PORT', 'number', 5000),
            services: envService.getVar('GRPC_SERVICES', 'object'),
            isReflectionEnabled: envService.getVar('GRPC_REFLECTION_ENABLED', 'boolean', false),
            maxReceiveMessageLength: envService.getVar('GRPC_SERVER_MAX_RECEIVE_MESSAGE_LENGTH', 'number', 1024 * 1024 * 4),
        },

        grpc: {
            userServiceAddress: envService.getVar('GRPC_USER_SERVICE_ADDRESS'),
        },

        db: {
            database: process.env.MONGO_DATABASE,
            replicaSet: process.env.MONGO_REPLICA_SET,
            user: process.env.MONGO_USER,
            password: process.env.MONGO_PASSWORD,
            authSource: process.env.MONGO_AUTH_SOURCE,
            port: envService.getVar('MONGO_PORT', 'number'),
            replicaSetNodes: envService
                .getVar('MONGO_HOSTS', 'string')
                .split(',')
                .map((replicaHost: string): ReplicaSetNodeConfig => ({ replicaHost })),
            readPreference: process.env.MONGO_READ_PREFERENCE,
            indexes: {
                sync: process.env.MONGO_INDEXES_SYNC === 'true',
                exitAfterSync: process.env.MONGO_INDEXES_EXIT_AFTER_SYNC === 'true',
            },
        },
    }) satisfies BaseConfig & Record<string, unknown>
