import * as React from "react"
import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { toast } from "sonner"

interface Column {
  accessorKey: string
  header: string
  cell?: (value: any, row: any) => React.ReactNode
}

interface EnhancedDataTableProps {
  columns: Column[]
  data: any[]
  onAdd: () => void
  onMultiDelete?: (items: any[]) => void
  searchPlaceholder?: string
  loading?: boolean
  entityName?: string
}

export function EnhancedDataTable({ 
  columns, 
  data, 
  onMultiDelete,
  loading = false,
  entityName = "items"
}: EnhancedDataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [pendingDelete, setPendingDelete] = useState<{items: any[], timeoutId: NodeJS.Timeout} | null>(null)

  const filteredData = data

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const toggleAllSelection = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(filteredData.map(row => row.id)))
    }
  }

  const handleMultiDelete = () => {
    const selectedItems = filteredData.filter(row => selectedRows.has(row.id))
    
    const timeoutId = setTimeout(() => {
      if (onMultiDelete) {
        onMultiDelete(selectedItems)
        setSelectedRows(new Set())
      }
      setPendingDelete(null)
    }, 5000)
    
    setPendingDelete({ items: selectedItems, timeoutId })
    
    toast.success(
      `Deleting ${selectedItems.length} item(s) in 5 seconds`,
      {
        action: {
          label: "Undo",
          onClick: () => {
            clearTimeout(timeoutId)
            setPendingDelete(null)
            toast.success("Delete cancelled")
          },
        }
      }
    )
  }

  useEffect(() => {
    return () => {
      if (pendingDelete) {
        clearTimeout(pendingDelete.timeoutId)
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {loading ? "Loading..." : `${filteredData.length} ${entityName}`}
        </div>
        <div className="flex items-center gap-4">
          {selectedRows.size > 0 && (
            <Button onClick={handleMultiDelete} variant="destructive">
              Delete Selected ({selectedRows.size})
            </Button>
          )}
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                  onCheckedChange={toggleAllSelection}
                  aria-label="Select all"
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData?.length ? (
              filteredData.map((row, index) => (
                <TableRow key={row.id || index} data-state={selectedRows.has(row.id) ? "selected" : ""}>
                  <TableCell className="w-[50px]">
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={() => toggleRowSelection(row.id)}
                      aria-label="Select row"
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell 
                        ? column.cell(row[column.accessorKey], row)
                        : row[column.accessorKey]
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}