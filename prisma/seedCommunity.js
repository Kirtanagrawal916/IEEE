import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const communityLearners = [
  {
    name: 'Priya Patel',
    username: 'priyacodes',
    email: 'priya.patel@herearn.org',
    role: 'LEARNER',
    title: 'Full-Stack React & Node Specialist',
    bio: 'Self-taught developer building accessible web apps for rural education. Loves Next.js and Tailwind.',
    location: 'Ahmedabad, Gujarat',
    skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'REST APIs']),
    interests: JSON.stringify(['Web Development', 'Open Source', 'Mentorship', 'Hackathons']),
    learningPath: 'Frontend Development',
    learningGoal: 'Full-Stack Web Developer',
    portfolioLinks: JSON.stringify([
      { label: 'GitHub', url: 'https://github.com/priyapatel' },
      { label: 'Portfolio', url: 'https://priyadev.vercel.app' },
    ]),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    skillPoints: 420,
    totalEarned: 8500,
    earnings: 8500,
  },
  {
    name: 'Ritu Sengupta',
    username: 'ritusengupta',
    email: 'ritu.sengupta@herearn.org',
    role: 'LEARNER',
    title: 'UI/UX Designer & Design Systems',
    bio: 'Designing empowering mobile apps and fintech solutions for women entrepreneurs. Figma advocate.',
    location: 'Kolkata, West Bengal',
    skills: JSON.stringify(['UI/UX Design', 'Figma', 'User Research', 'Wireframing', 'Design Systems']),
    interests: JSON.stringify(['Product Design', 'Inclusive Tech', 'Freelancing', 'Case Studies']),
    learningPath: 'UI/UX Design',
    learningGoal: 'Lead Product Designer',
    portfolioLinks: JSON.stringify([
      { label: 'Behance', url: 'https://behance.net/ritusengupta' },
      { label: 'Figma', url: 'https://figma.com/@ritu' },
    ]),
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    skillPoints: 390,
    totalEarned: 11200,
    earnings: 11200,
  },
  {
    name: 'Sneha Roy',
    username: 'sneharoy',
    email: 'sneha.roy@herearn.org',
    role: 'LEARNER',
    title: 'Data Analyst & BI Specialist',
    bio: 'Turning messy numbers into clear business growth insights. Python, SQL, and PowerBI enthusiast.',
    location: 'Bengaluru, Karnataka',
    skills: JSON.stringify(['Python', 'SQL', 'PowerBI', 'Data Visualization', 'Excel Advanced']),
    interests: JSON.stringify(['Data Science', 'Business Analytics', 'AI Ethics', 'Freelance Analytics']),
    learningPath: 'Data Analytics & AI',
    learningGoal: 'Senior Data Analyst',
    portfolioLinks: JSON.stringify([
      { label: 'Kaggle', url: 'https://kaggle.com/sneharoy' },
      { label: 'GitHub', url: 'https://github.com/sneharoy' },
    ]),
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    skillPoints: 480,
    totalEarned: 15400,
    earnings: 15400,
  },
  {
    name: 'Meera Nair',
    username: 'meeranair',
    email: 'meera.nair@herearn.org',
    role: 'LEARNER',
    title: 'SEO & Growth Marketing Strategist',
    bio: 'Helping small women-led brands scale organic traffic from 0 to 50k monthly visits. Content & copy expert.',
    location: 'Kochi, Kerala',
    skills: JSON.stringify(['Digital Marketing', 'SEO', 'Google Analytics', 'Content Strategy', 'Email Marketing']),
    interests: JSON.stringify(['Growth Hacking', 'E-commerce', 'Storytelling', 'Community Building']),
    learningPath: 'Digital Marketing',
    learningGoal: 'Head of Growth Marketing',
    portfolioLinks: JSON.stringify([
      { label: 'Substack', url: 'https://meeranair.substack.com' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/meeranair' },
    ]),
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300',
    skillPoints: 310,
    totalEarned: 6700,
    earnings: 6700,
  },
  {
    name: 'Diya Varma',
    username: 'diyavarma',
    email: 'diya.varma@herearn.org',
    role: 'LEARNER',
    title: 'Cloud Solutions & DevOps Learner',
    bio: 'Computer science graduate diving into AWS, Docker, and CI/CD pipelines. Aspiring DevOps engineer.',
    location: 'Pune, Maharashtra',
    skills: JSON.stringify(['Docker', 'AWS', 'Linux', 'CI/CD', 'Python', 'Git']),
    interests: JSON.stringify(['Cloud Computing', 'DevOps', 'Infrastructure as Code', 'Tech Talks']),
    learningPath: 'Cloud & DevOps',
    learningGoal: 'Cloud DevOps Specialist',
    portfolioLinks: JSON.stringify([
      { label: 'Dev.to', url: 'https://dev.to/diyavarma' },
      { label: 'GitHub', url: 'https://github.com/diyavarma' },
    ]),
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
    skillPoints: 360,
    totalEarned: 4200,
    earnings: 4200,
  },
  {
    name: 'Tanvi Kulkarni',
    username: 'tanvicreates',
    email: 'tanvi.kulkarni@herearn.org',
    role: 'LEARNER',
    title: 'Content Creator & Video Producer',
    bio: 'Producing educational short-form reels and product launch videos for lifestyle and D2C brands.',
    location: 'Mumbai, Maharashtra',
    skills: JSON.stringify(['Video Editing', 'Premiere Pro', 'Scriptwriting', 'CapCut', 'Canva']),
    interests: JSON.stringify(['Creator Economy', 'Video Production', 'Brand Deals', 'Podcasting']),
    learningPath: 'Content Creation',
    learningGoal: 'Creative Director',
    portfolioLinks: JSON.stringify([
      { label: 'YouTube', url: 'https://youtube.com/@tanvicreates' },
      { label: 'Instagram', url: 'https://instagram.com/tanvicreates' },
    ]),
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300',
    skillPoints: 410,
    totalEarned: 9800,
    earnings: 9800,
  },
];

async function seed() {
  console.log('Seeding Community Learners...');
  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  for (const learner of communityLearners) {
    await prisma.user.upsert({
      where: { email: learner.email },
      update: {
        title: learner.title,
        bio: learner.bio,
        location: learner.location,
        skills: learner.skills,
        interests: learner.interests,
        learningPath: learner.learningPath,
        learningGoal: learner.learningGoal,
        portfolioLinks: learner.portfolioLinks,
        avatar: learner.avatar,
      },
      create: {
        ...learner,
        passwordHash: defaultPasswordHash,
      },
    });
    console.log(`Seeded learner: ${learner.name} (@${learner.username})`);
  }

  // Also update Ananya's community fields
  await prisma.user.updateMany({
    where: { email: 'ananya@herearn.org' },
    data: {
      learningGoal: 'Digital Marketing Lead',
      learningPath: 'Digital Marketing',
      interests: JSON.stringify(['E-commerce', 'Social Media', 'Canva Design', 'Micro-gigs']),
      portfolioLinks: JSON.stringify([
        { label: 'Portfolio', url: 'https://herearn.vercel.app/portfolio' }
      ]),
    },
  });

  console.log('Community seeding completed successfully!');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error('Error seeding community:', e);
  prisma.$disconnect();
  process.exit(1);
});
