export default function MainLoader({ message }: { message: string }) {
  return (
    <div className="flex-1 overflow-y-auto flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-zinc-600 dark:text-zinc-400">{message}</p>
      </div>
    </div>
  );
}
