import { PlatformType } from '@diia-inhouse/types'
import { ArrayRule, StringRule } from '@diia-inhouse/validators'

import Utils from '@src/utils'

describe('Utils', () => {
    const utils = new Utils()

    describe('method toObjectValidationRule', () => {
        it.each([
            [
                Object.values(PlatformType),
                <StringRule>{ type: 'string', optional: true },
                true,
                {
                    type: 'object',
                    props: {
                        iOS: {
                            type: 'string',
                            optional: true,
                        },
                        Android: {
                            type: 'string',
                            optional: true,
                        },
                        Huawei: {
                            type: 'string',
                            optional: true,
                        },
                        Browser: {
                            type: 'string',
                            optional: true,
                        },
                    },
                    optional: true,
                },
            ],
            [
                Object.values(PlatformType),
                <ArrayRule>{ type: 'array', items: { type: 'string' }, optional: true },
                true,
                {
                    type: 'object',
                    props: {
                        iOS: { type: 'array', items: { type: 'string' }, optional: true },
                        Android: { type: 'array', items: { type: 'string' }, optional: true },
                        Huawei: { type: 'array', items: { type: 'string' }, optional: true },
                        Browser: { type: 'array', items: { type: 'string' }, optional: true },
                    },
                    optional: true,
                },
            ],
            [
                ['User'],
                utils.toObjectValidationRule(Object.values(PlatformType), { type: 'array', items: { type: 'string' }, optional: true }),
                true,
                {
                    type: 'object',
                    props: {
                        User: {
                            type: 'object',
                            props: {
                                iOS: { type: 'array', items: { type: 'string' }, optional: true },
                                Android: { type: 'array', items: { type: 'string' }, optional: true },
                                Huawei: { type: 'array', items: { type: 'string' }, optional: true },
                                Browser: { type: 'array', items: { type: 'string' }, optional: true },
                            },
                            optional: true,
                        },
                    },
                    optional: true,
                },
            ],
        ])('props %s: rule: %s optional: %s expected: %s', (props, rule, optional, expected) => {
            const result = utils.toObjectValidationRule(props, rule, optional)

            expect(result).toEqual(expected)
        })
    })
})
