interface Expense {
  CategoryName: string;
  Amount: number;
  ExpenseDate: string;
}

export default function Table({ data }: { data: Expense[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="text-left py-2">Category</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((e, i) => (
            <tr key={i} className="border-b">
              <td className="py-2">{e.CategoryName}</td>
              <td className="text-center">₹{e.Amount}</td>
              <td className="text-center">
                {new Date(e.ExpenseDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
