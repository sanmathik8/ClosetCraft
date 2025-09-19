// pages/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styled, { createGlobalStyle } from "styled-components";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaHome,
  FaInfoCircle,
  FaShoppingCart,
  FaClipboardList,
  FaUserPlus,
  FaSignInAlt,
  FaStore,
  FaSignOutAlt
} from "react-icons/fa";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Playfair Display', serif;
    background-color: #fdfdfd;
    color: #111;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  #__next {
    height: 100%;
    background-color: #fdfdfd;
  }
`;

/* Top Bar */
const TopBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  z-index: 10002;
  display: flex;
  align-items: center;
  justify-content: center; /* keep logo centered */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

/* Centered Logo */
const Logo = styled.div`
  font-family: 'Great Vibes', cursive;
  font-size: 2.5rem;
  color: #000; /* black text */
  cursor: pointer;
  text-align: center;

  &:hover {
    color: #444;
    transform: scale(1.05);
    transition: all 0.3s ease;
  }
`;

/* Sidebar Toggle positioned left */
const SidebarToggle = styled.button`
  position: absolute;
  left: 1rem;
  background: none;
  border: none;
  font-size: 1.7rem;
  color: #111;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    color: #444;
  }
`;

const Sidebar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  z-index: 10003;
  padding: 2rem;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #111;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #555;
  cursor: pointer;
`;

const SidebarNav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  text-decoration: none;
  color: #333;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #fdfdfd;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  font-family: 'Montserrat', sans-serif;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    background: #f2f2f2;
    color: #111;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid #eee;
  margin-top: 2rem;
  text-align: center;
`;

const UserAvatar = styled(FaUserCircle)`
  font-size: 3.5rem;
  color: #111;
  margin-bottom: 0.5rem;
`;

const UserGreeting = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0.25rem 0;
  color: #333;
`;

const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  padding: 6rem 1rem 2rem;
  flex-direction: column;
`;

const Background = styled(motion.div)<{ bgUrl: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.bgUrl});
  background-size: cover;
  background-position: center;
  z-index: 0;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.35);
    z-index: 1;
  }
`;

const Content = styled(motion.div)`
  z-index: 2;
  max-width: 900px;
  padding: 2rem;
  text-align: center;
`;

const ImageOverlayWrapper = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  margin: 1rem auto;
`;

const TextCard = styled.div`
  margin: 1rem auto;
  padding: 2rem 2.5rem;
  background: rgba(255,255,255,0.9);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  max-width: 550px;
  text-align: center;
  backdrop-filter: blur(12px);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h1,h2 {
    margin-bottom: 0.5rem;
    font-family: 'Playfair Display', serif;
  }
  p {
    margin: 0;
    font-size: 1rem;
    color: #333;
  }
`;

const ExploreNowContainer = styled.div`
  position: fixed;
  top: 55%;
  right: 5%;
  transform: translateY(-50%);
  z-index: 5;
  background: linear-gradient(145deg, #ffe6f0, #fff5e6);
  padding: 1.5rem;
  border-radius: 25px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  text-align: center;
  width: 280px;
  font-family: 'Playfair Display', serif;
  animation: floatIn 1s ease-out;
  opacity: 0.95;

  @keyframes floatIn {
    from { opacity: 0; transform: translateY(-60%);}
    to { opacity: 0.95; transform: translateY(-50%);}
  }

  @media (max-width: 768px) {
    position: static;
    width: 90%;
    margin: 2rem auto;
    transform: none;
  }
`;

const StartButton = styled.button`
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background: #111;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }
`;

const ScrollIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 5px;
  background: #111;
  z-index: 10000;
`;

const MotionImage = motion(Image);

const Loader = styled.div`
  position: fixed;
  top:0; left:0; right:0; bottom:0;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:2rem;
  background:#fdfdfd;
  z-index:9999;
`;

const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const fabricY = useTransform(scrollYProgress, [0,1], ["0%","-50%"]);
  const floralY = useTransform(scrollYProgress, [0,1], ["0%","-40%"]);
  const laceY = useTransform(scrollYProgress, [0,1], ["0%","-30%"]);
  const scrollWidth = useTransform(scrollYProgress, [0,1], ["0%","100%"]);

  const [loading,setLoading] = useState(true);
  const [user,setUser] = useState<{name?:string,email?:string}|null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    const timer = setTimeout(()=>setLoading(false),1200);
    return ()=>clearTimeout(timer);
  },[]);

  useEffect(()=>{
    const storedUser = typeof window!=="undefined" && localStorage.getItem("user");
    if(storedUser) setUser(JSON.parse(storedUser));
  },[]);

  const handleLogout=()=>{
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  if(loading) return <Loader>Loading Fashion...</Loader>;

  return <>
    <GlobalStyle />
    <ScrollIndicator style={{width:scrollWidth.get()}}/>

    {/* Top Bar */}
    <TopBar>
      <SidebarToggle onClick={() => setIsSidebarOpen(true)}>
        <FaBars />
      </SidebarToggle>
      <Logo onClick={()=>router.push("/")}>Closet Craft</Logo>
    </TopBar>

    {/* Sidebar */}
    <AnimatePresence>
      {isSidebarOpen && (
        <Sidebar
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <SidebarHeader>
            <CloseButton onClick={() => setIsSidebarOpen(false)}><FaTimes /></CloseButton>
          </SidebarHeader>

          <SidebarNav>
            <SidebarLink href="/explore" onClick={() => setIsSidebarOpen(false)}>
              <FaStore /> Explore
            </SidebarLink>
            <SidebarLink href="/" onClick={() => setIsSidebarOpen(false)}>
              <FaHome /> Home
            </SidebarLink>
            <SidebarLink href="/about" onClick={() => setIsSidebarOpen(false)}>
              <FaInfoCircle /> About Us
            </SidebarLink>
            <SidebarLink href="/cart" onClick={() => setIsSidebarOpen(false)}>
              <FaShoppingCart /> My Cart
            </SidebarLink>
            <SidebarLink href="/orders" onClick={() => setIsSidebarOpen(false)}>
              <FaClipboardList /> My Orders
            </SidebarLink>
          </SidebarNav>

          {user ? (
            <UserInfo>
              <UserAvatar />
              <UserGreeting>👋 {user.name || user.email}</UserGreeting>
              <StartButton onClick={handleLogout} style={{ marginTop: "1rem" }}>
                <FaSignOutAlt /> Logout
              </StartButton>
            </UserInfo>
          ) : (
            <UserInfo>
              <SidebarLink href="/login" onClick={() => setIsSidebarOpen(false)}>
                <FaSignInAlt /> Login
              </SidebarLink>
              <SidebarLink href="/register" onClick={() => setIsSidebarOpen(false)}>
                <FaUserPlus /> Register
              </SidebarLink>
            </UserInfo>
          )}
        </Sidebar>
      )}
    </AnimatePresence>

    {/* Section 1 */}
    <Section>
      <Background bgUrl="https://w0.peakpx.com/wallpaper/1009/703/HD-wallpaper-fabric-abstract-pattern-fabric-textures-geometric-ornaments-fabric-patterns-fabric-backgrounds.jpg" style={{y:fabricY}}/>
      <Content initial={{opacity:0,y:60}} whileInView={{opacity:1,y:0}} transition={{duration:1}}>
        <ImageOverlayWrapper>
          <MotionImage src="https://img.freepik.com/free-photo/portrait-beautiful-cute-brunette-woman-model-casual-summer-dress-with-no-makeup-isolated-white-full-length_158538-23330.jpg" alt="Header Girl" layout="responsive" width={400} height={933} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} transition={{duration:1}} priority/>
        </ImageOverlayWrapper>
        <TextCard>
          <h1>Elegance in Every Thread</h1>
          <p>Welcome to the world where every fabric tells a story.</p>
        </TextCard>
      </Content>
    </Section>

    {/* Section 2 */}
    <Section>
      <Background bgUrl="https://images.unsplash.com/photo-1496747611176-843222e1e57c?fm=jpg&q=60&w=3000" style={{y:floralY}}/>
      <Content initial={{opacity:0,y:60}} whileInView={{opacity:1,y:0}} transition={{duration:1}}>
        <ImageOverlayWrapper>
          <MotionImage src="https://cdn.pixabay.com/photo/2021/09/15/12/34/woman-6626742_1280.jpg" alt="Content Girl" layout="responsive" width={400} height={700} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} transition={{duration:1}}/>
        </ImageOverlayWrapper>
        <TextCard>
          <h2>Celebrating Individuality</h2>
          <p>Our fashion reflects every woman’s vibrant story.</p>
        </TextCard>
      </Content>
    </Section>

    {/* Section 3 */}
    <Section>
      <Background bgUrl="https://static.vecteezy.com/system/resources/previews/035/977/673/non_2x/ai-generated-close-up-of-white-lace-fabric-with-flowers-background-and-texture-a-delicate-and-intricate-texture-of-lace-ai-generated-free-photo.jpg" style={{y:laceY}}/>
      <Content initial={{opacity:0,y:60}} whileInView={{opacity:1,y:0}} transition={{duration:1}}>
        <ImageOverlayWrapper>
          <MotionImage src="https://img.freepik.com/free-photo/happy-lady-stylish-skirt-boater-posing-pink-wall_197531-23653.jpg?semt=ais_hybrid&w=740" alt="Dress Maker" layout="responsive" width={400} height={700} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} transition={{duration:1}}/>
        </ImageOverlayWrapper>
        <TextCard>
          <h2>Crafted with Passion</h2>
          <p>Every stitch made with precision and care.</p>
        </TextCard>
      </Content>
    </Section>

    {/* CTA */}
    <ExploreNowContainer>
      <h2>Explore Our Collection</h2>
      <p>Discover the elegance that suits your style.</p>
      <StartButton onClick={()=>router.push("/explore")}>Start Now</StartButton>
    </ExploreNowContainer>
  </>
};

export default HomePage;
