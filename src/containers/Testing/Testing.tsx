import * as React from 'react';
import { Divider } from '@material-ui/core';
import RichTextEditorJS from './RichTextEditorJS';
import RichTextEditorTS from './RichTextEditorTS';
// import FormikRichTextEditor from './FormikRichTextEditor'; todo

const Testing: React.SFC = () => (
    <>
        <RichTextEditorTS />
        <Divider />
        <RichTextEditorJS />

        {/* 
        todo
        <FormikRichTextEditor
            required
            name="description"
            label="Product Description"
            helpText="Describe your product and it's benefits in full. This will appear on the web site and in catalogue but may be edited by our teams."
        />
        */}
    </>
);

export default Testing;