import * as React from 'react';
import { Divider } from '@material-ui/core';
import RichTextEditorTS from './RichTextEditorTS';
import RichTextEditorJS from './RichTextEditorJS';

const Testing: React.SFC = () => (
    <>
        <RichTextEditorTS />
        <Divider />
        <RichTextEditorJS />
    </>
);

export default Testing;