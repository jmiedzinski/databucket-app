import React, {forwardRef} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import SettingsEthernet from '@material-ui/icons/SettingsEthernet';

const styles = theme => ({
    root: {
        backgroundColor: '#EEE', //theme.palette.primary.main,
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>),
};

const DialogTitle = withStyles(styles)(props => {
    const {children, classes, onClose} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(0),
    },
}))(MuiDialogContent);

export default class ConditionsEditorDialog extends React.Component {

    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
        this.state = {
            data: props.json != null ? props.json : [],
            title: props.title,
            open: false,
            columns: [
                {
                    title: 'Left source',
                    field: 'left_source',
                    lookup: {'const': 'Const', 'field': 'Field', 'property': 'Property', 'function': 'Function'}
                },
                {title: "Left value", field: 'left_value', emptyValue: 'null'},
                {
                    title: 'Operator', field: 'operator',
                    lookup: {
                        '=': '=',
                        '>': '>',
                        '>=': '>=',
                        '<': '<',
                        '<=': '<=',
                        '<>': '<>',
                        'in': 'in',
                        'not in': 'not in',
                        'is': 'is',
                        'is not': 'is not',
                        'like': 'like',
                        'not like': 'not like'
                    }
                },
                {
                    title: 'Right source',
                    field: 'right_source',
                    lookup: {'const': 'Const', 'field': 'Field', 'property': 'Property', 'function': 'Function'}
                },
                {title: "Right value", field: 'right_value', emptyValue: 'null'}
            ]
        };
    }

    moveUp(rowData) {
        const data = this.state.data;
        const index = data.indexOf(rowData);
        const previousRowData = data[index - 1];
        data[index] = previousRowData;
        data[index - 1] = rowData;
        this.setState({data: data});
    }

    moveDown(rowData) {
        const data = this.state.data;
        const index = data.indexOf(rowData);
        const nextRowData = data[index + 1];
        data[index] = nextRowData;
        data[index + 1] = rowData;
        this.setState({data: data});
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = () => {
        if (typeof this.state.data !== 'undefined' && this.state.data !== null && this.state.data.length > 0) {
            let dataClone = JSON.parse(JSON.stringify(this.state.data));
            for (var i = 0; i < dataClone.length; i++) {
                let col = dataClone[i];
                delete col['tableData'];
            }

            this.props.onChange(dataClone);
        } else
            this.props.onChange(this.state.data);

        this.setState({open: false});
    };

    getExampleConditions() {
        return [
            {
                'left_source': 'field',
                'left_value': 'bundle_id',
                'operator': '>',
                'right_source': 'const',
                'right_value': '5'
            },
        ];
    }

    isProperField(value) {
        const fields = ['bundle_id', 'tag_id', 'tag_name', 'locked', 'locked_by', 'created_by', 'created_at', 'updated_by', 'updated_at', 'properties'];
        let result = fields.includes(value);

        if (!result)
            window.alert("Incorrect field name.\nAcceptable values: \n" + fields);

        return result;
    }

    isProperProperty(value) {
        if (!value.startsWith('$.')) {
            window.alert("Incorrect property name!\nProperty name must be a valid JSON path.\nExamples:\n$.name\n$.address.street\n$.colors[0]");
            return false;
        }
        return true;
    }

    convertConstValue(value) {
        if (typeof value === 'string' || value instanceof String) {
            let val = parseFloat(value);
            if (isNaN(val)) {
                if (value.toUpperCase() === 'TRUE')
                    return true;
                else if (value.toUpperCase() === 'FALSE')
                    return false;
                else if (value.toUpperCase() === 'NULL')
                    return null;
                else
                    return value;
            } else
                return val;
        } else
            return value;
    }

    vefiryCondition(condition) {
        if (condition.left_source == null || condition.left_value == null || condition.operator == null || condition.right_source == null | condition.right_value == null) {
            window.alert("All properties are obligatory!");
            return false;
        }

        if (condition.left_source === 'field' && !this.isProperField(condition.left_value))
            return false;

        if (condition.right_source === 'field' && !this.isProperField(condition.right_value))
            return false;

        if (condition.left_source === 'property' && !this.isProperProperty(condition.left_value))
            return false;

        if (condition.right_source === 'property' && !this.isProperProperty(condition.right_value))
            return false;

        if (condition.left_source === 'const')
            condition.left_value = this.convertConstValue(condition.left_value);

        if (condition.right_source === 'const')
            condition.right_value = this.convertConstValue(condition.right_value);

        return true;
    }

    render() {
        return (
            <div>
                <Tooltip title='Columns'>
                    <IconButton
                        onClick={this.handleClickOpen}
                        color="default"
                    >
                        <MoreHoriz/>
                    </IconButton>
                </Tooltip>
                <Dialog
                    onClose={this.handleClose} // Enable this to close editor by clicking outside the dialog
                    aria-labelledby="customized-dialog-title"
                    open={this.state.open}
                    fullWidth={true}
                    maxWidth='lg' //'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                        Conditions configuration
                    </DialogTitle>
                    <DialogContent dividers>
                        <MaterialTable
                            icons={tableIcons}
                            title={this.state.title}
                            tableRef={this.tableRef}
                            columns={this.state.columns}
                            data={this.state.data}
                            options={{
                                paging: true,
                                pageSize: 15,
                                paginationType: 'stepped',
                                pageSizeOptions: [10, 15, 20],
                                actionsColumnIndex: -1,
                                sorting: false,
                                search: false,
                                filtering: false,
                                padding: 'dense',
                                headerStyle: {backgroundColor: '#eeeeee'},
                                rowStyle: rowData => ({backgroundColor: rowData.tableData.id % 2 === 1 ? '#fafafa' : '#FFF'})
                            }}
                            components={{
                                Container: props => <div {...props} />
                            }}
                            editable={{
                                onRowAdd: newData =>
                                    new Promise((resolve, reject) => {
                                        let data = this.state.data;
                                        if (typeof data === 'undefined' || data === null) {
                                            data = [];
                                        }
                                        if (this.vefiryCondition(newData)) {
                                            // console.log(newData);
                                            data.push(newData);
                                            this.setState({data: data});
                                            resolve();
                                        } else
                                            reject();
                                    }),
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                        if (this.vefiryCondition(newData)) {
                                            // console.log(newData);
                                            const data = this.state.data;
                                            const index = data.indexOf(oldData);
                                            data[index] = newData;
                                            this.setState({data: data});
                                            resolve();
                                        } else
                                            reject();
                                    }),
                                onRowDelete: oldData =>
                                    new Promise((resolve, reject) => {
                                        const data = this.state.data;
                                        const index = data.indexOf(oldData);
                                        data.splice(index, 1);
                                        this.setState({data: data}, () => resolve());
                                    }),
                            }}
                            actions={[
                                {
                                    icon: () => <SettingsEthernet/>,
                                    tooltip: 'Set example conditions',
                                    isFreeAction: true,
                                    onClick: () => this.setState({data: this.getExampleConditions()})
                                },
                                rowData => ({
                                    icon: () => <ArrowDropUp/>,
                                    tooltip: 'Move up',
                                    onClick: (event, rowData) => this.moveUp(rowData),
                                    disabled: !(this.state.data.indexOf(rowData) > 0)
                                }),
                                rowData => ({
                                    icon: () => <ArrowDropDown/>,
                                    tooltip: 'Move down',
                                    onClick: (event, rowData) => this.moveDown(rowData),
                                    disabled: !(this.state.data.indexOf(rowData) < this.state.data.length - 1)
                                })
                            ]}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
