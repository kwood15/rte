import * as React from 'react';
import RichTextEditorTS from './RichTextEditorTS';
import RichTextEditorJS from './RichTextEditorJS';

const Testing: React.FunctionComponent = () => (
    <>
        <RichTextEditorTS />
        <p>vs</p>
        <RichTextEditorJS />
    </>
);

export default Testing;
