import React, { useState } from 'react';
import { ReactComponent as IconUpload } from '../../assets/file.svg';
import s from './Upload.module.css';

function Upload({ onChange, extension }) {
    const [fileName, setFileName] = useState(null);

    const addFile = (file) => {
        const isValid = file && file.name.endsWith(extension);

        onChange(file || null, isValid);
        setFileName(isValid ? file.name : null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        addFile(e.dataTransfer.files[0]);
    };

    const handleChange = (e) => addFile(e.target.files[0]);
    const prevent = (e) => e.preventDefault();

    return (
        <label
            className={s.container}
            onDrop={handleDrop}
            onDragOver={prevent}
            onDragEnter={prevent}
            onDragLeave={prevent}
        >
            <IconUpload />
            <span className={s.info}>
                {!fileName
                    ? 'Press or drop file to import'
                    : fileName}
            </span>
            <input type="file" onChange={handleChange} />
        </label>
    );
}

export default Upload;
