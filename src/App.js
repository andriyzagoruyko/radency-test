import React, { useState } from 'react';
import schemaCreator, { fileRequiredFields } from './schema';
import { prepareData, validateData } from './utils';
import Table from './components/Table/Table';
import Upload from './components/Upload/Upload';
import HandleError from './components/HandleError/HandleError';
import useParser from './hooks/useParser';
import './index.css';

function App() {
    const [data, setData] = useState({
        fields: [],
        rows: [],
        isError: false,
    });

    const parseFile = useParser((results, fields, error) => {
        if (error) {
            setData({ ...data, isError: true });
            return;
        }

        const prepared = prepareData(results.data, schemaCreator);
        const rows = validateData(prepared);

        setData({ fields, rows, isError: false });
    }, fileRequiredFields);

    function handleChangeUpload(file, isValid) {
        if (file && isValid) {
            parseFile(file);
        }

        const rows = !file ? [] : data.rows;
        const isError = file && !isValid;

        setData({ ...data, rows, isError });
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
