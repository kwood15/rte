import * as React from 'react';
import { FastField, Field, FieldProps } from 'formik';
import { FormFieldBase } from '../../types/fields';
import RichTextEditorJS from './RichTextEditorJS';

import { Typography } from '@material-ui/core';

export interface FormikRichTextEditorProps<T> extends FormFieldBase<T> {
    fastField?: boolean;
}

function FormikRichTextEditor<T>({
    name,
    helpText,
    label,
    required,
    disabled,
    fastField = false,
    } : FormikRichTextEditorProps<T>) {
        
    if (!name) {
        return null;
    }

    const FormikField = fastField ? FastField : Field;

    return (
        <FormikField
            name={name}
            render={({ field, form }: FieldProps<T>) => {
                const hasError = Boolean(form.touched[name] && form.errors[name]);
                const helperText = form.touched[name] && form.errors[name] ? form.errors[name] : helpText;

                const value: string = field.value === null ? '' : field.value;

                return (
                    <>
                        <Typography>Description and Images</Typography>
                        <RichTextEditorJS
                            required={required}
                            disabled={disabled}
                            label={label}
                            helperText={helperText}
                            error={hasError}
                            value={value}
                            onBlur={() => {
                                form.setFieldTouched(field.name);
                                form.setFieldValue(field.name, value);
                            }}
                            onChange={(value: string) => {
                                form.setFieldTouched(field.name);
                                form.setFieldValue(field.name, value);
                            }}
                        />
                    </>
                )}
            }
        />
  );
}

export default FormikRichTextEditor;