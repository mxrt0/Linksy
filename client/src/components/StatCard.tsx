export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-white/3 border border-black/10 dark:border-white/[0.07] rounded-xl p-4">
      <p className="text-[11px] cursor-default uppercase tracking-wider text-black/40 dark:text-white/40 mb-1">{label}</p>
      <p className="text-2xl cursor-default font-medium text-black dark:text-white">{value}</p>
    </div>
  );
}