import Papa from 'papaparse';
import { ValidationError } from 'yup';

const parseConfig = {
    header: true,
    skipEmptyLines: true,
    transformHeader: (val) => val.trim().toLowerCase(),
    transform: (val) => val.trim(),
};

function useParser(
    onParseComplete,
    requiredFields = [],
    config = {},
) {
    function parseFile(file) {
        Papa.parse(file, {
            ...parseConfig,
            ...config,
            complete: (results) => {
                const { fields } = results.meta;
                let error = null;

                if (requiredFields.length) {
                    const missingFields = requiredFields.filter(
                        (field) => !fields.includes(field),
                    );

                    if (missingFields.length) {
                        error = new ValidationError(
                            `Fields required: ${missingFields}`,
                        );
                    }
                }

                onParseComplete(results, fields, error);
            },
        });
    }

    return parseFile;
}

export default useParser;
