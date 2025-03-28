import Image from "next/image"
import type { FC } from "react"

interface TestimonialProps {
  name: string
  title: string
  company: string
  testimonial: string
  avatar: string
  logo: string
  logoAlt: string
}

// const testimonialData: TestimonialProps[] = [
//   {
//     name: "Lucy Tarr",
//     title: "CEO of",
//     company: "AB.co",
//     testimonial:
//       "Ut enim ad minima veniam, quis nostrum exercitationem ullam? Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
//     avatar: "/home/testimonials/Image1.svg",
//     logo: "/home/testimonials/Google.svg",
//     logoAlt: "Google logo",
//   },
//   {
//     name: "Grant Styles",
//     title: "CEO of",
//     company: "Bifco Enterprises Ltd.",
//     testimonial:
//       "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet? Ut enim ad minima veniam, quis nostrum exercitationem ullam.",
//       avatar: "/home/testimonials/Image2.svg",
//       logo: "/home/testimonials/App.svg",
//     logoAlt: "App Store logo",
//   },
//   {
//     name: "Ralph Edwards",
//     title: "Director at",
//     company: "Acme.co",
//     testimonial:
//       "Convallis a cras semper auctor neque. Fringilla est ullamcorper eget nulla facilisi etiam dignissim. Aliquam porta nisi dolor, molestie pellentesque elit molestie in.",
//       avatar: "/home/testimonials/Image3.png",
//       logo: "/home/testimonials/x.svg",
//     logoAlt: "X logo",
//   },
//   {
//     name: "Annette Black",
//     title: "Manager at",
//     company: "Barone LLC.",
//     testimonial:
//       "Consectetur adipiscing elit duis tristique sollicitudin. Vel risus commodo viverra maecenas accumsan. Nemo enim ipsam voluptatem quia voluptas sit aspernatur.",
//       avatar: "/home/testimonials/Image4.png",
//       logo: "/home/testimonials/facebook.svg",
//     logoAlt: "Facebook logo",
//   },
//   {
//     name: "Robert Fox",
//     title: "CEO of",
//     company: "Bifco Enterprises Ltd.",
//     testimonial:
//       "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet? Ut enim ad minima veniam, quis nostrum exercitationem ullam.",
//       avatar: "/home/testimonials/Image5.svg",
//       logo: "/home/testimonials/Google.svg",
//     logoAlt: "Google logo",
//   },
//   {
//     name: "Brooklyn Simmons",
//     title: "CEO of",
//     company: "AB.co",
//     testimonial:
//       "Ut enim ad minima veniam, quis nostrum exercitationem ullam? Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
//       avatar: "/home/testimonials/Image6.svg",
//       logo: "/home/testimonials/x.svg",
//     logoAlt: "X logo",
//   },
//   {
//     name: "Ralph Edwards",
//     title: "Director at",
//     company: "Acme.co",
//     testimonial:
//       "Convallis a cras semper auctor neque. Fringilla est ullamcorper eget nulla facilisi etiam dignissim. Aliquam porta nisi dolor, molestie pellentesque elit molestie in.",
//       avatar: "/home/testimonials/Image1.svg",
//       logo: "/home/testimonials/x.svg",
//     logoAlt: "X logo",
//   },
//   {
//     name: "Grant Styles",
//     title: "CEO of",
//     company: "Bifco Enterprises Ltd.",
//     testimonial:
//       "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet? Ut enim ad minima veniam, quis nostrum exercitationem ullam.",
//       avatar: "/home/testimonials/Image2.svg",
//       logo: "/home/testimonials/App.svg",
//     logoAlt: "App Store logo",
//   },
//   {
//     name: "Annette Black",
//     title: "Manager at",
//     company: "Barone LLC.",
//     testimonial:
//       "Consectetur adipiscing elit duis tristique sollicitudin. Vel risus commodo viverra maecenas accumsan. Nemo enim ipsam voluptatem quia voluptas sit aspernatur.",
//       avatar: "/home/testimonials/Image1.svg",
//       logo: "/home/testimonials/Google.svg",
//     logoAlt: "Google logo",
//   },
//   {
//     name: "Ralph Edwards",
//     title: "Director at",
//     company: "Acme.co",
//     testimonial:
//       "Convallis a cras semper auctor neque. Fringilla est ullamcorper eget nulla facilisi etiam dignissim. Aliquam porta nisi dolor, molestie pellentesque elit molestie in.",
//       avatar: "/home/testimonials/Image1.svg",
//       logo: "/home/testimonials/x.svg",
//     logoAlt: "X logo",
//   },
//   {
//     name: "Grant Styles",
//     title: "CEO of",
//     company: "Bifco Enterprises Ltd.",
//     testimonial:
//       "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet? Ut enim ad minima veniam, quis nostrum exercitationem ullam.",
//       avatar: "/home/testimonials/Image4.svg",
//       logo: "/home/testimonials/App.svg",
//     logoAlt: "App Store logo",
//   },
//   {
//     name: "Brooklyn Simmons",
//     title: "CEO of",
//     company: "AB.co",
//     testimonial:
//       "Ut enim ad minima veniam, quis nostrum exercitationem ullam? Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
//       avatar: "/home/testimonials/Image6.svg",
//       logo: "/home/testimonials/x.svg",
//     logoAlt: "X logo",
//   },
// ]

const testimonialData: TestimonialProps[] = [
  {
    name: "Lucy Tarr",
    title: "CEO of",
    company: "AB.co",
    testimonial:
      "LeadFume transformed our sales process with real-time, accurate leads. It’s fast, reliable, and has significantly boosted our conversion rates.",
    avatar: "/home/testimonials/Image1.svg",
    logo: "/home/testimonials/Google.svg",
    logoAlt: "Google logo",
  },
  {
    name: "Grant Styles",
    title: "CEO of",
    company: "Bifco Enterprises Ltd.",
    testimonial:
      "The AI-powered filtering and real-time data collection from LeadFume have saved us countless hours and delivered high-quality leads instantly.",
    avatar: "/home/testimonials/Image2.svg",
    logo: "/home/testimonials/App.svg",
    logoAlt: "App Store logo",
  },
  {
    name: "Ralph Edwards",
    title: "Director at",
    company: "Acme.co",
    testimonial:
      "With LeadFume, we get verified leads tailored to our needs in seconds. It’s a game-changer for our B2B outreach efforts.",
    avatar: "/home/testimonials/Image3.png",
    logo: "/home/testimonials/x.svg",
    logoAlt: "X logo",
  },
  {
    name: "Annette Black",
    title: "Manager at",
    company: "Barone LLC.",
    testimonial:
      "LeadFume’s customizable searches and data validation ensure we only target the right prospects, making our campaigns more effective than ever.",
    avatar: "/home/testimonials/Image4.png",
    logo: "/home/testimonials/facebook.svg",
    logoAlt: "Facebook logo",
  },
  {
    name: "Robert Fox",
    title: "CEO of",
    company: "Bifco Enterprises Ltd.",
    testimonial:
      "The speed of LeadFume’s lead retrieval is unmatched—over 1 million pages crawled per second means we never miss an opportunity.",
    avatar: "/home/testimonials/Image5.svg",
    logo: "/home/testimonials/Google.svg",
    logoAlt: "Google logo",
  },
  {
    name: "Brooklyn Simmons",
    title: "CEO of",
    company: "AB.co",
    testimonial:
      "LeadFume’s cost-effective pricing and fresh leads have helped us scale our startup faster than we ever imagined.",
    avatar: "/home/testimonials/Image6.svg",
    logo: "/home/testimonials/x.svg",
    logoAlt: "X logo",
  },
  {
    name: "Ralph Edwards",
    title: "Director at",
    company: "Acme.co",
    testimonial:
      "The real-time lead generation and smart filtering from LeadFume have streamlined our sales pipeline like never before.",
    avatar: "/home/testimonials/Image1.svg",
    logo: "/home/testimonials/x.svg",
    logoAlt: "X logo",
  },
  {
    name: "Grant Styles",
    title: "CEO of",
    company: "Bifco Enterprises Ltd.",
    testimonial:
      "LeadFume delivers verified, up-to-date leads that have drastically reduced our outreach time and improved our ROI.",
    avatar: "/home/testimonials/Image2.svg",
    logo: "/home/testimonials/App.svg",
    logoAlt: "App Store logo",
  },
  {
    name: "Annette Black",
    title: "Manager at",
    company: "Barone LLC.",
    testimonial:
      "Thanks to LeadFume’s ultra-fast crawling and accurate data, our marketing team now focuses on closing deals instead of chasing bad leads.",
    avatar: "/home/testimonials/Image1.svg",
    logo: "/home/testimonials/Google.svg",
    logoAlt: "Google logo",
  },
  {
    name: "Ralph Edwards",
    title: "Director at",
    company: "Acme.co",
    testimonial:
      "LeadFume’s ability to provide targeted, validated leads in real-time has been a huge asset for our enterprise growth strategy.",
    avatar: "/home/testimonials/Image1.svg",
    logo: "/home/testimonials/x.svg",
    logoAlt: "X logo",
  },
  {
    name: "Grant Styles",
    title: "CEO of",
    company: "Bifco Enterprises Ltd.",
    testimonial:
      "The customizable search options in LeadFume allow us to pinpoint exactly the right prospects, saving us time and money.",
    avatar: "/home/testimonials/Image4.svg",
    logo: "/home/testimonials/App.svg",
    logoAlt: "App Store logo",
  },
  {
    name: "Brooklyn Simmons",
    title: "CEO of",
    company: "AB.co",
    testimonial:
      "LeadFume’s AI-driven platform delivers fresh, relevant leads every time, making it an essential tool for our sales team.",
    avatar: "/home/testimonials/Image6.svg",
    logo: "/home/testimonials/x.svg",
    logoAlt: "X logo",
  },
]

const Testimonial: FC<TestimonialProps> = ({ name, title, company, testimonial, avatar, logo, logoAlt }) => {
  return (
    <div className="flex flex-col hover:bg-blue-500 hover:text-white transition-colors duration-300 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image src={avatar || "/placeholder.svg"} alt={`${name}'s avatar`} fill className="object-cover" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-medium text-base">{name}</h3>
          <p className="text-sm text-gray-600">
            {title} {company}
          </p>
        </div>
        <div className="ml-auto">
          <Image src={logo || "/placeholder.svg"} alt={logoAlt} width={24} height={24} className="object-contain" />
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{testimonial}</p>
    </div>
  )
}

const Testimonials: FC = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="sm:text-6xl text-4xl font-bold text-primary2 mb-4">Testimonials</h2>
      <p className="text-gray-700 max-w-3xl mb-12">
        Hear from businesses that have transformed their lead generation with LeadFume’s real-time, AI-driven platform.
      </p>

      <div className="w-full h-px bg-yellow-300 mb-12"></div>

      <div className="grid grid-cols-1  lg:grid-cols-3 gap-12">
        {testimonialData.slice(0, 3).map((testimonial, index) => (
          <Testimonial key={index} {...testimonial} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:-ml-5 xl:-ml-14   my-8 lg:grid-cols-3 gap-12">
        {testimonialData.slice(3, 6).map((testimonial, index) => (
          <Testimonial key={index} {...testimonial} />
        ))}
      </div>
      <div className="grid grid-cols-1  lg:grid-cols-3 gap-12">
        {testimonialData.slice(6, 9).map((testimonial, index) => (
          <Testimonial key={index} {...testimonial} />
        ))}
      </div>
    </section>
  )
}

export default Testimonials


