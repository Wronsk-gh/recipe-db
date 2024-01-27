import '../App.css';
import { TagRow } from './TagRow';
import { useGetAllTags } from '../hooks/useGetAllTags';
import { AddTagButton } from './AddTagButton';
import { useGetIsRecipesLoading } from '../hooks/useGetIsRecipesLoading';

export function TagTable() {
  const isLoading = useGetIsRecipesLoading();
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return <TagTableLoaded />;
}

function TagTableLoaded() {
  const tags = useGetAllTags();
  const rows = [];

  for (const tag of tags) {
    rows.push(
      <TagRow
        key={tag.id}
        tag={tag}
        // onEdit={setEditedObject}
      />
    );
  }

  return (
    <div>
      {rows}
      <AddTagButton />
    </div>
  );
}
