import * as yup from 'yup';

const schemaCreator = (data) =>
    yup.object({
        'full name': yup.string().required(),

        phone: yup
            .string()
            .required()
            .max(12)
            .transform_phone()
            .phone()
            .unique(data),

        email: yup.string().required().unique(data),

        age: yup.number().integer().min(21),

        experience: yup
            .number()
            .integer()
            .positive()
            .test((val, { parent }) => val < parent.age),

        'yearly income': yup
            .string()
            .test((val) => !!parseInt(val) && val <= 1000000)
            .transform((val) => (+val).toFixed(2)),

        'license states': yup.string().transform_states(),

        'expiration date': yup
            .string()
            .date_format(['MM/DD/YYYY', 'MM-DD-YYYY']),

        'has children': yup
            .string()
            .transform((val) => val.toUpperCase() || 'FALSE')
            .oneOf(['FALSE', 'TRUE']),

        'license number': yup
            .string()
            .max(6)
            .matches(/^[a-zA-Z0-9]+$/),
    });

export default schemaCreator;
