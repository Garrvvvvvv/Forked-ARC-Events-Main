import { FaLinkedin, FaGithub } from 'react-icons/fa';

export default function TeamMember({
  name,
  position,
  photo,
  linkedin,
  github,
  size = 'small',
}) {
  // Increased avatar sizes; gentle hover only
  const sizeConfig = {
    large: {
      container: 'w-72',
      image: 'w-64 h-64', // was 56x56 -> bigger
      nameSize: 'text-2xl',
      positionSize: 'text-base',
      padding: 'p-7',
    },
    medium: {
      container: 'w-60',
      image: 'w-52 h-52', // was 44x44 -> bigger
      nameSize: 'text-xl',
      positionSize: 'text-sm',
      padding: 'p-6',
    },
    small: {
      container: 'w-52',
      image: 'w-40 h-40', // was 32x32 -> bigger
      nameSize: 'text-lg',
      positionSize: 'text-sm',
      padding: 'p-5',
    },
  };

  const config = sizeConfig[size] ?? sizeConfig.small;

  const LinkedInIcon = FaLinkedin || null;
  const GitHubIcon = FaGithub || null;

  return (
    <div className={`${config.container}`}>
      <div className="relative">
        {/* very subtle background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300/0 to-gray-600/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>

        <div
          className={`relative bg-[#0f1014] rounded-2xl ${config.padding}
          border border-white/10 transition-all duration-200
          hover:border-white/20`}
        >
          <div className="flex flex-col items-center">
            {/* Avatar — circular, larger, very slight hover scale */}
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full blur-md opacity-30 group-hover:opacity-40 transition-opacity duration-200 bg-gradient-to-br from-gray-300/10 to-gray-500/10" />
              <div
                className={`relative ${config.image} rounded-full overflow-hidden border-2 border-white/10`}
              >
                <img
                  src={photo}
                  alt={name}
                  className="w-full h-full object-cover transform transition-transform duration-200 group-hover:scale-[1.02]"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://dummyimage.com/800x800/0f0f17/ffffff&text=No+Image';
                  }}
                />
              </div>
            </div>

            {/* Name + position */}
            <h3
              className={`text-white font-semibold ${config.nameSize} text-center mb-1`}
            >
              {name}
            </h3>
            <p
              className={`text-gray-400 ${config.positionSize} text-center leading-relaxed mb-4`}
            >
              {position}
            </p>

            {/* Socials (kept minimal) */}
            <div className="flex gap-4">
              {linkedin && typeof linkedin === 'string' && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn profile of ${name}`}
                  className="text-gray-400 hover:text-gray-100 transition-colors duration-150"
                >
                  {LinkedInIcon ? <LinkedInIcon size={20} /> : 'LI'}
                </a>
              )}
              {github && typeof github === 'string' && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GitHub profile of ${name}`}
                  className="text-gray-400 hover:text-gray-100 transition-colors duration-150"
                >
                  {GitHubIcon ? <GitHubIcon size={20} /> : 'GH'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
