import { useGetTagsDbQuery } from './useGetTagsDbQuery';
import { Tag } from '../../db-types';
import { getTag } from '../../models/RecipeUtils';

export function useGetAllTags(): Tag[] {
  const { data: tagsDb } = useGetTagsDbQuery();

  return Object.keys(tagsDb).map((id) => {
    return getTag(id, tagsDb);
  });
}
