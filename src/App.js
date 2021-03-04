import React, { useState } from 'react';
import Papa from 'papaparse';
import schemaCreator from './schema';
import { prepareData, validateData } from './utils';
import Table from './components/Table/Table';
import Upload from './components/Upload/Upload';
import './index.css';
import HandleError from './components/HandleError/HandleError';

const parseConfig = {
    header: true,
    skipEmptyLines: true,
    transformHeader: (val) => val.trim().toLowerCase(),
    transform: (val) => val.trim(),
};

function App() {
    const [data, setData] = useState({
        fields: [],
        rows: [],
        isError: false,
    });

    function handleParseComplete(results) {
        try {
            const { fields } = results.meta;
            const prepared = prepareData(results.data, schemaCreator);
            const rows = validateData(prepared);

            setData({ fields, rows, isError: false });
        } catch (e) {
            const isError = e.name === 'ValidationError';

            setData({ ...data, isError });
        }
    }

    function handleChangeUpload(file, isValid) {
        if (file && isValid) {
            Papa.parse(file, {
                ...parseConfig,
                complete: handleParseComplete,
            });
        }

        const isError = file && !isValid;

        setData({ ...data, rows: !file ? [] : data.rows, isError });
    }

    return (
        <main>
            <Upload onChange={handleChangeUpload} extension="csv" />
            <HandleError
                isError={data.isError}
                text="File format is not correct"
            >
                <Table fields={data.fields} rows={data.rows} />
            </HandleError>

            <div className="additional">
                <a href="/table.csv">Download table example</a>
            </div>
        </main>
    );
}

export default App;
