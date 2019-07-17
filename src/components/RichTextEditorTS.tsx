import React from 'react';
import { Plugin, Editor, RenderMarkProps, RenderBlockProps } from 'slate-react';
import { Value } from 'slate';
import { isKeyHotkey } from 'is-hotkey';

import {
  Theme,
  createStyles,
  withStyles,
  Typography,
  IconButton
} from '@material-ui/core';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

import BulletListButton from '@material-ui/icons/FormatListBulleted';
import BoldButton from '@material-ui/icons/FormatBold';
import ClearFomattingButton from '@material-ui/icons/FormatClear';
import ItalicButton from '@material-ui/icons/FormatItalic';
import UnderlineButton from '@material-ui/icons/FormatUnderlined';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';

const DEFAULT_NODE = 'paragraph';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

const styles = (theme: Theme) => {
  createStyles({
    input: {
      color: theme.palette.text.primary,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      borderStyle: 'solid',
      borderRadius: theme.shape.borderRadius,
      borderWidth: 1,
      borderColor:
        theme.palette.type === 'light'
          ? 'rgba(0, 0, 0, 0.23)'
          : 'rgba(255, 255, 255, 0.23)'
    },
    inputError: {
      borderColor: theme.palette.error.main
    }
  });
};

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: []
      }
    ]
  }
});

interface RichTextEditorTSState {
  value: Value;
}

interface RichTextEditorTSProps {
  classes?: any;
  error?: string;
}

class RichTextEditorTS extends React.Component<RichTextEditorTSProps, RichTextEditorTSState> {
  private editor! : Editor;
   
  state = {
    value: initialValue
  };

  hasMark = (type: string) => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark!.type === type);
  };

  hasBlock = (type: string) => {
    const { value } = this.state;
    return value.blocks.some(node => node!.type === type);
  };

  ref = (editor: Editor) => {
    this.editor = editor;
  }

  render() {
    const { classes, error } = this.props;

    return (
      <>
        <div style={{ display: 'flex' }}>
          {this.renderMarkButton('bold', BoldButton)}
          {this.renderMarkButton('italic', ItalicButton)}
          {this.renderMarkButton('underlined', UnderlineButton)}
          {this.renderMarkButton('clear', ClearFomattingButton)}
          {this.renderBlockButton('bulleted-list', BulletListButton)}
          {this.renderBlockButton('numbered-list', FormatListNumbered)}
        </div>
        <Typography
          component="div"
          className={[classes!.input, error ? classes!.inputError : ''].join(
            ' '
          )}
        >
          <Editor
            spellCheck
            autoFocus
            placeholder="Enter some rich text..."
            value={this.state.value}
            onChange={this.onChange}
            // onKeyDown={this.onKeyDown}
            renderBlock={this.renderBlock}
            renderMark={this.renderMark}
            ref={this.ref}
          />
        </Typography>
      </>
    );
  }

  renderMarkButton = (
    type: string,
    icon: React.ComponentType<SvgIconProps>
  ) => {
    const IconComponent = icon;
    return (
      <IconButton onMouseDown={(event: React.MouseEvent) => this.onClickMark(event, type)}>
        <IconComponent />
      </IconButton>
    );
  };

  renderBlockButton = (
    type: string,
    icon: React.ComponentType<SvgIconProps>
  ) => {
    let isActive = this.hasBlock(type);
    const IconComponent = icon;

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state;

      if (blocks.size > 0) {
        const parent: any = document.getParent(blocks.first().key);
        isActive =
          this.hasBlock('list-item') && parent && parent.type === type
            ? true
            : false;
      }
    }
    return (
      <IconButton onMouseDown={(event: React.MouseEvent) => this.onClickBlock(event, type)}>
        <IconComponent />
      </IconButton>
    );
  };

  renderBlock = (props: RenderBlockProps, editor: Plugin, next: () => any) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'BulletListButton':
        return <blockquote {...attributes}>{children}</blockquote>;
      case '':
        return <ul {...attributes}>{children}</ul>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      default:
        return next();
    }
  };

  renderMark = (props: RenderMarkProps, editor: Plugin, next: () => any) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  onChange = ({ value }: { value: Value }) => {
    this.setState({ value });
  };

  onKeyDown = (event: KeyboardEvent, editor: Editor, next: () => void) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    } else if (isCodeHotkey(event)) {
      mark = 'code';
    } else {
      return next();
    }
    event.preventDefault();
    editor.toggleMark(mark);
  };

  onClickMark = (event: React.MouseEvent, type: string) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  onClickBlock = (event: React.MouseEvent, type: string) => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const isType = value.blocks.some((block: any) => {
        return !!document.getClosest(
          block.key,
          (parent: any) => parent.type === type
        );
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks('list-item').wrapBlock(type);
      }
    }
  };
}

export default withStyles(styles)(RichTextEditorTS);
