import React, { forwardRef, useState, useImperativeHandle, useRef } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, CircularProgress, Box, TableSortLabel } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { FaAngleRight } from "react-icons/fa";

import { IconButtonComponent } from './Icon';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		fontSize: 14,
		fontWeight: 'bold'
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

export const TableComponent = forwardRef(({ columns, data, actionCount, count, itemsPerPage, callback, navigate }, ref) => {
  const tableStateRef = useRef({
    "order": true,
    "orderBy": "",
    "page": 0
  })


	const [tableState, setTableState] = useState(tableStateRef.current)
	const [loading, setLoading] = useState(false)

	const handler = {
		getState: () => {
			return tableStateRef.current
		},
			setLoadingScreen: (value) => {
			setLoading(value)
		},
		setPage: () => {
			tableStateRef.current.page = 0
      setTableState(tableStateRef.current)
		}
	}

  useImperativeHandle(ref, () => handler)

	const sort = (id) => {
		if (tableStateRef.current.orderBy === id) {
      tableStateRef.current.order = !tableStateRef.current.order
		}
		else {
			tableStateRef.current.order = true
			tableStateRef.current.orderBy = id
		}

    setTableState(tableStateRef.current)

		callback()
	}

  const handlePageChange = (_, newPage) =>{
		tableStateRef.current.page = (newPage-1)*itemsPerPage
		setTableState(tableStateRef.current)
		
		callback()
	}

  return (
    <>
			{(loading || data == null) ? (
				<Box className="center">
					<CircularProgress />
				</Box>
			) : (
				<TableContainer sx={{ flex: 1  }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow >
								{Object.entries(columns).map((i) => <> 
									{i[1]["sorting"] ? (
										<StyledTableCell align="center" key={i[0]} sortDirection={tableState.orderBy === i[0] ? (tableState.order ? 'asc' : 'desc') : false}>
											<TableSortLabel active={tableState.orderBy === i[0]} direction={tableState.order ? 'asc' : 'desc'} onClick={() => sort(i[0])}>
												{i[1]["label"]}
												{tableState.orderBy === i[0] ? (
													<Box component="span" sx={visuallyHidden}>
														{tableState.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
													</Box>
												) : null}
											</TableSortLabel>
										</StyledTableCell>
									) : (
										<StyledTableCell align="center">{i[1]["label"]}</StyledTableCell>
									)}
								</>)}

								{actionCount && 
									<StyledTableCell align="center">{''}</StyledTableCell>
								}

								{navigate &&
									<StyledTableCell align="center">{''}</StyledTableCell>
								}
							</TableRow>
						</TableHead>

						<TableBody>
							{data.map((row, i) => (
								<>	
								<TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									{Object.entries(columns).map((j) =>
									<StyledTableCell align="center" key={j[0]} >{(row[j[0]] != "" && row[j[0]] != null) ? row[j[0]] : "-"}</StyledTableCell>
									)}

									{actionCount &&
									<StyledTableCell align="center" sx={{width : `${actionCount*50}px`}} key="actionBtn">
										<Stack justifyContent="center"  direction="row" spacing={0} >
										{row["actions"].map((action) => 
											<IconButtonComponent title={action.text} onClick={() => action.onClick(row["id"])}>
											{action.icon}
											</IconButtonComponent>
										)}
										</Stack>
									</StyledTableCell>
									}

									{navigate && 
									<StyledTableCell align="center" sx={{width : "50px"}} key="navigationBtn">
										<IconButtonComponent onClick={() => navigate(row["id"])} title="">
										<FaAngleRight size={20} />
										</IconButtonComponent>
									</StyledTableCell>
									}
								</TableRow>
								</>
              				))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			
			{(count != null && count > 0) && 
				<Pagination page={tableState["page"]} boundaryCount={2} onChange={handlePageChange}/>
			}
		</ >
  )
})
