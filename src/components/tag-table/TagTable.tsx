// import '../App.css';
import { TagRow } from './TagRow';
import { Tag } from '../../db-types';
import { useGetAllTags } from '../../hooks/tag/useGetAllTags';
import { AddTagButton } from './AddTagButton';
import { useGetIsRecipesLoading } from '../../hooks/db/useGetIsDbLoading';
import { useTagsColumns } from '../../hooks/tag/useTagsColumns';
import { useTable } from '../../hooks/table/useTable';
import { TableFilters } from '../table/TableFilters';

export function TagTable() {
  const tag = useGetAllTags();

  const isLoading = useGetIsRecipesLoading();
  // Display loading animation in case the data are not yet fetched
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <TagTableLoaded tag={tag} />;
}

function TagTableLoaded({ tag }: { tag: Tag[] }) {
  const columns = useTagsColumns();
  const table = useTable(tag, columns);

  // Get all the rows to be displayed
  const rows = table
    .getRowModel()
    .rows.map((tableRow) => (
      <TagRow key={tableRow.original.id} tagId={tableRow.original.id} />
    ));

  return (
    <>
      <TableFilters table={table} />
      <div>
        {rows}
        <AddTagButton />
      </div>
    </>
  );
}
