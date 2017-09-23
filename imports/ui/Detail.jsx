import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { createContainer } from 'react-meteor-data';
import __ from 'lodash';
import moment from 'moment';
import { Tasks } from '../api/tasks';
var request = require('request');

export default class Task extends React.Component {
    constructor(props) {
        super(props);
        this.rows = 2;
        this.width = Math.floor((window.innerWidth - 158) / this.rows);
        this.state = {filterCol: 'code', height: window.innerHeight, width: this.width, open: false, refetch: false};
        this.removeRows = [];
        this.error = false;

        this.gridOptions = {
            suppressHorizontalScroll: true,
            doesDataFlower: () => {
                return true;
            },
            onFilterChanged: () => {
                if(this.gridOptions.api){
                  this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData());
                }
                this.saveFilter = this.gridOptions.api.getFilterModel();
            },
            onGridReady: () => {
              if(this.gridOptions.api) {
                this.gridOptions.api.sizeColumnsToFit();
              }
            },
            floatingFilter: true
        };
    }

    handleOpen() {
        this.refDialogAddNewPriceType.setState({open: true});
    }

    handleClose() {
        this.refDialogAddNewPriceType.setState({open: false});
    }

    addNewRow(priceType) {
      let { data, t } = this.props;
      let token = localStorage.getItem('Meteor.loginToken');
      priceType.active = true;
      let info = JSON.stringify(priceType)
      this.props.insertPriceTypes(token, info).then(() => {
          this.addNotification('success',  t('srm:common.buttonAdd') + ' ' + t('srm:priceType.labelPriceType') + ' ' + t('srm:common.labelSuccessFull'));
          this.props.data.refetch();
      }).catch((error) => {
          console.log('there was an error sending the query', error);
      });
      this.handleClose();
    }

    addNotification(level, message) {
        this.props.notificationSystemRoot.addNotification({
            message: message,
            level: level,
            autoDismiss: 10,
            position: 'bl'
        });
    }

    clearAllFilter() {
        this.gridOptions.api.setFilterModel(null);
        this.gridOptions.api.onFilterChanged();
    }

    componentDidUpdate() {
      if(this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
        this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData());
      }
    }

    handleResize(e) {
        this.setState({height: window.innerHeight});
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.setState({refetch: false});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    RefreshData() {
        this.props.data.refetch();
    }

    renderFooterData() {
      let totalAmount = 0, totalStt = 0;

      if (this.gridOptions && this.gridOptions.api) {
          let data = [], models;
          models = this.gridOptions.api.getModel().rowsToDisplay;
          __.forEach(models, (model) => {
              data.push(model.data);
          });
          __.forEach(data, (tran)=>{
              totalStt++;
              totalAmount += tran.amount;
          });
      }
      return [{
          gridType: 'footer',
          deviceName: 'Total: ' +  totalStt,
          option: ''
      }];
    }

    render() {
        let {layouts, users, t} = this.props;
        let data = __.cloneDeep(this.props.data.history);
        if (!data) {
            return (
                <div className="spinner spinner-lg"></div>
            );
        } else {
            __.forEach(data, (item, idx) => {
              item['index'] = (idx + 1);
            });
            let columnDefs= [
                {
                  headerName: 'STT', field:'index', minWidth: 100, width: 100, maxWidth: 100, cellClass: 'agaction', pinned: 'left', filter: '', dontAdd: true,
                  cellStyle: (params) => {
                      if (params.node.data.gridType == 'footer') {
                          return {display: 'none'};
                      }
                  },
                },
                {
                    headerName: 'Trạng thái', field: "action",
                    filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: this.state.width, editable: (params) => {
                        if (params.node.data.gridType == 'footer') {
                            return false;
                        } else {
                            return perUpdate;
                        }
                    }, suppressMenu: true, required: false, filter: 'text'
                },
                {
                    headerName: 'Thời gian', field: "time", width: 300,
                    cellRenderer: function(params) {
                      if(params.node.data.gridType == 'footer') {
                        return '';
                      } else {
                          if(params.value) {
                            return moment(params.value).format('DD/MM/YYYY hh:mm');
                          } else {
                            return '';
                          }
                      }
                    }
                },
            ];
            return (
                <div>
                  <div>
                      <div style={{height: this.state.height-154}} className="ag-fresh">
                          <AgGridReact
                              gridOptions={this.gridOptions}
                              columnDefs={columnDefs}
                              rowData={data}
                              enableColResize="true"
                              enableSorting="true"
                              enableFilter="true"
                          />
                      </div>
                  </div>
                </div>
            )
        }
    }
}
