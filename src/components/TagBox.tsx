import { TagBadge } from '../db-types';

export function TagBox({
  tag,
  onClose,
}: {
  tag: TagBadge;
  onClose: (tag: TagBadge) => void;
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
