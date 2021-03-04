import React from 'react';
import s from './Table.module.css';

function Table({ fields = [], rows = [] }) {
    if (!rows.length) {
        return null;
    }

    return (
        <div className={s.container}>
            <div className={s.inner}>
                <table className={s.table}>
                    <thead>
                        <tr>
                            <td className={s.headerField}>ID</td>
                            {fields.map((field) => (
                                <td
                                    className={s.headerField}
                                    key={field}
                                >
                                    {field}
                                </td>
                            ))}
                            <td className={s.headerField}>
                                Duplicate with
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                {fields.map((key) => (
                                    <td
                                        key={row[key]}
                                        className={
                                            row.errors.includes(key)
                                                ? s.incorrect
                                                : ''
                                        }
                                    >
                                        {row[key]}
                                    </td>
                                ))}
                                <td>{row.duplicateId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;
