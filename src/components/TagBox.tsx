import { Tag } from '../db-types';

export function TagBox({
  tag,
  onClose,
}: {
  tag: Tag;
  onClose: (tag: Tag) => void;
}) {
  return (
    <div>
      <span>{tag.name + ' '}</span>
      <span
        onClick={() => {
          onClose(tag);
        }}
      >
        {'\u2715'}
      </span>
    </div>
  );
}
