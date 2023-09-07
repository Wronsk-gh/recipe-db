export function CallbackButton({
  label,
  onButtonClick,
}: {
  label: string;
  onButtonClick: any;
}) {
  return <button onClick={onButtonClick}>{label}</button>;
}
