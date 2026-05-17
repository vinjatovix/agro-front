import { t } from '../../../i18n/core/t';
interface Props {
  readonly value: 'asc' | 'desc';
  readonly labelAsc?: string;
  readonly labelDes?: string;
  readonly onChange: (value: 'asc' | 'desc') => void;
}

export default function OrderSelector({
  value,
  labelAsc,
  labelDes,
  onChange
}: Props) {
  return (
    <>
      <label htmlFor="order-select">{t('common.orders.order')}: </label>
      <select
        id="order-select"
        value={value}
        onChange={(e) => onChange(e.target.value as 'asc' | 'desc')}
      >
        <option value="asc">↑ {labelAsc}</option>
        <option value="desc">↓ {labelDes}</option>
      </select>
    </>
  );
}
