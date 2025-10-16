import { useAuthQueries } from "@/utils/data/auth-queries";
import { createFileRoute } from "@tanstack/react-router";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { User } from "better-auth";
import { useMemo, useState } from "react";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface IData extends User {}

export const Route = createFileRoute("/_auth/_pathlessLayout/settings/users")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const userSession = await context.queryClient.fetchQuery(
      useAuthQueries.user()
    );

    const users = await context.queryClient.fetchQuery(useAuthQueries.users());

    return {
      user: userSession?.user,
      users,
    };
  },
});

function RouteComponent() {
  const { users } = Route.useLoaderData();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: true },
  ]);

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: users.users,
    pageCount: Math.ceil((users?.total || 0) / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <DataGrid
          table={table}
          recordCount={users?.total || 0}
          tableLayout={{ dense: true }}
        >
          <div className="w-full space-y-2.5">
            <DataGridContainer>
              <ScrollArea>
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DataGridContainer>
            <DataGridPagination />
          </div>
        </DataGrid>
      </div>
    </div>
  );
}
