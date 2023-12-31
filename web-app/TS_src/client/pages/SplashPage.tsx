import React from 'react';
import MeetTheTeam from '../components/MeetTheTeam';
import Footer from '../components/Footer';
import useStore from '../store';
import IntroSection from '../components/IntroSection';
import InstructionSection from '../components/InstructionSection';
import FeaturesSection from '../components/FeaturesSection';


const SplashPage: React.FC<{}> = () => {  
  return (  
    <main>
      <IntroSection />
      <FeaturesSection />
      <InstructionSection />
      <MeetTheTeam />
    </main>
  );
}

export default SplashPage;
