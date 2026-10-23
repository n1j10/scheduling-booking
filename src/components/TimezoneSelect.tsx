import { Select } from '@/components/ui';
import { getAllTimezones } from '@/lib/date';

const TIMEZONES = getAllTimezones();

type TimezoneSelectProps = {
  id?: string;
  value: string;
  onChange: (timezone: string) => void;
};

export function TimezoneSelect({ id, value, onChange }: TimezoneSelectProps) {
  // Make sure the current value is always in the list (e.g. "UTC")
  const options = TIMEZONES.includes(value) ? TIMEZONES : [value, ...TIMEZONES];

  return (
    <Select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((timezone) => (
        <option key={timezone} value={timezone}>
          {timezone.replace(/_/g, ' ')}
        </option>
      ))}
    </Select>
  );
}
