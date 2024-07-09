import { ArrayRule, ObjectRule, StringRule } from '@diia-inhouse/validators'

export default {
    toObjectValidationRule(props: string[], rule: ObjectRule | ArrayRule | StringRule, optional = true): ObjectRule {
        let acc: ObjectRule = {
            type: 'object',
            props: {},
            optional,
        }

        for (const prop of props) {
            acc = {
                ...acc,
                props: {
                    ...acc.props,
                    [prop]: rule,
                },
            }
        }

        return acc
    },
}
