import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

export default function StickyHeadTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const { rows, columns, noDataMessage, pagination } = props;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    if (orderBy && order) {
      return rows.slice().sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        if (order === 'asc') {
          return aValue < bValue ? -1 : 1;
        } else {
          return aValue > bValue ? -1 : 1;
        }
      });
    }
    return rows;
  }, [rows, orderBy, order]);

  const renderSortArrow = (columnId, columnName) => {
    return (
      <span>
        {columnName}
        {orderBy === columnId && (
          <span style={{ marginLeft: '5px' }}>
            {order === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </span>
    );
  };

  const renderNoProposalsMessage = () => {
    if (sortedRows.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            align="center"
            style={{ width: '100%' }}
          >
            <b>{noDataMessage}</b>
          </TableCell>
        </TableRow>
      );
    }
    return null;
  };

  return (
    <Paper className="paperContainer" >
      <TableContainer className="tableContainer">
        <Table stickyHeader aria-label="sticky table" >
          <TableHead>
            <TableRow className="headerRow">
              {columns.map((column,index) => (
                <TableCell
                  key={index}
                  style={{ width: column.width }}
                  onClick={() => handleRequestSort(column.id)}
                >
                  {
                    column.id === 'button' ? 
                    <></> : 
                    <b>{renderSortArrow(column.id, column.label)}</b>
                  }
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {renderNoProposalsMessage()}
            {sortedRows.map((row, index) => (
              <TableRow
                key={index}
                hover
                role="checkbox"
                tabIndex={-1}
                style={{backgroundColor: index % 2 === 0 ? '#f5f5f5' : ''}}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{
                      width: column.width,
                      whiteSpace: 'normal',
                      maxHeight: '100px',
                      padding: '8px',
                    }}
                  >
                    {column.id === 'supervisor_id'
                      ? `${
                          row.supervisorsInfo.find(
                            (supervisor) => supervisor.id === row.supervisor_id
                          )?.name
                        } ${
                          row.supervisorsInfo.find(
                            (supervisor) => supervisor.id === row.supervisor_id
                          )?.surname
                        }`
                      : column.format
                      ? column.format(row[column.id], row)
                      : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination ?
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
        />
        : <></>
      }
    </Paper>
  );
}