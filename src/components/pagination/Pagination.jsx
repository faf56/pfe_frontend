"use client"

import { Box, Pagination as MuiPagination, FormControl, Select, MenuItem, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  flexWrap: "wrap",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}))

const PageSizeSelector = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}))

const Pagination = ({
  count,
  page,
  onChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 36, 48],
  showPageSize = true,
}) => {
  return (
    <PaginationContainer>
      <MuiPagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        siblingCount={1}
      />

      {showPageSize && (
        <PageSizeSelector>
          <Typography variant="body2" color="text.secondary">
            Produits par page:
          </Typography>
          <FormControl size="small" variant="outlined">
            <Select
              value={pageSize}
              onChange={onPageSizeChange}
              sx={{ minWidth: 80 }}
              MenuProps={{
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
              }}
            >
              {pageSizeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </PageSizeSelector>
      )}
    </PaginationContainer>
  )
}

export default Pagination
