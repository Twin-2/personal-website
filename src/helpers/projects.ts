export type Project = {
  title: string;
  url?: string;
  width?: string;
  linkUrl?: string;
  technologyUsed?: string[];
};

export const projects: Project[] = [
  {
    // url: "/static/myprescryptive.png?auto=format&fit=crop&w=400",
    title: "myPrescryptive",
    width: "40%",
    linkUrl: "https://my.prescryptive.com",
  },
  {
    title: "Farming Game Helper",
    width:'40%',
    linkUrl: 'https://farming-game-helper.netlify.app/'
  }
];

export default projects;
