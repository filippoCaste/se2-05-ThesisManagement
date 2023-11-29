import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import '../App.css';
import Badge from '@mui/material/Badge';

export default function StickyHeadTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const { proposals, isAppliedProposals,drawerWidth } = props;

  const columns = [
    { id: 'title', label: 'Title', minWidth: 450, maxWidth: 450 },
    { id: 'supervisor_id', label: 'Supervisor', minWidth: 200, maxWidth: 200 },
    {
      id: 'expiration_date',
      label: 'Expiration Date',
      minWidth: 150,
      maxWidth: 150,
      format: (value) => dayjs(value).format('DD/MM/YYYY'),
    },
    { id: 'keyword_names', label: 'Keywords', minWidth: 150, maxWidth: 150 },
    {
      id: 'button',
      label: 'Apply',
      minWidth: 200,
      maxWidth: 200,
      format: (value, row) => (
        <Button
          variant="outlined"
          startIcon={<DescriptionOutlinedIcon />}
          style={{
            fontSize: '12px',
            textTransform: 'none',
            color: '#2196f3',
            borderRadius: '4px',
            border: '1px solid #2196f3',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: '#2196f3',
              color: 'white',
            },
          }}
          onClick={() => props.onClick(row)}
        >
          Show more details
        </Button>
      ),
    },
  ];

  // push status col if isAppliedProposals is true
  if (isAppliedProposals) {
    columns.push({
      id: 'status',
      label: 'Status',
      minWidth: 150,
      maxWidth: 150,
      format: (value, row) => (
        <Badge color={getColorByStatus(value)} badgeContent={value}></Badge>
      ),
    });
  }

  const getColorByStatus = (status) => {
    switch (status) {
      case 'rejected':
        return 'secondary';
      case 'submitted':
        return 'primary';
      default:
        return 'action';
    }
  };

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

  const sortedProposals = React.useMemo(() => {
    if (orderBy && order) {
      return proposals.slice().sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        if (order === 'asc') {
          return aValue < bValue ? -1 : 1;
        } else {
          return aValue > bValue ? -1 : 1;
        }
      });
    }
    return proposals;
  }, [proposals, orderBy, order]);

  const renderSortArrow = (columnId, columnName) => {
    if (columnId === 'button') {
      return null;
    }
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
    if (sortedProposals.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            align="center"
            style={{ width: '100%' }}
          >
            <b>No available theses</b>
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
                  align={column.align}
                  style={{ width: column.maxWidth }}
                  className="tableCell"
                  onClick={() => handleRequestSort(column.id)}
                >
                  <b>{renderSortArrow(column.id, column.label)}</b>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {renderNoProposalsMessage()}
            {sortedProposals.map((row, index) => (
              <TableRow
                key={index}
                hover
                role="checkbox"
                tabIndex={-1}
                className={`proposalRow ${
                  index % 2 === 0 ? 'proposalRowOdd' : ''
                }`}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      width: column.maxWidth,
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
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={proposals.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
      />
    </Paper>
  );
}
