import HeroSection from '../../layouts/HeroSection'

const members = [
  {
    school: 'The Hawken School',
    location: 'Cleveland, OH',
    logo: 'https://bbk12e1-cdn.myschoolcdn.com/ftpimages/291/logo/Hawken_Design_SLICED_03.png',
    link: 'https://masteryschool.hawken.edu/',
  },
  // To add a new member, copy the template below and fill in the fields:
  // {
  //   school: 'School Name',
  //   location: 'City, ST',
  //   logo: 'https://example.com/logo.png',
  //   link: 'https://example.com/',  // optional — remove this line if no link
  // },
]

function MemberCard({ school, location, logo, link }) {
  const content = (
    <div className="card bg-base-200 hover:shadow-lg transition-shadow h-full">
      <figure className="px-8 pt-8">
        <img
          src={logo}
          alt={`${school} logo`}
          className="h-24 w-auto object-contain"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h3 className="card-title text-lg">{school}</h3>
        <p className="text-sm text-base-content/60">{location}</p>
        {link && (
          <p className="text-xs text-primary mt-1">Visit project page &rarr;</p>
        )}
      </div>
    </div>
  )

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="no-underline">
        {content}
      </a>
    )
  }

  return content
}

export default function Members() {
  return (
    <div>
      <HeroSection title="Member Schools" subtitle="Meet the schools in the Superpowers Project consortium" />
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="prose max-w-none mb-10">
          <p>
            The Superpowers Project brings together a growing consortium of schools pioneering
            AI-based student portfolio assessment. Our member schools are committed to exploring
            innovative approaches to recognizing and developing student strengths.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <MemberCard key={member.school} {...member} />
          ))}
        </div>
      </section>
    </div>
  )
}
