import React from 'react';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({  
        text: {
            color: theme.palette.grey['400']
        },
        active: {
            color: theme.palette.grey['800']
        }
    }),
);

const EditorButton = React.forwardRef(
    (
        { ...props }: { active: boolean; children: React.ReactNode },
        ref: React.Ref<HTMLButtonElement>
    ) => {
        const classes = useStyles();
        return (
            <Button
                ref={ref}
                variant="outlined"
                className={props.active ? classes.active : classes.text}
            >
                {props.children}
            </Button>
        );
    }
);

export default EditorButton;