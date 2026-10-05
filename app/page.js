// Server component — data fetched at build/request time with ISR.
import HomePage from "./components/HomePage";
import { getProjects, getSkills, getSettings } from "../lib/data";

export const revalidate = 60;

export default async function Home() {
  const [projects, skills, settings] = await Promise.all([
    getProjects(),
    getSkills(),
    getSettings(),
  ]);

  return (
    <HomePage
      projects={projects}
      skills={skills}
      settings={settings || {}}
    />
  );
}
