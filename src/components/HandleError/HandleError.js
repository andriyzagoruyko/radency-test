import React from 'react';
import s from './HandleError.module.css';
import { ReactComponent as IconError } from '../../assets/error.svg';

function HandleError({ isError, text = '', children }) {
    if (!isError) {
        return children;
    }

    return (
        <div className={s.container}>
            <IconError />
            {text}
        </div>
    );
}

export default HandleError;
