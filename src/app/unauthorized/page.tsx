// app/unauthorized/page.tsx

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-4">
      <div>
        <h1 className="text-3xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="text-gray-600">
          You don’t have permission to access this page.
        </p>
      </div>
    </div>
  );
}
