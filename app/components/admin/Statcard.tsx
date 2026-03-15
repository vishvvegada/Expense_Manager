interface Props {
  title: string;
  value: string | number;
  color: string;
}

export default function StatCard({ title, value, color }: Props) {
  return (
    <div className={`bg-white rounded-xl shadow p-6 border-l-4 ${color}`}>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
