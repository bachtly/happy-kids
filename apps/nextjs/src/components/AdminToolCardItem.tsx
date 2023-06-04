import Link from "next/link";
export interface AdminToolCardItemProps {
  label: string;
  cardHref: string;
}

export const AdminToolCardItem = ({
  label,
  cardHref
}: AdminToolCardItemProps) => {
  return (
    <div className={"px-2 py-1"}>
      <Link href={cardHref}>{label}</Link>
    </div>
  );
};
