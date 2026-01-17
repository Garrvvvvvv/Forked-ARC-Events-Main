import TeamMember from './TeamMember';

export default function DepartmentSection({ name, icon: Icon, members }) {
  return (
    <div className="relative">
      {/* Softer background, minimal hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-600/5 rounded-3xl blur-xl opacity-40 group-hover:opacity-50 transition-opacity duration-200 pointer-events-none"></div>

      <div
        className="relative bg-[#0d0e12]/90 rounded-3xl p-6 md:p-8
        border border-white/10 backdrop-blur-sm shadow-lg"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-2.5 bg-gradient-to-br from-blue-500/30 to-violet-600/30 rounded-xl ring-1 ring-white/10">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-white">
            {name}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 justify-items-center">
          {members.map((member, index) => (
            <div key={index} className="group">
              <TeamMember {...member} size="small" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
