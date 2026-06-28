import './calendarRow.css';

export default function CalendarRow({
  label,
  children
}: {
  readonly label: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div className="calendar-row">
      <div className="calendar-row__label">{label}</div>
      <div className="calendar-row__value">{children}</div>
    </div>
  );
}
