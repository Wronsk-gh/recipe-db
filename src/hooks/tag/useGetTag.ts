import { useGetTagsDbQuery } from './useGetTagsDbQuery';
import { Tag } from '../../models/db-types';
import { getTag } from '../../models/RecipeUtils';

export function useGetTag(tagId: string): Tag {
  const { data: tagsDb } = useGetTagsDbQuery();

  return getTag(tagId, tagsDb);
}
