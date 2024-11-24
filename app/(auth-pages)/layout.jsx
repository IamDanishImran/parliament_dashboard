export default async function Layout({ children }) {
  return (
    <div className="bg-slate-50 flex flex-col justify-center gap-12 h-screen w-full">
      {children}
    </div>
  );
}