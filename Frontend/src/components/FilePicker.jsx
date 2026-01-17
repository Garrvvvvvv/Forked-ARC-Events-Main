export default function FilePicker({ label, onChange }) {
  return (
    <div className="relative w-full">
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />

      <div className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white flex justify-between items-center">
        <span>{label}</span>
        <span className="text-sm bg-indigo-600 px-3 py-1 rounded">Browse</span>
      </div>
    </div>
  );
}
