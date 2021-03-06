import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { createContainer } from 'react-meteor-data';
import __ from 'lodash';
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
        let data = __.cloneDeep(this.props.tasks);
        if (!data) {
            return (
                <div className="spinner spinner-lg"></div>
            );
        } else {
            let columnDefs= [
                {
                  headerName: '', field:'', minWidth: 56, width: 56, cellClass: 'agaction', pinned: 'left', filter: '', dontAdd: true,
                  cellRendererFramework:(params)=>{
                    return (
                        <div style={{width: '100%'}}>
                          <button className="btn btn-primary" style={{borderWidth: 0, width: 56, marginTop: -5, marginLeft: -5}}>{!params.data.checked ? 'Khóa' : 'Mở'}</button>
                        </div>
                    );
                  },
                  cellStyle: (params) => {
                      if (params.node.data.gridType == 'footer') {
                          return {display: 'none'};
                      }
                  },
                  onCellClicked: (params) => {
                    if(params.data.checked) {
                      request('http://' + params.data.ip + '/' + 'unLock', function (error, response, body) {
                      });
                      Tasks.update({_id: params.data._id}, { $set: { checked: false } });
                    } else {
                        request('http://' + params.data.ip + '/' + 'lock', function (error, response, body) {
                        });
                        Tasks.update({_id: params.data._id}, { $set: { checked: true } });
                    }
                    // Set the checked property to the opposite of its current value
                  }
                },
                {
                  headerName: '', field:'', minWidth: 56, width: 56, cellClass: 'agaction', pinned: 'left', filter: '', dontAdd: true,
                  cellRendererFramework:(params)=>{
                    return (
                        <div style={{width: '100%'}}>
                          <button className="btn btn-primary" style={{borderWidth: 0, width: 56, marginTop: -5, marginLeft: -5}}>{'Chi tiết'}</button>
                        </div>
                    );
                  },
                  cellStyle: (params) => {
                      if (params.node.data.gridType == 'footer') {
                          return {display: 'none'};
                      }
                  },
                  onCellClicked: (params) => {
                    if(params.data && params.data._id){
                      this.props.getDetail(params.data);
                    }
                  }
                },
                {
                    headerName: 'Tên thiết bị', field: "deviceName",
                    filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']},
                    width: 300, editable: (params) => {
                        if (params.node.data.gridType == 'footer') {
                            return false;
                        } else {
                            return perUpdate;
                        }
                    },  cellStyle: function(params) {
                            if (params.node.data.gridType == 'footer') {
                                //mark police cells as red
                                return {fontWeight: 'bold'};
                            } else {
                                return null;
                            }
                        }, suppressMenu: true, required: true, filter: 'text'
                },
                {
                    headerName: 'Tên khách hàng', field: "customerName",
                    filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: this.state.width, editable: (params) => {
                        if (params.node.data.gridType == 'footer') {
                            return false;
                        } else {
                            return perUpdate;
                        }
                    }, suppressMenu: true, required: true, filter: 'text'
                },
                {
                    headerName: 'Địa chỉ ip', field: "ip",
                    filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: this.state.width, editable: (params) => {
                        if (params.node.data.gridType == 'footer') {
                            return false;
                        } else {
                            return perUpdate;
                        }
                    }, suppressMenu: true, required: false, filter: 'text'
                },
                {
                    headerName: 'Trạng thái', field: "checked", width: 300,
                    cellRenderer: function(params) {
                      if(params.node.data.gridType == 'footer') {
                        return '';
                      } else {
                          if(params.value) {
                            return 'Khóa';
                          } else {
                            return 'Mở';
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
