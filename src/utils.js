import moment from 'moment';
import * as yup from 'yup';

yup.addMethod(yup.string, 'unique', function (data, message) {
    return this.test('unique', message, function (value, { parent }) {
        const { path, createError } = this;

        const duplicateId = data.filter(
            (row) =>
                row.id !== parent.id &&
                row[path].toLowerCase() === value.toLowerCase(),
        )[0]?.id;

        return (
            !duplicateId ||
            createError({
                path,
                message,
                params: { duplicateId },
            })
        );
    });
});

yup.addMethod(yup.string, 'date_format', function (formats, message) {
    return this.test(
        'expiration_date',
        message,
        function (value, { originalValue }) {
            const { createError } = this;

            const date = moment(originalValue, formats, true);
            const isValid =
                date.isValid() && !date.isSameOrBefore(new Date());

            return isValid || createError();
        },
    );
});

yup.addMethod(yup.string, 'phone', function (message) {
    return this.test('phone', message, function (value) {
        const { createError } = this;

        const isValid = value.match(
            /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/,
        );

        return isValid || createError();
    });
});

yup.addMethod(yup.string, 'transform_phone', function () {
    return this.transform((value) =>
        !!value.length ? '+1' + value.replace(/^\+?1/, '') : value,
    );
});

yup.addMethod(yup.string, 'transform_states', function (length = 2) {
    return this.transform(function (value) {
        const array = value.split('|');
        const shrinked = array.map((val) =>
            val.trim().substr(0, length).toUpperCase(),
        );

        return shrinked.join(', ');
    });
});

const validateRow = (row, schema) => {
    const res = { ...row };

    try {
        schema.validateSync(row, {
            abortEarly: false,
        });
    } catch (e) {
        if (e.name === 'ValidationError') {
            e.inner.forEach((item) => {
                res.errors.push(item.path);

                if (item.params.duplicateId) {
                    res.duplicateId = item.params.duplicateId;
                }
            });
        } else {
            throw e;
        }
    }

    return res;
};

export const validateData = ({ data, schema }) =>
    data.map((row) => validateRow(row, schema));

export const prepareData = (rawData, schemaCreator) => {
    const data = rawData.map((row, index) =>
        schemaCreator(rawData).cast({
            ...row,
            id: index + 1,
            duplicateId: null,
            errors: [],
        }),
    );

    const schema = schemaCreator(data);

    return { data, schema };
};
