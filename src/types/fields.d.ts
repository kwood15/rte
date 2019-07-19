type FormFieldBase<T = any> = {
    name: Extract<keyof T, string>;
    label?: string;
    helpText?: React.ReactNode;
    disabled?: boolean;
    required?: boolean;
};
  
export declare type FormField<T = any> = FormFieldBase<T> & FieldType & FormFieldSection;